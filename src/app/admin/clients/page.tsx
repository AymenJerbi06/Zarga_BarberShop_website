"use client";

import { useState } from "react";
import { Search, User, Phone, Mail, Star } from "lucide-react";
import type { Client } from "@/lib/types";

const MOCK_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Ahmed Ben Ali",
    phone: "+216 22 123 456",
    email: "ahmed@example.com",
    preferred_barber: "Zarga",
    no_show_count: 0,
    total_appointments: 12,
    notes: "Client fidèle. Préfère les coupes classiques.",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Mohamed Trabelsi",
    phone: "+216 55 987 654",
    preferred_barber: "Cherif",
    no_show_count: 1,
    total_appointments: 8,
    created_at: "2024-02-20T10:00:00Z",
  },
  {
    id: "3",
    name: "Yassine Hamdi",
    phone: "+216 98 456 789",
    email: "yassine@example.com",
    preferred_barber: "Guidara",
    no_show_count: 0,
    total_appointments: 5,
    notes: "Aime les designs créatifs.",
    created_at: "2024-03-10T10:00:00Z",
  },
  {
    id: "4",
    name: "Slim Khelil",
    phone: "+216 22 789 012",
    preferred_barber: "Zarga",
    no_show_count: 0,
    total_appointments: 20,
    notes: "VIP — prend le Look Complet chaque mois.",
    created_at: "2023-06-05T10:00:00Z",
  },
  {
    id: "5",
    name: "Khalil Makhlouf",
    phone: "+216 55 234 567",
    email: "khalil@example.com",
    no_show_count: 2,
    total_appointments: 3,
    created_at: "2024-11-01T10:00:00Z",
  },
];

export default function ClientsPage() {
  const [clients] = useState<Client[]>(MOCK_CLIENTS);
  const [search, setSearch] = useState("");

  const filtered = clients.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-white">Clients</h1>
        <span className="text-zinc-500 text-sm">{clients.length} clients enregistrés</span>
      </div>

      {/* Search */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un client..."
            className="w-full bg-zinc-950 border border-zinc-700 text-white pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Client cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((client) => (
          <div key={client.id} className="bg-zinc-900 border border-zinc-800 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                  <span className="text-amber-400 font-bold">{client.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{client.name}</p>
                  {client.preferred_barber && (
                    <p className="text-zinc-500 text-xs">Préfère {client.preferred_barber}</p>
                  )}
                </div>
              </div>
              {client.total_appointments >= 10 && (
                <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-1">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs font-bold">VIP</span>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <a
                href={`tel:${client.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors text-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                {client.phone}
              </a>
              {client.email && (
                <a
                  href={`mailto:${client.email}`}
                  className="flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors text-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {client.email}
                </a>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-sm">
              <div>
                <p className="text-zinc-600 text-xs mb-0.5">Total RDV</p>
                <p className="text-white font-bold">{client.total_appointments}</p>
              </div>
              <div className="text-center">
                <p className="text-zinc-600 text-xs mb-0.5">Absences</p>
                <p
                  className={`font-bold ${
                    client.no_show_count > 1 ? "text-red-400" : "text-zinc-300"
                  }`}
                >
                  {client.no_show_count}
                </p>
              </div>
              <div className="text-right">
                <p className="text-zinc-600 text-xs mb-0.5">Client depuis</p>
                <p className="text-zinc-300 text-xs">
                  {new Date(client.created_at).toLocaleDateString("fr")}
                </p>
              </div>
            </div>

            {client.notes && (
              <div className="mt-3 pt-3 border-t border-zinc-800">
                <p className="text-zinc-500 text-xs italic">{client.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          <User className="w-8 h-8 mx-auto mb-3 opacity-50" />
          Aucun client trouvé
        </div>
      )}
    </div>
  );
}
