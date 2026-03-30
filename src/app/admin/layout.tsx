"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Scissors,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const navItems = [
  { href: "/admin", label: "Tableau de Bord", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Rendez-Vous", icon: CalendarDays },
  { href: "/admin/clients", label: "Clients", icon: Users },
];

function AdminAuth({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "zarga2024")) {
      localStorage.setItem("admin_auth", "true");
      onAuth();
    } else {
      setError("Mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-amber-400 flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-6 h-6 text-zinc-950 rotate-45" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Zarga</h1>
          <p className="text-zinc-500 text-sm mt-1">Accès réservé au personnel</p>
        </div>

        <form onSubmit={handleLogin} className="bg-zinc-900 border border-zinc-800 p-6">
          <div className="mb-4">
            <label className="block text-zinc-400 text-sm mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="••••••••"
              className="w-full bg-zinc-950 border border-zinc-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>
          <Button type="submit" variant="primary" size="md" className="w-full">
            Se Connecter
          </Button>
        </form>

        <p className="text-center text-zinc-700 text-xs mt-4">
          Mot de passe par défaut : zarga2024
        </p>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") setAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <AdminAuth onAuth={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-zinc-950 rotate-45" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">ZARGA</p>
              <p className="text-zinc-500 text-xs">Administration</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium mb-1 transition-colors ${
                pathname === item.href
                  ? "bg-amber-400/10 text-amber-400 border-l-2 border-amber-400"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-zinc-500 hover:text-red-400 text-sm w-full px-3 py-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Se Déconnecter
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Top bar */}
        <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden text-zinc-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <span className="text-zinc-500 text-sm">
            {new Date().toLocaleDateString("fr-TN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
