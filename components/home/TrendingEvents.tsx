"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Props = {
  events: any[];
};

export default function TrendingEvents({ events }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Get available categories from your Supabase events
  const categories = useMemo(() => {
    const values = events
      .map((event) => event.category)
      .filter(Boolean);

    return ["All", ...Array.from(new Set(values))];
  }, [events]);

  // Search + category filtering
  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesCategory =
        category === "All" ||
        event.category?.toLowerCase() === category.toLowerCase();

      const searchableText = [
        event.title,
        event.category,
        event.venue,
        event.city,
        event.country,
        event.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        query.length === 0 || searchableText.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [events, search, category]);

  return (
    <section
      id="events"
      className="
        relative
        overflow-hidden
        py-28
        bg-[#08031a]
      "
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=2200&q=90')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark background overlay */}
      <div className="absolute inset-0 bg-[#08031a]/90" />

      {/* Purple lighting */}
      <div
        className="
          absolute
          -left-40
          top-40
          w-[550px]
          h-[550px]
          rounded-full
          bg-purple-700/30
          blur-[160px]
        "
      />

      {/* Pink lighting */}
      <div
        className="
          absolute
          right-[-150px]
          top-20
          w-[500px]
          h-[500px]
          rounded-full
          bg-pink-600/20
          blur-[150px]
        "
      />

      {/* Orange lighting */}
      <div
        className="
          absolute
          right-0
          bottom-0
          w-[500px]
          h-[500px]
          rounded-full
          bg-orange-500/20
          blur-[160px]
        "
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* ============================= */}
        {/* HEADER */}
        {/* ============================= */}

        <div className="text-center mb-12">

          <div
            className="
              inline-flex
              items-center
              px-6
              py-2
              rounded-full
              bg-white/10
              border
              border-white/20
              backdrop-blur-xl
              text-orange-400
              text-sm
              font-black
              uppercase
              tracking-[0.2em]
            "
          >
            Trending This Week
          </div>

          <h2
            className="
              text-4xl
              md:text-6xl
              font-black
              text-white
              mt-6
              leading-tight
            "
          >
            Explore{" "}
            <span
              className="
                bg-gradient-to-r
                from-orange-400
                via-pink-500
                to-purple-500
                bg-clip-text
                text-transparent
              "
            >
              Amazing Events
            </span>
          </h2>

          <p className="text-gray-300 max-w-2xl mx-auto mt-5 text-lg">
            Discover concerts, festivals, sports, nightlife and unforgettable
            experiences across Australia and around the world.
          </p>

        </div>

        {/* ============================= */}
        {/* SEARCH + FILTER */}
        {/* ============================= */}

        <div className="max-w-5xl mx-auto mb-14">

          <div
            className="
              flex
              flex-col
              md:flex-row
              gap-4
              p-3
              rounded-3xl
              bg-white/10
              border
              border-white/20
              backdrop-blur-2xl
              shadow-2xl
            "
          >

            {/* Search input */}
            <div className="relative flex-1">

              <div
                className="
                  absolute
                  left-5
                  top-1/2
                  -translate-y-1/2
                  text-white
                  text-2xl
                  pointer-events-none
                "
              >
                🔎
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, artists, venues or cities..."
                className="
                  w-full
                  h-16
                  rounded-2xl
                  bg-black/30
                  border
                  border-white/20
                  text-white
                  placeholder-gray-400
                  pl-14
                  pr-6
                  outline-none
                  focus:border-pink-500
                  focus:ring-2
                  focus:ring-pink-500/30
                  transition
                "
              />

            </div>

            {/* Category filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="
                md:w-56
                h-16
                rounded-2xl
                bg-black/40
                border
                border-white/20
                text-white
                px-5
                outline-none
                cursor-pointer
                focus:border-purple-500
              "
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                  className="bg-[#100827] text-white"
                >
                  {item}
                </option>
              ))}
            </select>

            {/* Search button */}
            <button
              type="button"
              onClick={() => {
                const element = document.getElementById("event-results");

                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="
                h-16
                px-9
                rounded-2xl
                bg-gradient-to-r
                from-orange-500
                via-pink-500
                to-purple-600
                text-white
                font-black
                shadow-xl
                hover:scale-[1.03]
                active:scale-[0.98]
                transition
              "
            >
              Search
            </button>

          </div>

          {/* Search result information */}
          {(search || category !== "All") && (
            <div className="text-center mt-5 text-gray-300">

              Found{" "}
              <span className="font-black text-white">
                {filteredEvents.length}
              </span>{" "}
              event
              {filteredEvents.length === 1 ? "" : "s"}

              {search && (
                <>
                  {" "}
                  matching{" "}
                  <span className="font-bold text-orange-400">
                    "{search}"
                  </span>
                </>
              )}

            </div>
          )}

        </div>

        {/* ============================= */}
        {/* EVENTS */}
        {/* ============================= */}

        <div id="event-results">

          {events.length === 0 ? (

            <div className="text-center py-20">

              <div
                className="
                  max-w-2xl
                  mx-auto
                  rounded-3xl
                  bg-white/10
                  border
                  border-white/20
                  backdrop-blur-xl
                  p-12
                "
              >

                <h3 className="text-3xl font-black text-white">
                  No Events Available
                </h3>

                <p className="text-gray-300 mt-4">
                  Organizers haven't published any events yet.
                </p>

              </div>

            </div>

          ) : filteredEvents.length === 0 ? (

            <div className="text-center py-20">

              <div
                className="
                  max-w-2xl
                  mx-auto
                  rounded-3xl
                  bg-white/10
                  border
                  border-white/20
                  backdrop-blur-xl
                  p-12
                "
              >

                <div className="text-6xl mb-6">
                  🎫
                </div>

                <h3 className="text-3xl font-black text-white">
                  No Matching Events
                </h3>

                <p className="text-gray-300 mt-4">
                  Try another event name, city, venue or category.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                  className="
                    mt-7
                    px-7
                    py-3
                    rounded-full
                    bg-gradient-to-r
                    from-orange-500
                    to-purple-600
                    text-white
                    font-bold
                    hover:scale-105
                    transition
                  "
                >
                  Show All Events
                </button>

              </div>

            </div>

          ) : (

            <div
              className="
                grid
                md:grid-cols-2
                xl:grid-cols-3
                gap-8
              "
            >

              {filteredEvents.map((event) => (

                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="
                    group
                    overflow-hidden
                    rounded-[28px]
                    bg-white
                    shadow-2xl
                    hover:-translate-y-3
                    hover:shadow-purple-900/40
                    transition-all
                    duration-500
                  "
                >

                  {/* ============================= */}
                  {/* EVENT IMAGE */}
                  {/* ============================= */}

                  <div className="relative h-72 overflow-hidden">

                    <img
                      src={
                        event.banner_url ||
                        "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=85"
                      }
                      alt={event.title || "Event"}
                      className="
                        w-full
                        h-full
                        object-cover
                        group-hover:scale-110
                        transition-transform
                        duration-700
                      "
                    />

                    {/* Image overlay */}
                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/90
                        via-black/20
                        to-transparent
                      "
                    />

                    {/* Category */}
                    {event.category && (
                      <div
                        className="
                          absolute
                          top-5
                          left-5
                          px-4
                          py-2
                          rounded-full
                          bg-black/60
                          backdrop-blur-xl
                          border
                          border-white/20
                          text-white
                          text-sm
                          font-black
                        "
                      >
                        {event.category}
                      </div>
                    )}

                    {/* Price */}
                    <div
                      className="
                        absolute
                        bottom-5
                        right-5
                        px-5
                        py-3
                        rounded-2xl
                        bg-gradient-to-r
                        from-orange-500
                        via-pink-500
                        to-purple-600
                        text-white
                        text-xl
                        font-black
                        shadow-xl
                      "
                    >
                      ${event.ticket_price}
                    </div>

                  </div>

                  {/* ============================= */}
                  {/* EVENT CONTENT */}
                  {/* ============================= */}

                  <div className="p-7">

                    <h3
                      className="
                        text-2xl
                        font-black
                        text-gray-900
                        group-hover:text-purple-700
                        transition
                        line-clamp-2
                      "
                    >
                      {event.title}
                    </h3>

                    <div className="mt-6 space-y-3">

                      {/* Venue */}
                      <div className="flex items-start gap-3">

                        <div
                          className="
                            w-9
                            h-9
                            rounded-xl
                            bg-purple-100
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                            text-purple-700
                            font-bold
                          "
                        >
                          V
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                            Venue
                          </p>

                          <p className="text-gray-700 font-semibold">
                            {event.venue || "Venue TBA"}
                          </p>
                        </div>

                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-3">

                        <div
                          className="
                            w-9
                            h-9
                            rounded-xl
                            bg-orange-100
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                            text-orange-600
                            font-bold
                          "
                        >
                          L
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                            Location
                          </p>

                          <p className="text-gray-700 font-semibold">
                            {[event.city, event.country]
                              .filter(Boolean)
                              .join(", ") || "Location TBA"}
                          </p>
                        </div>

                      </div>

                      {/* Date */}
                      <div className="flex items-start gap-3">

                        <div
                          className="
                            w-9
                            h-9
                            rounded-xl
                            bg-pink-100
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                            text-pink-600
                            font-bold
                          "
                        >
                          D
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                            Date
                          </p>

                          <p className="text-gray-700 font-semibold">
                            {event.event_date || "Date TBA"}
                          </p>
                        </div>

                      </div>

                      {/* Time */}
                      <div className="flex items-start gap-3">

                        <div
                          className="
                            w-9
                            h-9
                            rounded-xl
                            bg-blue-100
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                            text-blue-600
                            font-bold
                          "
                        >
                          T
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                            Time
                          </p>

                          <p className="text-gray-700 font-semibold">
                            {event.event_time || "Time TBA"}
                          </p>
                        </div>

                      </div>

                    </div>

                    {/* Bottom */}
                    <div
                      className="
                        mt-7
                        pt-5
                        border-t
                        border-gray-100
                        flex
                        items-center
                        justify-between
                        gap-4
                      "
                    >

                      <span className="font-black text-orange-500">
                        {event.tickets_remaining ?? 0} Tickets Left
                      </span>

                      <span
                        className="
                          text-purple-700
                          font-black
                          whitespace-nowrap
                          group-hover:translate-x-2
                          transition
                        "
                      >
                        View Details →
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          )}

        </div>

      </div>

    </section>
  );
}