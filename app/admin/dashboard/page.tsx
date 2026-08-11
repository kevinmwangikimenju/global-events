import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { count: totalEvents } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true });

  const { count: ticketsSold } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { data: payments } = await supabase
    .from("payments")
    .select("amount");

  const revenue =
    payments?.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    ) || 0;

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(6);

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-100">

      {/* HERO */}

      <section
        className="relative h-[450px] overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-10 h-full flex flex-col justify-center text-white">

          <h1 className="text-6xl font-black">
            🎤 Admin Dashboard
          </h1>

          <p className="text-xl mt-6 max-w-2xl">
            Manage concerts, tickets, payments and every event from one place.
          </p>

          <div className="flex flex-wrap gap-5 mt-10">

            <a
              href="/admin/create-event"
              className="bg-purple-600 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
            >
              ➕ Create Event
            </a>

            <a
              href="/admin"
              className="bg-orange-500 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
            >
              🎟 Manage Events
            </a>

            <a
              href="/admin/verify"
              className="bg-green-600 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
            >
              ✅ Verify Tickets
            </a>

          </div>

        </div>

      </section>

      <div className="max-w-7xl mx-auto px-8 py-12">

        {/* STATS */}

        <h2 className="text-4xl font-black mb-8">
          Platform Analytics
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-xl">

            <p className="text-xl">
              Total Events
            </p>

            <h2 className="text-6xl font-black mt-5">
              {totalEvents || 0}
            </h2>

          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 text-white shadow-xl">

            <p className="text-xl">
              Tickets Sold
            </p>

            <h2 className="text-6xl font-black mt-5">
              {ticketsSold || 0}
            </h2>

          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 text-white shadow-xl">

            <p className="text-xl">
              Revenue
            </p>

            <h2 className="text-6xl font-black mt-5">
              ${revenue.toFixed(2)}
            </h2>

          </div>

        </div>

        {/* GALLERY */}

        <h2 className="text-4xl font-black mt-16 mb-8">
          Live Concerts
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <img
            src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200"
            className="rounded-3xl h-72 w-full object-cover shadow-xl"
            alt=""
          />

          <img
            src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200"
            className="rounded-3xl h-72 w-full object-cover shadow-xl"
            alt=""
          />

          <img
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200"
            className="rounded-3xl h-72 w-full object-cover shadow-xl"
            alt=""
          />

        </div>

        {/* EVENTS */}

        <div className="flex justify-between items-center mt-16 mb-8">

          <h2 className="text-4xl font-black">
            Latest Events
          </h2>

          <a
            href="/admin"
            className="bg-black text-white px-6 py-3 rounded-xl font-bold"
          >
            View All
          </a>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {events?.map((event) => (

            <div
              key={event.id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >

              <img
                src={
                  event.banner_url ||
                  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200"
                }
                className="w-full h-56 object-cover"
                alt={event.title}
              />

              <div className="p-6">

                <h3 className="text-2xl font-black">
                  {event.title}
                </h3>

                <p className="mt-3 text-gray-600">
                  📍 {event.city}, {event.country}
                </p>

                <p className="mt-3 font-bold text-purple-700">
                  ${event.ticket_price}
                </p>

                <div className="flex gap-3 mt-8">

                  <a
                    href={`/events/${event.id}`}
                    className="bg-black text-white px-4 py-2 rounded-xl"
                  >
                    View
                  </a>

                  <a
                    href={`/admin/events/${event.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                  >
                    Edit
                  </a>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}