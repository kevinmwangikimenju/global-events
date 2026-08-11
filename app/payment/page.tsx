import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";

import PaymentForm from "./PaymentForm";

type PaymentPageProps = {
  searchParams: Promise<{
    event?: string;
    quantity?: string;
  }>;
};

export default async function PaymentPage({
  searchParams,
}: PaymentPageProps) {
  const params = await searchParams;

  const eventId = params.event;

  const parsedQuantity = Number(params.quantity);

  const quantity =
    Number.isInteger(parsedQuantity) &&
    parsedQuantity > 0
      ? parsedQuantity
      : 1;

  // ============================================================
  // EVENT ID REQUIRED
  // ============================================================

  if (!eventId) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">
          <h1 className="text-3xl font-black text-red-600">
            Payment Error
          </h1>

          <p className="text-gray-600 mt-4">
            No event was selected for this payment.
          </p>

          <Link
            href="/"
            className="inline-block mt-8 bg-purple-700 text-white px-8 py-4 rounded-xl font-bold"
          >
            Back Home
          </Link>
        </div>
      </main>
    );
  }

  // ============================================================
  // SERVER SUPABASE CLIENT
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
  // CHECK USER
  // ============================================================

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    const destination =
      `/payment?event=${encodeURIComponent(eventId)}` +
      `&quantity=${encodeURIComponent(
        String(quantity)
      )}`;

    redirect(
      `/login?redirect=${encodeURIComponent(
        destination
      )}`
    );
  }

  // ============================================================
  // LOAD EVENT
  // ============================================================

  const {
    data: event,
    error: eventError,
  } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">
          <h1 className="text-3xl font-black text-red-600">
            Event Not Found
          </h1>

          <p className="text-gray-600 mt-4">
            The event connected to this payment could not
            be found.
          </p>

          <Link
            href="/"
            className="inline-block mt-8 bg-purple-700 text-white px-8 py-4 rounded-xl font-bold"
          >
            Back Home
          </Link>
        </div>
      </main>
    );
  }

  // ============================================================
  // CALCULATE TOTAL
  // ============================================================

  const ticketPrice =
    Number(event.ticket_price) || 0;

  const total =
    ticketPrice * quantity;

  // ============================================================
  // LOAD ALL ACTIVE BANKS
  // ============================================================

  const {
    data: banks,
    error: banksError,
  } = await supabase
    .from("banks")
    .select(
      "id, bank_name, account_name, bsb, account_number, status"
    )
    .eq("status", "active")
    .order("created_at", {
      ascending: true,
    });

  // ============================================================
  // PAYMENT PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-100">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <header className="bg-white shadow-sm">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <Link
            href="/"
            className="text-3xl font-black text-black"
          >
            tixel
          </Link>

          <Link
            href={`/checkout/${event.id}?quantity=${quantity}`}
            className="font-bold text-purple-700 hover:text-purple-900"
          >
            ← Back to Checkout
          </Link>

        </div>

      </header>

      {/* ====================================================== */}
      {/* CONTENT */}
      {/* ====================================================== */}

      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ================================================== */}
          {/* LEFT */}
          {/* ================================================== */}

          <section className="lg:col-span-2">

            <div className="bg-white rounded-3xl shadow-xl p-8">

              <h1 className="text-4xl font-black text-gray-900">
                Complete Your Payment
              </h1>

              <p className="text-gray-500 mt-3">
                Select your preferred bank, make the payment,
                then upload your payment screenshot.
              </p>

              {/* ================================================= */}
              {/* EVENT */}
              {/* ================================================= */}

              <div className="mt-8 rounded-2xl bg-purple-50 border border-purple-100 p-6">

                <h2 className="text-2xl font-black text-purple-800">
                  {event.title}
                </h2>

                <div className="mt-4 grid sm:grid-cols-2 gap-4 text-gray-600">

                  <div>
                    <p className="text-sm text-gray-500">
                      Tickets
                    </p>

                    <p className="font-black text-gray-900">
                      {quantity}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Price per ticket
                    </p>

                    <p className="font-black text-gray-900">
                      ${ticketPrice.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Venue
                    </p>

                    <p className="font-semibold">
                      {event.venue || "Venue TBA"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Location
                    </p>

                    <p className="font-semibold">
                      {[event.city, event.country]
                        .filter(Boolean)
                        .join(", ") ||
                        "Location TBA"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Date
                    </p>

                    <p className="font-semibold">
                      {event.event_date ||
                        "Date TBA"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Time
                    </p>

                    <p className="font-semibold">
                      {event.event_time ||
                        "Time TBA"}
                    </p>
                  </div>

                </div>

              </div>

              {/* ================================================= */}
              {/* PAYMENT FORM */}
              {/* ================================================= */}

              <PaymentForm
                banks={banks || []}
                banksError={banksError?.message || null}
                quantity={quantity}
                ticketPrice={ticketPrice}
                total={total}
                eventId={event.id}
              />

            </div>

          </section>

          {/* ================================================== */}
          {/* ORDER SUMMARY */}
          {/* ================================================== */}

          <aside className="bg-white rounded-3xl shadow-xl p-8 h-fit lg:sticky lg:top-8">

            <h2 className="text-2xl font-black">
              Order Summary
            </h2>

            <div className="border-t my-6" />

            <div>
              <p className="text-sm text-gray-500">
                Event
              </p>

              <p className="font-black mt-1">
                {event.title}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Tickets
              </p>

              <p className="font-black mt-1">
                {quantity} Ticket
                {quantity === 1 ? "" : "s"}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Price per ticket
              </p>

              <p className="font-bold mt-1">
                ${ticketPrice.toFixed(2)}
              </p>
            </div>

            <div className="border-t my-6" />

            <div className="flex justify-between items-center gap-4">

              <span className="font-bold">
                Total
              </span>

              <span className="text-3xl font-black text-purple-700">
                ${total.toFixed(2)}
              </span>

            </div>

            <div className="mt-8 bg-orange-50 border border-orange-100 rounded-2xl p-5">

              <p className="font-black text-orange-700">
                Important
              </p>

              <p className="text-sm text-gray-600 mt-2">
                Pay exactly{" "}
                <strong>
                  ${total.toFixed(2)}
                </strong>{" "}
                for {quantity} ticket
                {quantity === 1 ? "" : "s"}.
              </p>

            </div>

            <Link
              href={`/events/${event.id}`}
              className="
                block
                text-center
                mt-6
                text-purple-700
                font-bold
                hover:text-purple-900
              "
            >
              ← Back to Event
            </Link>

          </aside>

        </div>

      </div>

    </main>
  );
}