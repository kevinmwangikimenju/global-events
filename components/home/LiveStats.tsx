type Props = {
  events: any[];
};

const backgrounds = [
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1000&q=85",
];

export default function LiveStats({ events }: Props) {
  const liveEvents = events.length;

  const ticketsAvailable = events.reduce(
    (total, event) => total + Number(event.tickets_remaining || 0),
    0
  );

  const countries = new Set(
    events
      .map((event) => event.country)
      .filter(Boolean)
  ).size;

  const ticketsLeft = ticketsAvailable;

  const stats = [
    {
      value: liveEvents,
      label: "Live Events",
      image: backgrounds[0],
    },
    {
      value: ticketsAvailable.toLocaleString(),
      label: "Tickets Available",
      image: backgrounds[1],
    },
    {
      value: countries,
      label: "Countries",
      image: backgrounds[2],
    },
    {
      value: ticketsLeft.toLocaleString(),
      label: "Tickets Left",
      image: backgrounds[3],
    },
  ];

  return (
    <section
      className="
        relative
        z-20
        w-full
        py-10
        bg-[#09051c]
        overflow-hidden
      "
    >
      {/* Background glow */}
      <div
        className="
          absolute
          left-0
          top-1/2
          -translate-y-1/2
          w-[400px]
          h-[300px]
          bg-purple-700/20
          blur-[120px]
          rounded-full
        "
      />

      <div
        className="
          absolute
          right-0
          top-1/2
          -translate-y-1/2
          w-[400px]
          h-[300px]
          bg-orange-500/15
          blur-[120px]
          rounded-full
        "
      />

      <div
        className="
          relative
          z-10
          max-w-6xl
          mx-auto
          px-6
        "
      >
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-5
          "
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="
                relative
                min-h-[155px]
                overflow-hidden
                rounded-3xl
                border
                border-white/20
                shadow-2xl
                group
              "
            >
              {/* Background image */}
              <img
                src={stat.image}
                alt=""
                aria-hidden="true"
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  scale-100
                  group-hover:scale-110
                  transition-transform
                  duration-700
                "
              />

              {/* Dark overlay */}
              <div
                className="
                  absolute
                  inset-0
                  bg-black/30
                "
              />

              {/* Colour gradient */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-purple-700/80
                  via-pink-600/65
                  to-orange-500/75
                  mix-blend-multiply
                "
              />

              {/* Highlight */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/50
                  via-transparent
                  to-white/10
                "
              />

              {/* Content */}
              <div
                className="
                  relative
                  z-10
                  flex
                  h-full
                  min-h-[155px]
                  flex-col
                  justify-center
                  px-7
                  py-6
                  text-white
                "
              >
                <div
                  className="
                    text-4xl
                    md:text-5xl
                    font-black
                    leading-none
                  "
                >
                  {stat.value}
                </div>

                <div
                  className="
                    mt-3
                    text-sm
                    md:text-base
                    font-black
                    uppercase
                    tracking-wide
                  "
                >
                  {stat.label}
                </div>
              </div>

              {/* Hover border */}
              <div
                className="
                  absolute
                  inset-0
                  rounded-3xl
                  border
                  border-white/0
                  group-hover:border-white/40
                  transition-colors
                  duration-300
                "
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}