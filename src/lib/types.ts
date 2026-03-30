export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  priceFrom?: boolean;
  duration: number;
  description: string;
  requiresConsultation?: boolean;
}

export type ServiceCategory =
  | "Coupe de Cheveux"
  | "Barbe"
  | "Forfaits"
  | "Extras";

export interface Barber {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  phone: string;
  bio: string;
  image?: string;
}

export interface Appointment {
  id: string;
  client_id?: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  barber: string;
  service_name: string;
  service_category: string;
  duration_minutes: number;
  price: number;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes?: string;
  booking_source: string;
  created_at: string;
}

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "arrived"
  | "in_service"
  | "completed"
  | "cancelled_client"
  | "cancelled_shop"
  | "no_show"
  | "rescheduled";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferred_barber?: string;
  no_show_count: number;
  total_appointments: number;
  notes?: string;
  created_at: string;
}

export interface BlockedTime {
  id: string;
  barber: string;
  start_time: string;
  end_time: string;
  reason?: string;
}

export interface BookingFormData {
  bookingType: "solo" | "groupe";
  serviceCategory?: ServiceCategory;
  service?: Service;
  barber?: Barber | null;
  date?: string;
  time?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
