import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventPage({
  params,
}: Props) {
  const { id } = await params;

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
            // Cookie updates are handled by middleware
            // when this component is rendered as a Server Component.
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
    error,
  } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(
      "EVENT PAGE ERROR:",
      error
    );
  }

  // ============================================================
  // EVENT NOT FOUND
  // ============================================================

  if (!event) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
        <div
          className="
            bg-white
            p-10
            rounded-3xl
            shadow-xl
            text-center
            max-w-lg
          "
        >
          <h1
            className="
              text-4xl
              font-black
              text-red-600
            "
          >
            Event Not Found
          </h1>

          <p
            className="
              text-gray-500
              mt-4
            "
          >
            The event you're looking for
            doesn't exist.
          </p>

          <Link
            href="/"
            className="
              inline-block
              mt-8
              bg-purple-600
              text-white
              px-8
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
  // CHECK AUTHENTICATION
  // ============================================================

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  // ============================================================
  // TICKETS
  // ============================================================

  const ticketsRemaining =
    Number(
      event.tickets_remaining ?? 0
    );

  // ============================================================
  // CHECKOUT URL
  // ============================================================

  const checkoutPath =
    `/checkout/${event.id}`;

  // ============================================================
  // BUY URL
  //
  // LOGGED IN:
  //     /checkout/event-id
  //
  // LOGGED OUT:
  //     /login?redirect=/checkout/event-id
  //
  // The login page already reads "redirect" and sends
  // the user there after successful login.
  // ============================================================

  const buyUrl = isLoggedIn
    ? checkoutPath
    : `/login?redirect=${encodeURIComponent(
        checkoutPath
      )}`;

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-gray-100">

      {/* ====================================================== */}
      {/* NAVBAR */}
      {/* ====================================================== */}

      <header className="bg-white shadow">

        <div
          className="
            max-w-7xl
            mx-auto
            px-8
            py-5
            flex
            justify-between
            items-center
          "
        >

          <Link
            href="/"
            className="
              text-3xl
              font-black
              text-purple-700
            "
          >
            TIXEL
          </Link>

          <Link
            href="/"
            className="
              font-bold
              text-purple-600
              hover:text-purple-800
              transition
            "
          >
            ← Back to Events
          </Link>

        </div>

      </header>

      {/* ====================================================== */}
      {/* BANNER */}
      {/* ====================================================== */}

      <section className="relative h-[500px]">

        <img
          src={
            event.banner_url ||
            "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1800&q=85"
          }
          alt={
            event.title ||
            "Event"
          }
          className="
            w-full
            h-full
            object-cover
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-black/60
            flex
            items-center
            justify-center
          "
        >

          <div
            className="
              text-center
              text-white
              px-6
            "
          >

            {event.category && (
              <div
                className="
                  inline-block
                  px-5
                  py-2
                  rounded-full
                  bg-white/20
                  backdrop-blur
                  border
                  border-white/30
                  text-sm
                  font-bold
                  mb-5
                "
              >
                {event.category}
              </div>
            )}

            <h1
              className="
                text-5xl
                md:text-6xl
                font-black
              "
            >
              {event.title}
            </h1>

            {event.category && (
              <p
                className="
                  text-xl
                  mt-5
                  text-gray-200
                "
              >
                {event.category}
              </p>
            )}

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* DETAILS */}
      {/* ====================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          py-20
          px-8
          grid
          lg:grid-cols-3
          gap-10
        "
      >

        {/* ================================================== */}
        {/* LEFT */}
        {/* ================================================== */}

        <div
          className="
            lg:col-span-2
            bg-white
            rounded-3xl
            shadow-xl
            p-10
          "
        >

          <h2
            className="
              text-4xl
              font-black
              mb-8
            "
          >
            About this Event
          </h2>

          <p
            className="
              text-gray-600
              leading-8
              whitespace-pre-line
            "
          >
            {event.description ||
              "Experience an unforgettable event."}
          </p>

          {/* EVENT DETAILS */}

          <div
            className="
              grid
              md:grid-cols-2
              gap-6
              mt-10
            "
          >

            {/* VENUE */}

            <div
              className="
                bg-gray-100
                p-6
                rounded-2xl
              "
            >

              <h3
                className="
                  font-black
                  text-lg
                  mb-2
                "
              >
                📍 Venue
              </h3>

              <p className="font-semibold">
                {event.venue ||
                  "Venue TBA"}
              </p>

              <p className="text-gray-600">
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

            <div
              className="
                bg-gray-100
                p-6
                rounded-2xl
              "
            >

              <h3
                className="
                  font-black
                  text-lg
                  mb-2
                "
              >
                📅 Date
              </h3>

              <p className="font-semibold">
                {event.event_date ||
                  "Date TBA"}
              </p>

              <p className="text-gray-600">
                {event.event_time ||
                  "Time TBA"}
              </p>

            </div>

            {/* TICKETS */}

            <div
              className="
                bg-gray-100
                p-6
                rounded-2xl
              "
            >

              <h3
                className="
                  font-black
                  text-lg
                  mb-2
                "
              >
                🎟 Tickets
              </h3>

              <p className="font-semibold">
                {ticketsRemaining} Remaining
              </p>

            </div>

            {/* CATEGORY */}

            <div
              className="
                bg-gray-100
                p-6
                rounded-2xl
              "
            >

              <h3
                className="
                  font-black
                  text-lg
                  mb-2
                "
              >
                🏷 Category
              </h3>

              <p className="font-semibold">
                {event.category ||
                  "General"}
              </p>

            </div>

          </div>

        </div>

        {/* ================================================== */}
        {/* RIGHT / PURCHASE */}
        {/* ================================================== */}

        <div
          className="
            bg-white
            rounded-3xl
            shadow-xl
            p-10
            h-fit
            sticky
            top-24
          "
        >

          <h2
            className="
              text-5xl
              font-black
              text-purple-700
            "
          >
            $
            {event.ticket_price}
          </h2>

          <p
            className="
              text-gray-500
              mt-2
            "
          >
            Price per Ticket
          </p>

          <div className="border-t my-8" />

          <p
            className="
              text-lg
              mb-8
            "
          >
            🎟{" "}
            <strong>
              {ticketsRemaining}
            </strong>{" "}
            tickets remaining
          </p>

          {/* ================================================= */}
          {/* BUY BUTTON */}
          {/* ================================================= */}

          {ticketsRemaining <= 0 ? (

            <div
              className="
                block
                w-full
                text-center
                bg-gray-200
                text-gray-500
                py-5
                rounded-2xl
                text-xl
                font-black
              "
            >
              SOLD OUT
            </div>

          ) : (

            <Link
              href={buyUrl}
              className="
                block
                w-full
                text-center
                bg-gradient-to-r
                from-orange-500
                to-purple-700
                text-white
                py-5
                rounded-2xl
                text-xl
                font-black
                hover:scale-105
                transition
                shadow-lg
              "
            >
              BUY TICKET
            </Link>

          )}

          {/* LOGIN INFORMATION */}

          {!isLoggedIn &&
            ticketsRemaining > 0 && (
              <p
                className="
                  text-center
                  text-sm
                  text-gray-500
                  mt-4
                "
              >
                You'll be asked to sign in
                or create an account before
                purchasing.
              </p>
            )}

          {isLoggedIn &&
            ticketsRemaining > 0 && (
              <p
                className="
                  text-center
                  text-sm
                  text-green-600
                  mt-4
                  font-semibold
                "
              >
                ✓ You're signed in. Continue
                directly to checkout.
              </p>
            )}

          <Link
            href="/"
            className="
              block
              text-center
              mt-5
              text-purple-700
              font-bold
              hover:text-purple-900
            "
          >
            Continue Browsing
          </Link>

        </div>

      </section>

    </main>
  );
}