import { BARBERS } from "./data";

export const INACTIVE_APPOINTMENT_STATUSES = [
  "cancelled_client",
  "cancelled_shop",
  "no_show",
] as const;

export const INACTIVE_STATUS_FILTER = `(${INACTIVE_APPOINTMENT_STATUSES.map(
  (status) => `"${status}"`
).join(",")})`;

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "").slice(0, 8);
}

export function isEightDigitPhone(value: string): boolean {
  return /^\d{8}$/.test(normalizePhone(value));
}

export function getBarberNames(): string[] {
  return BARBERS.map((barber) => barber.name);
}

export function normalizeBarberName(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "premier disponible") {
    return null;
  }

  const matchedBarber = BARBERS.find(
    (barber) =>
      barber.id.toLowerCase() === trimmed.toLowerCase() ||
      barber.name.toLowerCase() === trimmed.toLowerCase()
  );

  return matchedBarber?.name ?? trimmed;
}
