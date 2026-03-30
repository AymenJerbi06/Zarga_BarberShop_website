import { NextRequest, NextResponse } from "next/server";
import {
  getBarberNames,
  INACTIVE_STATUS_FILTER,
  isEightDigitPhone,
  normalizeBarberName,
  normalizePhone,
} from "@/lib/booking";
import {
  createMockAppointment,
  listMockAppointments,
  listMockBlockedTimes,
} from "@/lib/mockReservations";

function getNotificationEmail(barberName: string): string | null {
  const envKey = `BARBER_EMAIL_${barberName.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}`;
  return process.env[envKey] ?? process.env.SHOP_NOTIFICATION_EMAIL ?? null;
}

async function sendBarberNotification({
  appointmentId,
  barberName,
  clientName,
  clientPhone,
  clientEmail,
  serviceName,
  startTime,
  endTime,
  notes,
}: {
  appointmentId: string;
  barberName: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  serviceName: string;
  startTime: string;
  endTime: string;
  notes?: string | null;
}) {
  const recipient = getNotificationEmail(barberName);
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!recipient || !resendApiKey || !fromEmail) {
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: fromEmail,
      to: recipient,
      subject: `Nouvelle reservation pour ${barberName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Nouvelle reservation</h2>
          <p><strong>Reference:</strong> ${appointmentId}</p>
          <p><strong>Barbier:</strong> ${barberName}</p>
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Telephone:</strong> ${clientPhone}</p>
          <p><strong>Email:</strong> ${clientEmail || "Non renseigne"}</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Debut:</strong> ${startTime}</p>
          <p><strong>Fin:</strong> ${endTime}</p>
          <p><strong>Notes:</strong> ${notes || "Aucune"}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Notification email error:", error);
  }
}

// Helper to create Supabase client safely
async function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  try {
    const { createClient } = await import("@supabase/supabase-js");
    return createClient(url, key);
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const barber = searchParams.get("barber");
  const status = searchParams.get("status");

  const supabase = await getSupabaseClient();

  if (!supabase) {
    let data = listMockAppointments();

    if (date) {
      const dayStart = new Date(`${date}T00:00:00`).getTime();
      const dayEnd = new Date(`${date}T23:59:59`).getTime();
      data = data.filter((appointment) => {
        const start = new Date(appointment.start_time).getTime();
        return start >= dayStart && start <= dayEnd;
      });
    }

    if (barber) {
      const normalizedRequestedBarber = normalizeBarberName(barber);
      data = data.filter(
        (appointment) => normalizeBarberName(appointment.barber) === normalizedRequestedBarber
      );
    }

    if (status) {
      data = data.filter((appointment) => appointment.status === status);
    }

    return NextResponse.json(data, { status: 200 });
  }

  try {
    let query = supabase
      .from("appointments")
      .select("*")
      .order("start_time", { ascending: true });

    if (date) {
      const dayStart = `${date}T00:00:00`;
      const dayEnd = `${date}T23:59:59`;
      query = query.gte("start_time", dayStart).lte("start_time", dayEnd);
    }

    if (barber) {
      query = query.ilike("barber", barber);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    clientName,
    clientPhone,
    clientEmail,
    barber,
    serviceName,
    serviceCategory,
    durationMinutes,
    price,
    startTime,
    notes,
  } = body;

  const rawPhone = String(clientPhone ?? "").trim();
  const normalizedPhone = normalizePhone(rawPhone);
  const normalizedBarber = normalizeBarberName(barber);
  const serviceDuration = Number(durationMinutes);
  const servicePrice = Number(price);

  if (!clientName?.trim()) {
    return NextResponse.json({ error: "Le nom du client est obligatoire." }, { status: 400 });
  }

  if (!/^\d{8}$/.test(rawPhone) || !isEightDigitPhone(normalizedPhone)) {
    return NextResponse.json(
      { error: "Le numero de telephone doit contenir exactement 8 chiffres." },
      { status: 400 }
    );
  }

  if (
    !serviceName ||
    !serviceCategory ||
    !Number.isFinite(serviceDuration) ||
    serviceDuration <= 0 ||
    !Number.isFinite(servicePrice) ||
    !startTime
  ) {
    return NextResponse.json(
      { error: "Les informations de reservation sont incompletes." },
      { status: 400 }
    );
  }

  const start = new Date(startTime);
  if (Number.isNaN(start.getTime())) {
    return NextResponse.json({ error: "La date de reservation est invalide." }, { status: 400 });
  }

  if (start.getTime() <= Date.now()) {
    return NextResponse.json(
      { error: "Impossible de reserver une date ou une heure deja passee." },
      { status: 400 }
    );
  }

  const end = new Date(start.getTime() + serviceDuration * 60 * 1000);

  const appointmentData = {
    client_name: clientName,
    client_phone: normalizedPhone,
    client_email: clientEmail ?? null,
    barber: normalizedBarber ?? "Premier disponible",
    service_name: serviceName,
    service_category: serviceCategory,
    duration_minutes: serviceDuration,
    price: servicePrice,
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    status: "pending",
    notes: notes ?? null,
    booking_source: "online",
  };

  const supabase = await getSupabaseClient();

  if (!supabase) {
    const allowPreviewMode =
      process.env.NODE_ENV !== "production" && process.env.ALLOW_MOCK_BOOKINGS !== "false";

    if (!allowPreviewMode) {
      return NextResponse.json(
        { error: "La base de donnees n'est pas configuree pour les reservations." },
        { status: 503 }
      );
    }

    const barberNames = getBarberNames();
    const overlapStart = start.getTime();
    const overlapEnd = end.getTime();
    const mockAppointments = listMockAppointments().filter(
      (appointment) =>
        appointment.status !== "cancelled_client" &&
        appointment.status !== "cancelled_shop" &&
        appointment.status !== "no_show" &&
        new Date(appointment.start_time).getTime() < overlapEnd &&
        new Date(appointment.end_time).getTime() > overlapStart
    );
    const mockBlockedTimes = listMockBlockedTimes().filter(
      (blockedTime) =>
        new Date(blockedTime.start_time).getTime() < overlapEnd &&
        new Date(blockedTime.end_time).getTime() > overlapStart
    );

    const unavailableBarbers = new Set<string>();
    [...mockAppointments, ...mockBlockedTimes].forEach((entry) => {
      const bookedBarber = normalizeBarberName(entry.barber);

      if (bookedBarber) {
        unavailableBarbers.add(bookedBarber);
        return;
      }

      barberNames.forEach((name) => unavailableBarbers.add(name));
    });

    const assignedBarber =
      normalizedBarber ?? barberNames.find((barberName) => !unavailableBarbers.has(barberName));

    if (!assignedBarber) {
      return NextResponse.json(
        {
          error:
            "Ce creneau n'est plus disponible. Merci de choisir une autre heure ou un autre barbier.",
        },
        { status: 409 }
      );
    }

    if (normalizedBarber && unavailableBarbers.has(normalizedBarber)) {
      return NextResponse.json(
        {
          error:
            "Ce creneau n'est plus disponible pour ce barbier. Merci de choisir une autre heure.",
        },
        { status: 409 }
      );
    }

    const mockId = `ZRG-${Date.now().toString(36).toUpperCase()}`;
    const mockAppointment = createMockAppointment({
      id: mockId,
      client_id: null,
      ...appointmentData,
      barber: assignedBarber,
    });

    return NextResponse.json(mockAppointment, { status: 201 });
  }

  try {
    const barberNames = getBarberNames();
    const overlapStart = start.toISOString();
    const overlapEnd = end.toISOString();

    let appointmentQuery = supabase
      .from("appointments")
      .select("barber")
      .lt("start_time", overlapEnd)
      .gt("end_time", overlapStart)
      .not("status", "in", INACTIVE_STATUS_FILTER);

    let blockedQuery = supabase
      .from("blocked_times")
      .select("barber")
      .lt("start_time", overlapEnd)
      .gt("end_time", overlapStart);

    if (normalizedBarber) {
      appointmentQuery = appointmentQuery.eq("barber", normalizedBarber);
      blockedQuery = blockedQuery.eq("barber", normalizedBarber);
    }

    const [{ data: overlappingAppointments }, { data: overlappingBlockedTimes }] =
      await Promise.all([appointmentQuery, blockedQuery]);

    const unavailableBarbers = new Set<string>();
    [...(overlappingAppointments ?? []), ...(overlappingBlockedTimes ?? [])].forEach((entry) => {
      const bookedBarber = normalizeBarberName(entry.barber);

      if (bookedBarber) {
        unavailableBarbers.add(bookedBarber);
        return;
      }

      barberNames.forEach((name) => unavailableBarbers.add(name));
    });

    const assignedBarber =
      normalizedBarber ?? barberNames.find((barberName) => !unavailableBarbers.has(barberName));

    if (!assignedBarber) {
      return NextResponse.json(
        {
          error:
            "Ce creneau n'est plus disponible. Merci de choisir une autre heure ou un autre barbier.",
        },
        { status: 409 }
      );
    }

    if (normalizedBarber && unavailableBarbers.has(normalizedBarber)) {
      return NextResponse.json(
        {
          error:
            "Ce creneau n'est plus disponible pour ce barbier. Merci de choisir une autre heure.",
        },
        { status: 409 }
      );
    }

    appointmentData.barber = assignedBarber;

    // Upsert client
    let clientId: string | null = null;
    const { data: existingClient } = await supabase
      .from("clients")
      .select("id, name, email")
      .eq("phone", normalizedPhone)
      .single();

    if (existingClient) {
      clientId = existingClient.id;

      if (existingClient.name !== clientName || existingClient.email !== (clientEmail ?? null)) {
        await supabase
          .from("clients")
          .update({
            name: clientName,
            email: clientEmail ?? null,
          })
          .eq("id", clientId);
      }
    } else {
      const { data: newClient } = await supabase
        .from("clients")
        .insert({
          name: clientName,
          phone: normalizedPhone,
          email: clientEmail ?? null,
        })
        .select("id")
        .single();
      clientId = newClient?.id ?? null;
    }

    const { data, error } = await supabase
      .from("appointments")
      .insert({ ...appointmentData, client_id: clientId })
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "La reservation n'a pas pu etre enregistree. Merci de reessayer." },
        { status: 500 }
      );
    }

    await sendBarberNotification({
      appointmentId: data.id,
      barberName: appointmentData.barber,
      clientName,
      clientPhone: normalizedPhone,
      clientEmail: clientEmail ?? null,
      serviceName,
      startTime: appointmentData.start_time,
      endTime: appointmentData.end_time,
      notes: notes ?? null,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Une erreur serveur a empeche la reservation." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, status } = body;

  const supabase = await getSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ id, status }, { status: 200 });
  }

  try {
    const { data, error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ id, status }, { status: 200 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ id, status }, { status: 200 });
  }
}
