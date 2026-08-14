import Image from "next/image";
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

  const parsedQuantity = Number(query.quantity);

  const requestedQuantity =
    Number.isInteger(parsedQuantity) && parsedQuantity > 0
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
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
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
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
          <h1 className="text-3xl font-black text-gray-900">
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
              hover:bg-purple-800
              transition
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
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const checkoutPath =
      `/checkout/${id}` +
      `?quantity=${encodeURIComponent(
        String(requestedQuantity)
      )}`;

    redirect(
      `/login?redirect=${encodeURIComponent(checkoutPath)}`
    );
  }

  // ============================================================
  // TICKETS REMAINING
  // ============================================================

  const ticketsRemaining = Number(event.tickets_remaining);

  const safeTicketsRemaining =
    Number.isFinite(ticketsRemaining) && ticketsRemaining > 0
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

  const ticketPrice = Number(event.ticket_price) || 0;

  const total = ticketPrice * quantity;

  // ============================================================
  // CHECKOUT PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-100">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">

          {/* TIXEL LOGO */}

          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/tixel-logo.png"
                alt="Tixel"
                fill
                priority
                sizes="48px"
                className="
                  object-contain
                  group-hover:scale-105
                  transition-transform
                  duration-200
                "
              />
            </div>

            <div className="leading-none">
              <div className="text-black text-xl font-black tracking-tight">
                tixel
              </div>

              <div className="text-[9px] text-gray-500 mt-1 tracking-wide">
                Global Events Marketplace
              </div>
            </div>
          </Link>

          {/* BACK TO EVENT */}

          <Link
            href={`/events/${event.id}`}
            className="
              font-bold
              text-purple-700
              hover:text-purple-900
              transition
            "
          >
            ← Back to Event
          </Link>

        </div>
      </header>

      {/* ======================================================
          CHECKOUT CONTENT
      ====================================================== */}

      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* ==================================================
              EVENT DETAILS
          ================================================== */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <p className="text-sm font-bold text-purple-700 uppercase tracking-wide">
              Your Event
            </p>

            <h1 className="text-3xl font-black text-gray-900 mt-3">
              {event.title}
            </h1>

            <div className="mt-6 space-y-3 text-gray-600">

              {event.venue && (
                <p>
                  <span className="font-bold text-gray-900">
                    Venue:
                  </span>{" "}
                  {event.venue}
                </p>
              )}

              {event.city && (
                <p>
                  <span className="font-bold text-gray-900">
                    Location:
                  </span>{" "}
                  {event.city}
                </p>
              )}

              {event.country && (
                <p>
                  <span className="font-bold text-gray-900">
                    Country:
                  </span>{" "}
                  {event.country}
                </p>
              )}

              {event.event_date && (
                <p>
                  <span className="font-bold text-gray-900">
                    Date:
                  </span>{" "}
                  {event.event_date}
                </p>
              )}

              {event.event_time && (
                <p>
                  <span className="font-bold text-gray-900">
                    Time:
                  </span>{" "}
                  {event.event_time}
                </p>
              )}

            </div>

            <div className="border-t border-gray-200 mt-8 pt-8">

              <h2 className="text-xl font-black text-gray-900">
                Ticket Quantity
              </h2>

              <div className="mt-5">
                <QuantitySelector
                  initialQuantity={quantity}
                  maxQuantity={safeTicketsRemaining}
                  eventId={event.id}
                  ticketPrice={ticketPrice}
                />
              </div>

            </div>

          </div>

          {/* ==================================================
              ORDER SUMMARY
          ================================================== */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-2xl font-black text-gray-900">
              Order Summary
            </h2>

            <div className="mt-8 space-y-5">

              <div className="flex justify-between gap-4">
                <span className="text-gray-600">
                  Ticket price
                </span>

                <span className="font-bold text-gray-900">
                  {ticketPrice.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-600">
                  Quantity
                </span>

                <span className="font-bold text-gray-900">
                  {quantity}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-5 flex justify-between gap-4">

                <span className="text-xl font-black text-gray-900">
                  Total
                </span>

                <span className="text-2xl font-black text-purple-700">
                  {total.toLocaleString()}
                </span>

              </div>

            </div>

            {/* CONTINUE TO PAYMENT */}

            <Link
              href={`/payment?event=${encodeURIComponent(
                event.id
              )}&quantity=${encodeURIComponent(
                String(quantity)
              )}`}
              className="
                block
                w-full
                mt-8
                text-center
                bg-gradient-to-r
                from-orange-500
                via-pink-500
                to-purple-700
                text-white
                py-4
                rounded-2xl
                font-black
                shadow-lg
                hover:scale-[1.02]
                transition
              "
            >
              Continue to Payment
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}