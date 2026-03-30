import { NextRequest, NextResponse } from "next/server";
import {
  getBarberNames,
  INACTIVE_STATUS_FILTER,
  normalizeBarberName,
} from "@/lib/booking";
import { listMockAppointments, listMockBlockedTimes } from "@/lib/mockReservations";

const BUSINESS_HOURS = {
  weekdays: { open: 9, close: 20 },
  sunday: { open: 9, close: 16 },
};

function generateSlots(openHour: number, closeHour: number, intervalMinutes = 30): string[] {
  const slots: string[] = [];
  const openMinutes = openHour * 60;
  const closeMinutes = closeHour * 60;

  for (let minutes = openMinutes; minutes < closeMinutes; minutes += intervalMinutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    slots.push(
      `${hours.toString().padStart(2, "0")}:${remainingMinutes.toString().padStart(2, "0")}`
    );
  }

  return slots;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function slotOverlaps(
  slotTime: string,
  slotDuration: number,
  existingStart: Date,
  existingEnd: Date,
  date: string
): boolean {
  const slotStartMinutes = timeToMinutes(slotTime);
  const slotEndMinutes = slotStartMinutes + slotDuration;
  const dayStart = new Date(`${date}T00:00:00`);
  const existingStartMinutes = (existingStart.getTime() - dayStart.getTime()) / (1000 * 60);
  const existingEndMinutes = (existingEnd.getTime() - dayStart.getTime()) / (1000 * 60);

  return slotStartMinutes < existingEndMinutes && slotEndMinutes > existingStartMinutes;
}

function filterAvailableSlots({
  barber,
  barberNames,
  bookings,
  date,
  duration,
  validSlots,
}: {
  barber: string | null;
  barberNames: string[];
  bookings: Array<{ barber: string | null; start: Date; end: Date }>;
  date: string;
  duration: number;
  validSlots: string[];
}): string[] {
  return validSlots.filter((slot) => {
    if (barber) {
      return !bookings.some(
        (booking) =>
          booking.barber === barber &&
          slotOverlaps(slot, duration, booking.start, booking.end, date)
      );
    }

    const unavailableBarbers = new Set<string>();

    bookings.forEach((booking) => {
      if (!slotOverlaps(slot, duration, booking.start, booking.end, date)) {
        return;
      }

      if (booking.barber) {
        unavailableBarbers.add(booking.barber);
        return;
      }

      barberNames.forEach((name) => unavailableBarbers.add(name));
    });

    return unavailableBarbers.size < barberNames.length;
  });
}

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
  const barber = normalizeBarberName(searchParams.get("barber"));
  const durationStr = searchParams.get("duration");

  if (!date || !durationStr) {
    return NextResponse.json({ error: "Missing date or duration" }, { status: 400 });
  }

  const duration = parseInt(durationStr, 10);
  if (Number.isNaN(duration)) {
    return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
  }

  const selectedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(selectedDate.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  if (selectedDate.getTime() < todayStart.getTime()) {
    return NextResponse.json([]);
  }

  const dayOfWeek = new Date(`${date}T00:00:00`).getDay();
  const hours = dayOfWeek === 0 ? BUSINESS_HOURS.sunday : BUSINESS_HOURS.weekdays;
  const allSlots = generateSlots(hours.open, hours.close, 30);
  const closeMinutes = hours.close * 60;
  const validSlots = allSlots.filter((slot) => {
    const slotStartMinutes = timeToMinutes(slot);
    const slotDateTime = new Date(`${date}T${slot}:00`);

    if (isSameDay(selectedDate, now) && slotDateTime.getTime() <= now.getTime()) {
      return false;
    }

    return slotStartMinutes + duration <= closeMinutes;
  });
  const barberNames = getBarberNames();
  const supabase = await getSupabaseClient();

  if (!supabase) {
    const dayStart = new Date(`${date}T00:00:00`).getTime();
    const dayEnd = new Date(`${date}T23:59:59`).getTime();
    const bookings = [
      ...listMockAppointments()
        .filter((appointment) => {
          const start = new Date(appointment.start_time).getTime();
          return (
            appointment.status !== "cancelled_client" &&
            appointment.status !== "cancelled_shop" &&
            appointment.status !== "no_show" &&
            start >= dayStart &&
            start <= dayEnd
          );
        })
        .map((appointment) => ({
          barber: normalizeBarberName(appointment.barber),
          start: new Date(appointment.start_time),
          end: new Date(appointment.end_time),
        })),
      ...listMockBlockedTimes()
        .filter((blockedTime) => {
          const start = new Date(blockedTime.start_time).getTime();
          return start >= dayStart && start <= dayEnd;
        })
        .map((blockedTime) => ({
          barber: normalizeBarberName(blockedTime.barber),
          start: new Date(blockedTime.start_time),
          end: new Date(blockedTime.end_time),
        })),
    ];

    return NextResponse.json(
      filterAvailableSlots({
        barber,
        barberNames,
        bookings,
        date,
        duration,
        validSlots,
      })
    );
  }

  try {
    const dayStart = `${date}T00:00:00`;
    const dayEnd = `${date}T23:59:59`;

    let appointmentQuery = supabase
      .from("appointments")
      .select("start_time, end_time, barber")
      .gte("start_time", dayStart)
      .lte("start_time", dayEnd)
      .not("status", "in", INACTIVE_STATUS_FILTER);

    let blockedQuery = supabase
      .from("blocked_times")
      .select("start_time, end_time, barber")
      .gte("start_time", dayStart)
      .lte("start_time", dayEnd);

    if (barber) {
      appointmentQuery = appointmentQuery.eq("barber", barber);
      blockedQuery = blockedQuery.eq("barber", barber);
    }

    const [{ data: appointments }, { data: blockedTimes }] = await Promise.all([
      appointmentQuery,
      blockedQuery,
    ]);

    const bookings = [...(appointments ?? []), ...(blockedTimes ?? [])].map((entry) => ({
      barber: normalizeBarberName(entry.barber),
      start: new Date(entry.start_time),
      end: new Date(entry.end_time),
    }));

    return NextResponse.json(
      filterAvailableSlots({
        barber,
        barberNames,
        bookings,
        date,
        duration,
        validSlots,
      })
    );
  } catch (error) {
    console.error("Availability error:", error);
    return NextResponse.json(validSlots);
  }
}
