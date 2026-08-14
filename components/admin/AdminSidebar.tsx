"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: "📊",
    },
    {
      name: "Manage Events",
      href: "/admin",
      icon: "🎟",
    },
    {
      name: "Create Event",
      href: "/admin/create-event",
      icon: "➕",
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: "📈",
    },
    {
      name: "Payments",
      href: "/admin/payments",
      icon: "💰",
    },
    {
      name: "Payment Banks",
      href: "/admin/banks",
      icon: "🏦",
    },
    {
      name: "Verify Tickets",
      href: "/admin/verify",
      icon: "✅",
    },
    {
      name: "Profile",
      href: "/admin/profile",
      icon: "👤",
    },
  ];

  async function logout() {
    await supabase.auth.signOut();

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-orange-600 text-white shadow-2xl flex flex-col">

      <div className="p-8 border-b border-white/20">
        <h1 className="text-4xl font-black">
          🎤 Tixel
        </h1>

        <p className="text-white/80 mt-2">
          Admin Panel
        </p>
      </div>

      <nav className="p-6 flex flex-col gap-3 flex-1">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            pathname.startsWith(
              link.href + "/"
            );

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex
                items-center
                gap-4
                rounded-2xl
                px-5
                py-4
                text-lg
                font-bold
                transition-all
                duration-200
                ${
                  active
                    ? "bg-white text-purple-800 shadow-lg scale-105"
                    : "hover:bg-white/20"
                }
              `}
            >
              <span className="text-2xl">
                {link.icon}
              </span>

              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <button
          type="button"
          onClick={logout}
          className="block w-full text-center bg-red-500 hover:bg-red-600 rounded-2xl py-4 font-bold transition"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}