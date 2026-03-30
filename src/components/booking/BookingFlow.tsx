"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  Phone,
  Scissors,
  User,
  Users,
} from "lucide-react";
import { format, addDays, getDay, startOfToday } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/Button";
import { BARBERS, SERVICE_CATEGORIES, SERVICES } from "@/lib/data";
import { isEightDigitPhone, normalizePhone } from "@/lib/booking";
import type { Barber, BookingFormData } from "@/lib/types";
import { formatDuration, formatPrice } from "@/lib/utils";

const TOTAL_STEPS = 8;
const BOOKING_WINDOW_DAYS = 21;

const stepLabels = [
  "Type",
  "Categorie",
  "Service",
  "Barbier",
  "Date",
  "Heure",
  "Infos",
  "Confirmation",
];

const initialData: BookingFormData = {
  bookingType: "solo",
  serviceCategory: undefined,
  service: undefined,
  barber: undefined,
  date: undefined,
  time: undefined,
  clientName: "",
  clientPhone: "",
  clientEmail: "",
  notes: "",
};

const stepTitleClass = "mb-2 font-display text-3xl font-semibold text-[#111111]";
const stepSubtitleClass = "mb-8 text-[#5f5f5f]";
const inputClass =
  "w-full rounded-full border border-[#ddd7ce] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition-colors placeholder:text-[#9a9386] focus:border-[#111111]";
const getCardClass = (selected: boolean) =>
  selected
    ? "border-[#111111] bg-[#f7f4ef] shadow-[0_16px_36px_rgba(17,17,17,0.08)]"
    : "border-[#ddd7ce] bg-white hover:border-[#111111]/35";

const generateFallbackSlots = (date: string): string[] => {
  const currentDate = new Date(date);
  const isSunday = getDay(currentDate) === 0;
  const closeHour = isSunday ? 16 : 20;
  const slots: string[] = [];

  for (let hour = 9; hour < closeHour; hour += 1) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    slots.push(`${hour.toString().padStart(2, "0")}:30`);
  }

  return slots;
};

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const getDisplaySlots = (date: string, duration: number): string[] => {
  const currentDate = new Date(date);
  const isSunday = getDay(currentDate) === 0;
  const closeHour = isSunday ? 16 : 20;
  const closeMinutes = closeHour * 60;

  return generateFallbackSlots(date).filter(
    (slot) => timeToMinutes(slot) + duration <= closeMinutes
  );
};

export default function BookingFlow() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BookingFormData>(initialData);
  const [dayAvailability, setDayAvailability] = useState<Record<string, boolean>>({});
  const [loadingDays, setLoadingDays] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationId, setConfirmationId] = useState("");
  const [submissionError, setSubmissionError] = useState("");

  const next = () => setStep((current) => Math.min(current + 1, TOTAL_STEPS));
  const back = () => setStep((current) => Math.max(current - 1, 1));

  const fetchSlots = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const params = new URLSearchParams({
        date: data.date!,
        duration: String(data.service!.duration),
        ...(data.barber ? { barber: data.barber.id } : {}),
      });
      const response = await fetch(`/api/availability?${params}`);
      if (response.ok) {
        const slots = await response.json();
        setAvailableSlots(slots);
        setData((current) =>
          current.time && !slots.includes(current.time) ? { ...current, time: undefined } : current
        );
      } else {
        setAvailableSlots(generateFallbackSlots(data.date!));
      }
    } catch {
      setAvailableSlots(generateFallbackSlots(data.date!));
    } finally {
      setLoadingSlots(false);
    }
  }, [data.barber, data.date, data.service]);

  const fetchDayAvailability = useCallback(async () => {
    if (!data.service) {
      return;
    }

    const serviceDuration = data.service.duration;
    setLoadingDays(true);

    try {
      const bookingDays = Array.from({ length: BOOKING_WINDOW_DAYS }, (_, index) =>
        addDays(startOfToday(), index)
      );

      const availabilityEntries = await Promise.all(
        bookingDays.map(async (day) => {
          const dateStr = format(day, "yyyy-MM-dd");

          try {
            const params = new URLSearchParams({
              date: dateStr,
              duration: String(serviceDuration),
              ...(data.barber ? { barber: data.barber.id } : {}),
            });
            const response = await fetch(`/api/availability?${params}`);

            if (!response.ok) {
              return [dateStr, true] as const;
            }

            const slots: string[] = await response.json();
            return [dateStr, slots.length > 0] as const;
          } catch {
            return [dateStr, true] as const;
          }
        })
      );

      const nextAvailability = Object.fromEntries(availabilityEntries);
      setDayAvailability(nextAvailability);
      setData((current) =>
        current.date && nextAvailability[current.date] === false
          ? { ...current, date: undefined, time: undefined }
          : current
      );
    } finally {
      setLoadingDays(false);
    }
  }, [data.barber, data.service]);

  useEffect(() => {
    if (step === 6 && data.date && data.service) {
      void fetchSlots();
    }
  }, [step, data.date, data.service, fetchSlots]);

  useEffect(() => {
    if (step === 5 && data.service) {
      void fetchDayAvailability();
    }
  }, [step, data.service, data.barber, fetchDayAvailability]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmissionError("");
    try {
      const payload = {
        clientName: data.clientName,
        clientPhone: normalizePhone(data.clientPhone),
        clientEmail: data.clientEmail,
        barber: data.barber?.name ?? "Premier disponible",
        serviceName: data.service?.name,
        serviceCategory: data.service?.category,
        durationMinutes: data.service?.duration,
        price: data.service?.price,
        startTime: `${data.date}T${data.time}:00`,
        notes: data.notes,
      };

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          typeof result?.error === "string"
            ? result.error
            : "La reservation n'a pas pu etre enregistree."
        );
      }

      setConfirmationId(result.id ?? `ZRG-${Date.now().toString(36).toUpperCase()}`);
      setStep(8);
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "La reservation n'a pas pu etre enregistree."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="mb-10 flex items-center gap-1 overflow-x-auto pb-2">
      {stepLabels.map((label, index) => {
        const number = index + 1;
        const isCompleted = number < step;
        const isCurrent = number === step;

        return (
          <div key={number} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  isCompleted
                    ? "bg-[#111111] text-white"
                    : isCurrent
                    ? "border-2 border-[#111111] bg-white text-[#111111]"
                    : "bg-[#ece6dc] text-[#8d8476]"
                }`}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : number}
              </div>
              <span
                className={`hidden whitespace-nowrap text-[10px] sm:block ${
                  isCurrent ? "text-[#111111]" : "text-[#8d8476]"
                }`}
              >
                {label}
              </span>
            </div>
            {index < stepLabels.length - 1 && (
              <div
                className={`mx-1 h-px min-w-[18px] flex-1 transition-colors ${
                  number < step ? "bg-[#111111]" : "bg-[#ddd7ce]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const NavigationButtons = ({
    nextLabel = "Suivant",
    nextDisabled = false,
    showSubmit = false,
  }: {
    nextLabel?: string;
    nextDisabled?: boolean;
    showSubmit?: boolean;
  }) => (
    <div className="mt-8 flex items-center justify-between border-t border-[#ddd7ce] pt-6">
      {step > 1 ? (
        <Button variant="ghost" size="md" onClick={back}>
          <ChevronLeft className="h-4 w-4" />
          Retour
        </Button>
      ) : (
        <div />
      )}

      {showSubmit ? (
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          loading={submitting}
          disabled={nextDisabled}
        >
          Confirmer la reservation
          <Check className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="primary" size="md" onClick={next} disabled={nextDisabled}>
          {nextLabel}
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  const Step1 = () => {
    const types = [
      {
        id: "solo" as const,
        icon: User,
        title: "Reservation Solo",
        desc: "Un rendez-vous pour vous",
      },
      {
        id: "groupe" as const,
        icon: Users,
        title: "Reservation Groupe",
        desc: "2+ personnes ensemble",
      },
    ];

    return (
      <div>
        <h2 className={stepTitleClass}>Choisissez votre type de reservation</h2>
        <p className={stepSubtitleClass}>Comment souhaitez-vous reserver ?</p>

        <div className="grid gap-4 sm:grid-cols-3">
          {types.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => {
                setData((current) => ({ ...current, bookingType: type.id }));
                next();
              }}
              className={`group rounded-[24px] border p-6 text-left transition-all duration-200 ${getCardClass(
                data.bookingType === type.id
              )}`}
            >
              <type.icon
                className={`mb-4 h-8 w-8 ${
                  data.bookingType === type.id ? "text-[#111111]" : "text-[#7b7b7b]"
                }`}
              />
              <h3 className="mb-1 font-semibold text-[#111111]">{type.title}</h3>
              <p className="text-sm text-[#5f5f5f]">{type.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const Step2 = () => (
    <div>
      <h2 className={stepTitleClass}>Categorie de service</h2>
      <p className={stepSubtitleClass}>Que souhaitez-vous faire aujourd&apos;hui ?</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {SERVICE_CATEGORIES.map((category) => {
          const count = SERVICES.filter((service) => service.category === category).length;
          return (
            <button
              key={category}
              type="button"
              onClick={() => {
                setData((current) => ({
                  ...current,
                  serviceCategory: category,
                  service: undefined,
                }));
                next();
              }}
              className={`rounded-[24px] border p-6 text-left transition-all duration-200 ${getCardClass(
                data.serviceCategory === category
              )}`}
            >
              <Scissors className="mb-3 h-6 w-6 text-[#111111]" />
              <h3 className="mb-1 text-sm font-semibold text-[#111111]">{category}</h3>
              <p className="text-xs text-[#7b7b7b]">{count} services</p>
            </button>
          );
        })}
      </div>
      <NavigationButtons nextDisabled={!data.serviceCategory} />
    </div>
  );

  const Step3 = () => {
    const categoryServices = SERVICES.filter(
      (service) => service.category === data.serviceCategory
    );

    return (
      <div>
        <h2 className={stepTitleClass}>Choisissez votre service</h2>
        <p className={stepSubtitleClass}>{data.serviceCategory}</p>
        <div className="space-y-3">
          {categoryServices.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => {
                setData((current) => ({ ...current, service }));
                next();
              }}
              className={`group flex w-full items-center justify-between rounded-[24px] border p-5 text-left transition-all duration-200 ${getCardClass(
                data.service?.id === service.id
              )}`}
            >
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-[#111111]">{service.name}</h3>
                <p className="text-sm text-[#5f5f5f]">{service.description}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-[#7b7b7b]">
                    <Clock className="h-3 w-3" />
                    {formatDuration(service.duration)}
                  </span>
                  {service.requiresConsultation && (
                    <span className="text-xs text-[#111111]">Consultation incluse</span>
                  )}
                </div>
              </div>
              <div className="ml-4 text-right">
                <span className="font-display text-lg font-bold text-[#111111]">
                  {formatPrice(service.price, service.priceFrom)}
                </span>
              </div>
            </button>
          ))}
        </div>
        <NavigationButtons nextDisabled={!data.service} />
      </div>
    );
  };

  const Step4 = () => (
    <div>
      <h2 className={stepTitleClass}>Choisissez votre barbier</h2>
      <p className={stepSubtitleClass}>Avec qui souhaitez-vous votre rendez-vous ?</p>
      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            setData((current) => ({ ...current, barber: null }));
            next();
          }}
          className={`rounded-[24px] border p-5 text-left transition-all duration-200 ${getCardClass(
            data.barber === null
          )}`}
        >
          <Users className="mb-3 h-6 w-6 text-[#111111]" />
          <h3 className="font-semibold text-[#111111]">Premier disponible</h3>
          <p className="mt-1 text-sm text-[#5f5f5f]">
            Assigne automatiquement selon les disponibilites
          </p>
        </button>

        {BARBERS.map((barber) => (
          <button
            key={barber.id}
            type="button"
            onClick={() => {
              setData((current) => ({ ...current, barber }));
              next();
            }}
            className={`rounded-[24px] border p-5 text-left transition-all duration-200 ${getCardClass(
              (data.barber as Barber | undefined | null)?.id === barber.id
            )}`}
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-sm font-bold text-white">
                {barber.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-[#111111]">{barber.name}</h3>
                <p className="text-xs text-[#7b7b7b]">{barber.title}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {barber.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-full border border-[#ddd7ce] px-2 py-0.5 text-xs text-[#7b7b7b]"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
      <NavigationButtons nextDisabled={data.barber === undefined} />
    </div>
  );

  const Step5 = () => {
    const today = startOfToday();
    const days = Array.from({ length: BOOKING_WINDOW_DAYS }, (_, index) => addDays(today, index));

    return (
      <div>
        <h2 className={stepTitleClass}>Choisissez votre date</h2>
        <p className={stepSubtitleClass}>Selectionnez un jour disponible</p>
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-[#6f675b]">
          <span className="rounded-full border border-[#ddd7ce] bg-white px-3 py-1">
            Disponible
          </span>
          <span className="rounded-full border border-[#111111] bg-[#111111] px-3 py-1 text-white">
            Selectionne
          </span>
          <span className="rounded-full border border-[#d8d1c7] bg-[#ebe6df] px-3 py-1 line-through">
            Complet
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7">
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const dayName = format(day, "EEE", { locale: fr });
            const dayNumber = format(day, "d");
            const month = format(day, "MMM", { locale: fr });
            const isSelected = data.date === dateStr;
            const isAvailable = dayAvailability[dateStr] ?? true;
            const isDisabled = loadingDays || !isAvailable;

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isDisabled}
                onClick={() => {
                  if (isDisabled) {
                    return;
                  }

                  setData((current) => ({ ...current, date: dateStr, time: undefined }));
                  next();
                }}
                className={`rounded-[20px] border p-3 text-center transition-all duration-200 ${
                  isSelected
                    ? getCardClass(true)
                    : isDisabled
                      ? "cursor-not-allowed border-[#d8d1c7] bg-[#ebe6df] text-[#7d7467] opacity-80"
                      : getCardClass(false)
                }`}
              >
                <p className={`text-xs capitalize ${isDisabled ? "line-through" : "text-[#7b7b7b]"}`}>
                  {dayName}
                </p>
                <p
                  className={`font-display text-2xl font-semibold ${
                    isDisabled ? "line-through text-[#7d7467]" : "text-[#111111]"
                  }`}
                >
                  {dayNumber}
                </p>
                <p className={`text-xs capitalize ${isDisabled ? "line-through" : "text-[#7b7b7b]"}`}>
                  {month}
                </p>
              </button>
            );
          })}
        </div>
        {loadingDays && (
          <p className="mt-4 text-sm text-[#5f5f5f]">Verification des disponibilites...</p>
        )}
        <NavigationButtons nextDisabled={!data.date} />
      </div>
    );
  };

  const Step6 = () => (
    <div>
      <h2 className={stepTitleClass}>Choisissez l&apos;heure</h2>
      <p className={stepSubtitleClass}>
        {data.date
          ? format(new Date(`${data.date}T00:00:00`), "EEEE d MMMM yyyy", { locale: fr })
          : ""}
      </p>

      {loadingSlots ? (
        <div className="flex items-center justify-center py-16 text-[#5f5f5f]">
          <svg className="mr-3 h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Chargement des disponibilites...
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-[#6f675b]">
            <span className="rounded-full border border-[#ddd7ce] bg-white px-3 py-1">
              Disponible
            </span>
            <span className="rounded-full border border-[#111111] bg-[#111111] px-3 py-1 text-white">
              Selectionne
            </span>
            <span className="rounded-full border border-[#d8d1c7] bg-[#ebe6df] px-3 py-1 line-through">
              Indisponible
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {data.date &&
              data.service &&
              getDisplaySlots(data.date, data.service.duration).map((slot) => {
                const isAvailable = availableSlots.includes(slot);
                const isSelected = data.time === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => {
                      if (!isAvailable) {
                        return;
                      }

                      setData((current) => ({ ...current, time: slot }));
                      next();
                    }}
                    className={`rounded-full border px-3 py-3 text-center text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? "border-[#111111] bg-[#111111] text-white"
                        : isAvailable
                          ? "border-[#ddd7ce] bg-white text-[#111111] hover:border-[#111111]/40"
                          : "cursor-not-allowed border-[#d8d1c7] bg-[#ebe6df] text-[#7d7467] line-through opacity-80"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
          </div>
        </>
      )}

      {!loadingSlots && availableSlots.length === 0 && (
        <div className="py-16 text-center text-[#5f5f5f]">
          Aucun creneau disponible ce jour. Veuillez choisir une autre date.
        </div>
      )}

      <NavigationButtons nextDisabled={!data.time} />
    </div>
  );

  const Step7 = () => {
    const normalizedPhone = normalizePhone(data.clientPhone);
    const isPhoneValid = isEightDigitPhone(normalizedPhone);
    const showPhoneError = data.clientPhone.length > 0 && !isPhoneValid;
    const isValid = data.clientName.trim().length > 1 && isPhoneValid;

    return (
      <div>
        <h2 className={stepTitleClass}>Vos informations</h2>
        <p className={stepSubtitleClass}>Pour confirmer votre rendez-vous</p>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm tracking-wide text-[#5f5f5f]">Nom complet *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b7b7b]" />
              <input
                type="text"
                value={data.clientName}
                onChange={(event) =>
                  setData((current) => ({ ...current, clientName: event.target.value }))
                }
                placeholder="Votre nom"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm tracking-wide text-[#5f5f5f]">Telephone *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b7b7b]" />
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{8}"
                maxLength={8}
                value={data.clientPhone}
                onChange={(event) =>
                  setData((current) => ({
                    ...current,
                    clientPhone: normalizePhone(event.target.value),
                  }))
                }
                placeholder="22123456"
                className={`${inputClass} pl-10`}
              />
            </div>
            {showPhoneError && (
              <p className="mt-2 text-xs text-[#b42318]">
                Le numero de telephone doit contenir exactement 8 chiffres.
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm tracking-wide text-[#5f5f5f]">
              Email (optionnel)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b7b7b]" />
              <input
                type="email"
                value={data.clientEmail}
                onChange={(event) =>
                  setData((current) => ({ ...current, clientEmail: event.target.value }))
                }
                placeholder="votre@email.com"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm tracking-wide text-[#5f5f5f]">
              Notes ou demandes speciales
            </label>
            <textarea
              value={data.notes}
              onChange={(event) =>
                setData((current) => ({ ...current, notes: event.target.value }))
              }
              placeholder="Preferences de style, allergies, etc."
              rows={4}
              className="w-full rounded-[24px] border border-[#ddd7ce] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition-colors placeholder:text-[#9a9386] focus:border-[#111111] resize-none"
            />
          </div>
        </div>

        {submissionError && (
          <div className="mt-6 rounded-[20px] border border-[#f0c7c2] bg-[#fff4f2] px-4 py-3 text-sm text-[#8f1d13]">
            {submissionError}
          </div>
        )}

        <div className="mt-8 rounded-[24px] border border-[#ddd7ce] bg-[#faf8f4] p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#111111]">
            <CalendarDays className="h-4 w-4" />
            Recapitulatif
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#7b7b7b]">Service</span>
              <span className="text-[#111111]">{data.service?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7b7b7b]">Barbier</span>
              <span className="text-[#111111]">
                {data.barber === null ? "Premier disponible" : (data.barber as Barber)?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7b7b7b]">Date</span>
              <span className="text-[#111111]">
                {data.date
                  ? format(new Date(`${data.date}T00:00:00`), "EEEE d MMMM yyyy", {
                      locale: fr,
                    })
                  : "--"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7b7b7b]">Heure</span>
              <span className="text-[#111111]">{data.time ?? "--"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7b7b7b]">Duree</span>
              <span className="text-[#111111]">
                {formatDuration(data.service?.duration ?? 0)}
              </span>
            </div>
            <div className="mt-2 flex justify-between border-t border-[#ddd7ce] pt-3">
              <span className="font-semibold text-[#111111]">Total</span>
              <span className="font-display text-lg font-bold text-[#111111]">
                {formatPrice(data.service?.price ?? 0, data.service?.priceFrom)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-[#ddd7ce] pt-6">
          <Button variant="ghost" size="md" onClick={back}>
            <ChevronLeft className="h-4 w-4" />
            Retour
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            loading={submitting}
            disabled={!isValid}
          >
            Confirmer la reservation
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const Step8 = () => (
    <div className="py-8 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#111111] text-white">
        <CheckCircle className="h-10 w-10" />
      </div>
      <h2 className="mb-3 font-display text-4xl font-semibold text-[#111111]">
        Reservation confirmee !
      </h2>
      <p className="mb-2 text-[#5f5f5f]">
        Merci, <span className="font-semibold text-[#111111]">{data.clientName}</span>. Votre
        rendez-vous est enregistre.
      </p>
      {confirmationId && (
        <p className="mb-8 text-sm text-[#7b7b7b]">
          Reference : <span className="font-mono text-[#111111]">{confirmationId}</span>
        </p>
      )}

      <div className="mx-auto mb-8 max-w-md rounded-[24px] border border-[#ddd7ce] bg-white p-6 text-left">
        <h3 className="mb-4 border-b border-[#ddd7ce] pb-3 text-center font-semibold text-[#111111]">
          Details du rendez-vous
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[#7b7b7b]">Service</span>
            <span className="font-medium text-[#111111]">{data.service?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7b7b7b]">Barbier</span>
            <span className="font-medium text-[#111111]">
              {data.barber === null ? "Premier disponible" : (data.barber as Barber)?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7b7b7b]">Date & Heure</span>
            <span className="font-medium text-[#111111]">
              {data.date
                ? format(new Date(`${data.date}T00:00:00`), "d MMM yyyy", { locale: fr })
                : "--"}{" "}
              a {data.time}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7b7b7b]">Duree</span>
            <span className="font-medium text-[#111111]">
              {formatDuration(data.service?.duration ?? 0)}
            </span>
          </div>
          <div className="flex justify-between border-t border-[#ddd7ce] pt-3">
            <span className="font-semibold text-[#111111]">Prix</span>
            <span className="font-display font-bold text-[#111111]">
              {formatPrice(data.service?.price ?? 0, data.service?.priceFrom)}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto mb-8 max-w-md rounded-[24px] border border-[#ddd7ce] bg-[#faf8f4] p-4">
        <p className="text-sm text-[#5f5f5f]">
          <strong className="text-[#111111]">Rappel :</strong> Merci d&apos;arriver 5 minutes
          avant votre rendez-vous. Pour annuler, contactez-nous au moins 2h a l&apos;avance.
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          size="md"
          onClick={() => {
            setData(initialData);
            setStep(1);
          }}
        >
          Nouvelle reservation
        </Button>
        <a href="/">
          <Button variant="primary" size="md">
            Retour a l&apos;accueil
          </Button>
        </a>
      </div>
    </div>
  );

  const steps: Record<number, () => JSX.Element> = {
    1: Step1,
    2: Step2,
    3: Step3,
    4: Step4,
    5: Step5,
    6: Step6,
    7: Step7,
    8: Step8,
  };

  const currentStep = steps[step]();

  return (
    <div className="min-h-screen bg-[#f7f4ef] px-4 pb-24 pt-36">
      <div className="page-shell">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="section-label mb-4">Reservation en ligne</p>
            <h1 className="display-heading text-[clamp(3rem,7vw,5.5rem)] text-[#111111]">
              Prenez votre
              <br />
              rendez-vous.
            </h1>
            <p className="mt-6 max-w-xl body-copy text-lg">
              Choisissez votre service, votre barbier, la date et l&apos;heure directement
              en ligne. Toute la logique de reservation reste la meme, avec une
              presentation mieux integree au reste du site.
            </p>
          </div>

          <div className="rounded-[28px] border border-[#ddd7ce] bg-white p-6">
            <p className="section-label mb-3">Ce que vous allez faire</p>
            <div className="space-y-3 text-sm text-[#5f5f5f]">
              <p>1. Choisir votre prestation</p>
              <p>2. Selectionner votre barbier et le bon creneau</p>
              <p>3. Confirmer votre rendez-vous en ligne</p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-[#ddd7ce] bg-white p-6 shadow-[0_20px_60px_rgba(17,17,17,0.05)] md:p-10">
          {step < 8 && <StepIndicator />}
          {currentStep}
        </div>
      </div>
    </div>
  );
}
