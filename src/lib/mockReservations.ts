type MockAppointment = {
  id: string;
  client_id: string | null;
  client_name: string;
  client_phone: string;
  client_email: string | null;
  barber: string;
  service_name: string;
  service_category: string;
  duration_minutes: number;
  price: number;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
  booking_source: string;
  created_at: string;
  preview: true;
};

type MockBlockedTime = {
  id: string;
  barber: string;
  start_time: string;
  end_time: string;
  reason?: string | null;
  created_at: string;
};

type MockReservationStore = {
  appointments: MockAppointment[];
  blockedTimes: MockBlockedTime[];
};

const globalForReservations = globalThis as typeof globalThis & {
  __zargaMockReservationStore?: MockReservationStore;
};

function getStore(): MockReservationStore {
  if (!globalForReservations.__zargaMockReservationStore) {
    globalForReservations.__zargaMockReservationStore = {
      appointments: [],
      blockedTimes: [],
    };
  }

  return globalForReservations.__zargaMockReservationStore;
}

export function listMockAppointments(): MockAppointment[] {
  return getStore().appointments;
}

export function listMockBlockedTimes(): MockBlockedTime[] {
  return getStore().blockedTimes;
}

export function createMockAppointment(
  appointment: Omit<MockAppointment, "created_at" | "preview">
): MockAppointment {
  const record: MockAppointment = {
    ...appointment,
    created_at: new Date().toISOString(),
    preview: true,
  };

  getStore().appointments.push(record);
  return record;
}
