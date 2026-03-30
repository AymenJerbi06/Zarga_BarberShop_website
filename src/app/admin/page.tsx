"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  RefreshCw,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import type { Appointment } from "@/lib/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    client_name: "Ahmed Ben Ali",
    client_phone: "+216 22 123 456",
    client_email: "ahmed@example.com",
    barber: "Zarga",
    service_name: "Coupe + Barbe",
    service_category: "Forfaits",
    duration_minutes: 50,
    price: 35,
    start_time: new Date().toISOString().replace(/T.*/, "T09:00:00"),
    end_time: new Date().toISOString().replace(/T.*/, "T09:50:00"),
    status: "confirmed",
    booking_source: "online",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    client_name: "Mohamed Trabelsi",
    client_phone: "+216 55 987 654",
    barber: "Cherif",
    service_name: "Rasage Classique",
    service_category: "Barbe",
    duration_minutes: 30,
    price: 20,
    start_time: new Date().toISOString().replace(/T.*/, "T10:00:00"),
    end_time: new Date().toISOString().replace(/T.*/, "T10:30:00"),
    status: "in_service",
    booking_source: "online",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    client_name: "Yassine Hamdi",
    client_phone: "+216 98 456 789",
    barber: "Guidara",
    service_name: "Transformation",
    service_category: "Coupe de Cheveux",
    duration_minutes: 60,
    price: 40,
    start_time: new Date().toISOString().replace(/T.*/, "T11:00:00"),
    end_time: new Date().toISOString().replace(/T.*/, "T12:00:00"),
    status: "pending",
    booking_source: "online",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    client_name: "Slim Khelil",
    client_phone: "+216 22 789 012",
    barber: "Zarga",
    service_name: "Look Complet",
    service_category: "Forfaits",
    duration_minutes: 75,
    price: 50,
    start_time: new Date().toISOString().replace(/T.*/, "T14:00:00"),
    end_time: new Date().toISOString().replace(/T.*/, "T15:15:00"),
    status: "confirmed",
    booking_source: "phone",
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    client_name: "Khalil Makhlouf",
    client_phone: "+216 55 234 567",
    barber: "Cherif",
    service_name: "Coupe Simple",
    service_category: "Coupe de Cheveux",
    duration_minutes: 30,
    price: 20,
    start_time: new Date().toISOString().replace(/T.*/, "T15:30:00"),
    end_time: new Date().toISOString().replace(/T.*/, "T16:00:00"),
    status: "completed",
    booking_source: "walk-in",
    created_at: new Date().toISOString(),
  },
];

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [loading, setLoading] = useState(false);

  const fetchToday = async () => {
    setLoading(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const res = await fetch(`/api/appointments?date=${today}`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) setAppointments(data);
      }
    } catch {
      // Keep mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter((a) =>
      ["confirmed", "in_service", "arrived"].includes(a.status)
    ).length,
    pending: appointments.filter((a) => a.status === "pending").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    revenue: appointments
      .filter((a) => a.status === "completed")
      .reduce((sum, a) => sum + a.price, 0),
  };

  const statCards = [
    {
      label: "Total Aujourd'hui",
      value: stats.total,
      icon: CalendarDays,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Confirmés",
      value: stats.confirmed,
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "En Attente",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      label: "Revenus du Jour",
      value: `${stats.revenue} DT`,
      icon: TrendingUp,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            Tableau de Bord
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
          </p>
        </div>
        <button
          onClick={fetchToday}
          disabled={loading}
          className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm px-4 py-2 bg-zinc-800 hover:bg-zinc-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p className={`font-display text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-zinc-500 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Barber breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {["Zarga", "Cherif", "Guidara"].map((barber) => {
          const barberAppts = appointments.filter((a) => a.barber === barber);
          const barberRevenue = barberAppts
            .filter((a) => a.status === "completed")
            .reduce((sum, a) => sum + a.price, 0);
          return (
            <div key={barber} className="bg-zinc-900 border border-zinc-800 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-sm">{barber.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{barber}</p>
                  <p className="text-zinc-500 text-xs">{barberAppts.length} RDV aujourd&apos;hui</p>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Revenus</span>
                <span className="text-amber-400 font-bold">{barberRevenue} DT</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's appointments */}
      <div className="bg-zinc-900 border border-zinc-800">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-amber-400" />
            Rendez-Vous du Jour
          </h2>
          <a href="/admin/appointments" className="text-amber-400 text-xs tracking-wider uppercase hover:text-amber-300 transition-colors">
            Voir tout →
          </a>
        </div>

        <div className="divide-y divide-zinc-800">
          {appointments.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              <Users className="w-8 h-8 mx-auto mb-3 opacity-50" />
              Aucun rendez-vous aujourd&apos;hui
            </div>
          ) : (
            appointments.map((appt) => (
              <div key={appt.id} className="p-5 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="text-center w-12">
                    <p className="text-amber-400 font-bold text-sm">
                      {new Date(appt.start_time).toLocaleTimeString("fr", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-zinc-600 text-xs">{appt.duration_minutes}min</p>
                  </div>
                  <div className="w-px h-10 bg-zinc-800" />
                  <div>
                    <p className="text-white font-semibold text-sm">{appt.client_name}</p>
                    <p className="text-zinc-500 text-xs">{appt.service_name} · {appt.barber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-amber-400 font-bold text-sm">{appt.price} DT</span>
                  <StatusBadge status={appt.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
