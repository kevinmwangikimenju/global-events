"use client";

import { FormEvent, useState } from "react";

export default function Hero() {
  const [search, setSearch] = useState("");

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const value = search.trim();

    if (!value) {
      window.location.href = "/#events";
      return;
    }

    window.location.href = `/?search=${encodeURIComponent(value)}#events`;
  }

  return (
    <section
      className="
        relative
        min-h-[680px]
        flex
        items-center
        justify-center
        overflow-hidden
      "
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=2200&q=90')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Main dark overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Purple / orange theme */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-purple-950/85
          via-black/60
          to-orange-950/80
        "
      />

      {/* Purple glow */}
      <div
        className="
          absolute
          -left-40
          bottom-0
          w-[500px]
          h-[500px]
          rounded-full
          bg-purple-600/25
          blur-[130px]
        "
      />

      {/* Orange glow */}
      <div
        className="
          absolute
          -right-40
          top-0
          w-[500px]
          h-[500px]
          rounded-full
          bg-orange-500/20
          blur-[130px]
        "
      />

      {/* Content */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-6xl
          mx-auto
          px-6
          pt-20
          pb-24
          text-center
        "
      >
        {/* Marketplace badge */}
        <div
          className="
            inline-flex
            items-center
            justify-center
            px-6
            py-3
            rounded-full
            bg-black/40
            backdrop-blur-xl
            border
            border-white/20
            text-white
            font-bold
            text-sm
            shadow-xl
          "
        >
          Australia's Fastest Growing Ticket Marketplace
        </div>

        {/* Heading */}
        <h1
          className="
            mt-8
            text-5xl
            md:text-6xl
            lg:text-7xl
            font-black
            leading-[1.05]
            text-white
          "
        >
          Experience
          <br />

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
        </h1>

        {/* Description */}
        <p
          className="
            mt-7
            max-w-3xl
            mx-auto
            text-base
            md:text-lg
            lg:text-xl
            leading-relaxed
            text-gray-200
          "
        >
          Discover concerts, festivals, sports, nightlife and unforgettable
          experiences happening across Australia and around the world.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-5 mt-10">
          <a
            href="#events"
            className="
              px-9
              py-4
              rounded-full
              bg-gradient-to-r
              from-orange-500
              to-purple-600
              text-white
              font-black
              text-lg
              shadow-2xl
              hover:scale-105
              hover:shadow-orange-500/30
              transition-all
              duration-300
            "
          >
            Explore Events
          </a>

          <a
            href="/register"
            className="
              px-9
              py-4
              rounded-full
              bg-white/10
              backdrop-blur-xl
              border
              border-white/40
              text-white
              font-black
              text-lg
              hover:bg-white/20
              hover:scale-105
              transition-all
              duration-300
            "
          >
            Become a Partner
          </a>
        </div>

        {/* SINGLE WORKING SEARCH BAR */}
        <form
          onSubmit={handleSearch}
          className="
            mt-12
            w-full
            max-w-4xl
            mx-auto
          "
        >
          <div
            className="
              flex
              items-center
              w-full
              min-h-[72px]
              p-2
              rounded-full
              bg-black/60
              backdrop-blur-2xl
              border
              border-white/30
              shadow-2xl
            "
          >
            {/* Search icon - NO EMOJI */}
            <div
              className="
                flex
                items-center
                justify-center
                w-14
                h-14
                shrink-0
                text-white
              "
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-7 h-7"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </div>

            {/* Input */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, artists, venues or cities..."
              aria-label="Search events"
              className="
                flex-1
                min-w-0
                bg-transparent
                px-3
                py-4
                outline-none
                text-white
                placeholder:text-gray-300
                text-base
                md:text-lg
              "
            />

            {/* Search button */}
            <button
              type="submit"
              className="
                shrink-0
                px-7
                md:px-9
                py-4
                rounded-full
                bg-gradient-to-r
                from-orange-500
                to-purple-600
                text-white
                font-black
                text-base
                md:text-lg
                shadow-xl
                hover:scale-105
                transition-all
                duration-300
              "
            >
              Search
            </button>
          </div>
        </form>

      </div>
    </section>
  );
}