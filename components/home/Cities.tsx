const cities = [
  {
    name: "Sydney",
    country: "Australia",
    image:
      "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Melbourne",
    country: "Australia",
    image:
      "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Brisbane",
    country: "Australia",
    image:
      "https://images.unsplash.com/photo-1524293581917-878a6d017c71?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Perth",
    country: "Australia",
    image:
      "https://images.unsplash.com/photo-1549180030-48bf079fb38a?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Gold Coast",
    country: "Australia",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Auckland",
    country: "New Zealand",
    image:
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=85",
  },
];

export default function Cities() {
  return (
    <section
      id="cities"
      className="
        relative
        py-24
        overflow-hidden
        bg-gradient-to-br
        from-purple-950
        via-indigo-950
        to-orange-950
      "
    >

      {/* Decorative background glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8">

        {/* Heading */}
        <div className="text-center mb-14">

          <p className="text-orange-400 font-black uppercase tracking-[0.3em]">
            Popular Australian Locations
          </p>

          <h2 className="text-4xl md:text-6xl font-black text-white mt-4">
            Discover Events Near You
          </h2>

          <p className="text-gray-300 mt-5 text-lg">
            Explore concerts, festivals, sports and unforgettable
            experiences across Australia and nearby destinations.
          </p>

        </div>

        {/* City cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {cities.map((city) => (

            <div
              key={city.name}
              className="
                group
                relative
                h-72
                rounded-3xl
                overflow-hidden
                shadow-2xl
                border
                border-white/10
                cursor-pointer
                hover:-translate-y-2
                transition-all
                duration-500
              "
            >

              {/* Background image */}
              <img
                src={city.image}
                alt={`${city.name}, ${city.country}`}
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  group-hover:scale-110
                  transition-transform
                  duration-700
                "
              />

              {/* Dark gradient */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black
                  via-black/30
                  to-transparent
                "
              />

              {/* Purple/orange hover glow */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-purple-700/20
                  via-transparent
                  to-orange-500/30
                  opacity-70
                  group-hover:opacity-100
                  transition
                "
              />

              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-7">

                <p className="text-orange-400 font-bold uppercase tracking-wider text-sm">
                  {city.country}
                </p>

                <h3
                  className="
                    text-3xl
                    md:text-4xl
                    font-black
                    text-white
                    mt-1
                    group-hover:text-orange-300
                    transition
                  "
                >
                  {city.name}
                </h3>

                <div className="mt-3 h-1 w-12 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full group-hover:w-24 transition-all duration-500" />

              </div>

            </div>

          ))}

        </div>

        {/* Bottom message */}
        <div className="text-center mt-12">

          <p className="text-gray-300">
            🇦🇺 Discover the best events across Australia
          </p>

        </div>

      </div>

    </section>
  );
}