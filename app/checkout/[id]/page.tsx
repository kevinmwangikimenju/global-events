import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";

import QuantitySelector from "./QuantitySelector";

type Props = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    quantity?: string;
  }>;
};

export default async function CheckoutPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const query = await searchParams;

  // ============================================================
  // QUANTITY FROM URL
  // ============================================================

  const parsedQuantity = Number(
    query.quantity
  );

  const requestedQuantity =
    Number.isInteger(parsedQuantity) &&
    parsedQuantity > 0
      ? parsedQuantity
      : 1;

  // ============================================================
  // SUPABASE SERVER CLIENT
  // ============================================================

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                cookieStore.set(
                  name,
                  value,
                  options
                );
              }
            );
          } catch {
            // Middleware handles cookie updates.
          }
        },
      },
    }
  );

  // ============================================================
  // LOAD EVENT
  // ============================================================

  const {
    data: event,
    error: eventError,
  } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  // ============================================================
  // EVENT NOT FOUND
  // ============================================================

  if (eventError || !event) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md">

          <h1 className="text-3xl font-black">
            Event Not Found
          </h1>

          <p className="text-gray-500 mt-4">
            This event is no longer available.
          </p>

          <Link
            href="/"
            className="
              inline-block
              mt-7
              bg-purple-700
              text-white
              px-7
              py-3
              rounded-xl
              font-bold
            "
          >
            Back Home
          </Link>

        </div>
      </main>
    );
  }

  // ============================================================
  // AUTHENTICATION
  // ============================================================

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();

  if (!user) {
    const checkoutPath =
      `/checkout/${id}` +
      `?quantity=${encodeURIComponent(
        String(requestedQuantity)
      )}`;

    redirect(
      `/login?redirect=${encodeURIComponent(
        checkoutPath
      )}`
    );
  }

  // ============================================================
  // TICKETS REMAINING
  // ============================================================

  const ticketsRemaining =
    Number(event.tickets_remaining);

  const safeTicketsRemaining =
    Number.isFinite(ticketsRemaining) &&
    ticketsRemaining > 0
      ? Math.floor(ticketsRemaining)
      : 1;

  // ============================================================
  // SAFE QUANTITY
  // ============================================================

  const quantity = Math.min(
    Math.max(requestedQuantity, 1),
    safeTicketsRemaining
  );

  // ============================================================
  // PRICE
  // ============================================================

  const ticketPrice =
    Number(event.ticket_price) || 0;

  const total =
    ticketPrice * quantity;

  // ============================================================
  // CHECKOUT PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-100">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <header className="bg-white shadow">

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">

          <Link
            href="/"
            className="text-3xl font-black text-black"
          >
            tixel
          </Link>

          <Link
            href={`/events/${event.id}`}
            className="
              font-bold
              text-purple-700
              hover:text-purple-900
            "
          >
            ← Back to Event
          </Link>

        </div>

      </header>

      {/* ====================================================== */}
      {/* CONTENT */}
      {/* ====================================================== */}

      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ================================================== */}
          {/* EVENT */}
          {/* ================================================== */}

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl overflow-hidden">

            <img
              src={
                event.banner_url ||
                "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=85"
              }
              alt={
                event.title || "Event"
              }
              className="
                w-full
                h-72
                object-cover
              "
            />

            <div className="p-8">

              <h1 className="text-4xl font-black text-gray-900">
                {event.title}
              </h1>

              {event.category && (
                <p className="mt-3 text-purple-700 font-bold">
                  {event.category}
                </p>
              )}

              <div className="mt-7 space-y-5 text-gray-600">

                {/* VENUE */}

                <div>

                  <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                    Venue
                  </p>

                  <p className="font-semibold mt-1">
                    {event.venue ||
                      "Venue TBA"}
                  </p>

                </div>

                {/* LOCATION */}

                <div>

                  <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                    Location
                  </p>

                  <p className="font-semibold mt-1">
                    {[
                      event.city,
                      event.country,
                    ]
                      .filter(Boolean)
                      .join(", ") ||
                      "Location TBA"}
                  </p>

                </div>

                {/* DATE */}

                <div>

                  <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                    Date
                  </p>

                  <p className="font-semibold mt-1">
                    {event.event_date ||
                      "Date TBA"}
                  </p>

                </div>

                {/* TIME */}

                <div>

                  <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                    Time
                  </p>

                  <p className="font-semibold mt-1">
                    {event.event_time ||
                      "Time TBA"}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ================================================== */}
          {/* ORDER */}
          {/* ================================================== */}

          <div className="bg-white rounded-3xl shadow-xl p-8 h-fit lg:sticky lg:top-24">

            <h2 className="text-3xl font-black text-gray-900">
              Your Tickets
            </h2>

            <p className="text-gray-500 mt-2">
              Choose how many tickets you want.
            </p>

            {/* ================================================= */}
            {/* PRICE */}
            {/* ================================================= */}

            <div className="border-t border-gray-200 my-7" />

            <div className="flex justify-between">

              <span className="text-gray-600">
                Price per ticket
              </span>

              <strong>
                ${ticketPrice.toFixed(2)}
              </strong>

            </div>

            {/* ================================================= */}
            {/* AVAILABILITY */}
            {/* ================================================= */}

            <div className="flex justify-between mt-4">

              <span className="text-gray-600">
                Tickets available
              </span>

              <strong>
                {safeTicketsRemaining}
              </strong>

            </div>

            {/* ================================================= */}
            {/* QUANTITY SELECTOR */}
            {/* ================================================= */}

            <div className="border-t border-gray-200 my-7 pt-7">

              <QuantitySelector
                eventId={event.id}
                ticketPrice={ticketPrice}
                ticketsRemaining={
                  safeTicketsRemaining
                }
                initialQuantity={
                  quantity
                }
              />

            </div>

            {/* ================================================= */}
            {/* CURRENT TOTAL */}
            {/* ================================================= */}

            <div className="mt-6 bg-purple-50 border border-purple-100 rounded-2xl p-5">

              <div className="flex justify-between items-center">

                <span className="font-bold text-gray-700">
                  Current total
                </span>

                <span className="text-2xl font-black text-purple-700">
                  ${total.toFixed(2)}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}