import type { Metadata } from "next";
import BookingFlow from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Reserver",
  description:
    "Prenez rendez-vous en ligne chez Zarga Barbershop. Choisissez votre service, votre barbier, la date et l'heure.",
};

export default function BookPage() {
  return <BookingFlow />;
}
