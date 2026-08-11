const features = [
  {
    title: "Secure Payments",
    description:
      "Pay safely using trusted payment methods with encrypted and protected transactions.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=85",
    gradient: "from-purple-700/90 to-indigo-950/90",
  },
  {
    title: "Instant QR Tickets",
    description:
      "Receive your digital ticket immediately after approval with a unique QR code.",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=85",
    gradient: "from-orange-600/90 to-red-900/90",
  },
  {
    title: "Fast Checkout",
    description:
      "Purchase tickets quickly with a smooth checkout experience designed for speed.",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=85",
    gradient: "from-emerald-600/90 to-green-950/90",
  },
  {
    title: "Global Events",
    description:
      "Discover concerts, festivals, sports, conferences and nightlife events worldwide.",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=85",
    gradient: "from-blue-600/90 to-indigo-950/90",
  },
  {
    title: "Verified Organizers",
    description:
      "Events are reviewed and verified to give fans greater confidence when purchasing.",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=900&q=85",
    gradient: "from-pink-600/90 to-purple-950/90",
  },
  {
    title: "24/7 Support",
    description:
      "Our support team is ready to help customers with questions, purchases and tickets.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
    gradient: "from-slate-800/90 to-black/95",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-28 bg-gradient-to-br from-slate-950 via-purple-950 to-black"
    >

      {/* Background glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-3xl" />

      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-orange-500/20 blur-3xl" />

      {/* Decorative lights */}
      <div className="absolute top-20 right-20 w-3 h-3 rounded-full bg-orange-400 shadow-[0_0_30px_10px_rgba(249,115,22,0.5)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-16">

          <p className="text-orange-400 font-black uppercase tracking-[0.3em] text-sm">
            Why Choose Tixel
          </p>

          <h2 className="text-4xl md:text-6xl font-black text-white mt-4">
            Everything You Need
          </h2>

          <p className="text-gray-300 mt-6 text-lg max-w-2xl mx-auto leading-8">
            Everything you need to discover events, purchase tickets and
            enjoy unforgettable experiences.
          </p>

        </div>


        {/* FEATURE CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">

          {features.map((feature) => (

            <div
              key={feature.title}
              className="
                group
                relative
                h-[330px]
                overflow-hidden
                rounded-[2rem]
                border
                border-white/10
                shadow-2xl
                hover:-translate-y-3
                hover:shadow-purple-900/40
                transition-all
                duration-500
              "
            >

              {/* IMAGE */}
              <img
                src={feature.image}
                alt={feature.title}
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-110
                "
              />


              {/* DARK GRADIENT */}
              <div
                className={`
                  absolute
                  inset-0
                  bg-gradient-to-t
                  ${feature.gradient}
                `}
              />


              {/* Extra dark overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition" />


              {/* CONTENT */}
              <div className="absolute inset-x-0 bottom-0 p-7">

                <div className="
                  inline-flex
                  px-4
                  py-2
                  rounded-full
                  bg-white/15
                  backdrop-blur-md
                  border
                  border-white/20
                  text-white
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  mb-4
                ">
                  Tixel
                </div>


                <h3 className="
                  text-2xl
                  md:text-3xl
                  font-black
                  text-white
                ">
                  {feature.title}
                </h3>


                <p className="
                  mt-3
                  text-gray-100
                  leading-6
                  text-sm
                  md:text-base
                ">
                  {feature.description}
                </p>


                <div className="
                  mt-5
                  text-orange-300
                  font-black
                  text-sm
                  group-hover:translate-x-2
                  transition-transform
                ">
                  Learn more →
                </div>

              </div>

            </div>

          ))}

        </div>


        {/* BOTTOM CTA */}
        <div className="
          mt-20
          relative
          overflow-hidden
          rounded-[2rem]
          border
          border-white/10
          bg-gradient-to-r
          from-purple-700
          via-indigo-700
          to-orange-500
          p-10
          md:p-14
          text-center
          shadow-2xl
        ">

          <div className="absolute inset-0 bg-black/20" />

          <div className="relative z-10">

            <h3 className="
              text-3xl
              md:text-5xl
              font-black
              text-white
            ">
              Your Next Experience Starts Here
            </h3>

            <p className="
              mt-4
              text-white/90
              text-lg
              max-w-2xl
              mx-auto
            ">
              Find your next concert, festival, sporting event or
              unforgettable experience.
            </p>

            <a
              href="#events"
              className="
                inline-block
                mt-8
                bg-white
                text-purple-800
                px-9
                py-4
                rounded-full
                font-black
                shadow-xl
                hover:scale-105
                transition
              "
            >
              Explore Events →
            </a>

          </div>

        </div>

      </div>

    </section>
  );
}