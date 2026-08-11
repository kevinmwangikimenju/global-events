// app/admin/page.tsx

export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteButton from "@/components/admin/DeleteButton";

const ADMIN_EMAILS = [
  "duncanwesongawechuli@gmail.com",
  "kipchirchirenock348@gmail.com",
  "blessingrono2004@gmail.com"
];

export default async function AdminPage() {

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email?.toLowerCase();

  if (!email || !ADMIN_EMAILS.includes(email)) {
    redirect("/dashboard");
  }

  const {
    data: events,
    error
  } = await supabase
    .from("events")
    .select("*")
    .order("created_at", {
      ascending: false
    });

  if (error) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold">
          Error Loading Events
        </h1>

        <p className="text-red-600 mt-4">
          {error.message}
        </p>
      </main>
    );
  }

  return (

    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-3xl p-10 shadow-xl mb-10">

          <h1 className="text-5xl font-black">
            Admin Dashboard 👑
          </h1>

          <p className="mt-4 text-xl">
            Logged in as {user.email}
          </p>

        </div>

        <div className="flex justify-between items-center mb-10">

          <div>

            <h2 className="text-4xl font-bold">
              Manage Events
            </h2>

            <p className="text-gray-600 mt-2">
              Create, edit and delete events
            </p>

          </div>

          <div className="flex gap-4">

            <Link
              href="/admin/verify"
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold"
            >
              ✅ Verify Tickets
            </Link>

            <Link
              href="/admin/create-event"
              className="bg-black text-white px-6 py-3 rounded-xl font-bold"
            >
              + Create Event
            </Link>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {events?.map((event) => (

            <div
              key={event.id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >

              {event.banner_url ? (

                <img
                  src={event.banner_url}
                  alt={event.title}
                  className="w-full h-52 object-cover"
                />

              ) : (

                <div className="h-52 bg-gray-200 flex items-center justify-center">
                  No Image
                </div>

              )}

              <div className="p-6">

                <h3 className="text-2xl font-bold">
                  {event.title}
                </h3>

                <p className="text-gray-600 mt-3">
                  📍 {event.venue}
                </p>

                <p className="text-gray-600">
                  {event.city}, {event.country}
                </p>

                <p className="mt-3 font-bold">
                  ${event.ticket_price}
                </p>

                <p className="text-sm text-gray-500 mt-3">
                  Date: {event.event_date}
                </p>

                <p className="mt-2">
                  Status: {event.status}
                </p>

                <div className="flex gap-3 mt-6 flex-wrap">

                  <Link
                    href={`/events/${event.id}`}
                    className="bg-black text-white px-4 py-2 rounded-xl"
                  >
                    View
                  </Link>

                  <Link
                    href={`/admin/events/${event.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                  >
                    Edit
                  </Link>

                  <DeleteButton id={event.id} />

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>

  );
}