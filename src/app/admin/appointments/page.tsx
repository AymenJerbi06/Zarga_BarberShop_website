"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, CalendarDays, RefreshCw } from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Appointment, AppointmentStatus } from "@/lib/types";
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

const STATUS_ACTIONS: Record<string, { label: string; next: AppointmentStatus; variant: "success" | "primary" | "danger" | "dark" }[]> = {
  pending: [
    { label: "Confirmer", next: "confirmed", variant: "success" },
    { label: "Annuler", next: "cancelled_shop", variant: "danger" },
  ],
  confirmed: [
    { label: "Arrivé", next: "arrived", variant: "primary" },
    { label: "Annuler", next: "cancelled_shop", variant: "danger" },
  ],
  arrived: [
    { label: "En Service", next: "in_service", variant: "primary" },
  ],
  in_service: [
    { label: "Terminer", next: "completed", variant: "success" },
  ],
  completed: [],
  cancelled_client: [],
  cancelled_shop: [],
  no_show: [],
  rescheduled: [],
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterBarber, setFilterBarber] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ date: filterDate });
      if (filterBarber !== "all") params.set("barber", filterBarber);
      if (filterStatus !== "all") params.set("status", filterStatus);

      const res = await fetch(`/api/appointments?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) setAppointments(data);
      }
    } catch {
      // Keep mock data
    } finally {
      setLoading(false);
    }
  }, [filterDate, filterBarber, filterStatus]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const updateStatus = async (id: string, newStatus: AppointmentStatus) => {
    // Optimistic update
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );

    try {
      await fetch(`/api/appointments`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch {
      // revert if needed
    }
  };

  const filtered = appointments.filter((a) => {
    const matchSearch =
      !search ||
      a.client_name.toLowerCase().includes(search.toLowerCase()) ||
      a.client_phone.includes(search) ||
      a.service_name.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const totalRevenue = filtered
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + a.price, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-white">Rendez-Vous</h1>
        <button
          onClick={fetchAppointments}
          disabled={loading}
          className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm px-4 py-2 bg-zinc-800 hover:bg-zinc-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full bg-zinc-950 border border-zinc-700 text-white pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <select
          value={filterBarber}
          onChange={(e) => setFilterBarber(e.target.value)}
          className="bg-zinc-950 border border-zinc-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
        >
          <option value="all">Tous les barbiers</option>
          <option value="Zarga">Zarga</option>
          <option value="Cherif">Cherif</option>
          <option value="Guidara">Guidara</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-zinc-950 border border-zinc-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmé</option>
          <option value="in_service">En service</option>
          <option value="completed">Terminé</option>
          <option value="cancelled_shop">Annulé</option>
          <option value="no_show">Absent</option>
        </select>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-6 mb-4 text-sm text-zinc-500">
        <span>{filtered.length} rendez-vous</span>
        <span className="text-amber-400 font-semibold">
          Revenus : {totalRevenue} DT
        </span>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 text-left">
                {["Heure", "Client", "Service", "Barbier", "Prix", "Statut", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-xs text-zinc-500 font-semibold tracking-wider uppercase"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500">
                    Aucun rendez-vous trouvé
                  </td>
                </tr>
              ) : (
                filtered.map((appt) => (
                  <tr key={appt.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-white text-sm font-medium">
                        {new Date(appt.start_time).toLocaleTimeString("fr", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-zinc-600 text-xs">{appt.duration_minutes}min</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-sm font-medium">{appt.client_name}</p>
                      <p className="text-zinc-500 text-xs">{appt.client_phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-zinc-300 text-sm">{appt.service_name}</p>
                      <p className="text-zinc-600 text-xs">{appt.service_category}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-zinc-300 text-sm">{appt.barber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-amber-400 font-bold text-sm">{appt.price} DT</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        {(STATUS_ACTIONS[appt.status] ?? []).map((action) => (
                          <Button
                            key={action.label}
                            variant={action.variant}
                            size="sm"
                            onClick={() => updateStatus(appt.id, action.next)}
                          >
                            {action.label}
                          </Button>
                        ))}
                        {["pending", "confirmed", "arrived"].includes(appt.status) && (
                          <Button
                            variant="dark"
                            size="sm"
                            onClick={() => updateStatus(appt.id, "no_show")}
                          >
                            Absent
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
