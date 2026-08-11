import Link from "next/link";

const categories = [
  {
    name: "Music",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=85",
    description: "Concerts, live music and unforgettable performances.",
  },
  {
    name: "Festivals",
    image:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=900&q=85",
    description: "Experience the biggest festivals and celebrations.",
  },
  {
    name: "Sports",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85",
    description: "Live sports, matches and sporting experiences.",
  },
  {
    name: "Comedy",
    image:
      "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=900&q=85",
    description: "Laugh out loud with the best comedy shows.",
  },
  {
    name: "Theatre",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=85",
    description: "Theatre, performances and spectacular productions.",
  },
  {
    name: "Nightlife",
    image:
      "https://images.unsplash.com/photo-1571266028243-d220c9c3baf3?auto=format&fit=crop&w=900&q=85",
    description: "Discover the best nightlife and parties.",
  },
];

export default function Categories() {
  return (
    <section className="relative overflow-hidden py-28 bg-gradient-to-br from-purple-950 via-indigo-950 to-black">
      
      {/* Decorative lights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <p className="text-orange-400 font-black uppercase tracking-[0.3em] text-sm">
            Browse Experiences
          </p>

          <h2 className="text-4xl md:text-6xl font-black text-white mt-4">
            Explore Categories
          </h2>

          <p className="text-gray-300 text-lg mt-5 max-w-2xl mx-auto">
            From unforgettable concerts to thrilling sports and nightlife,
            discover something amazing happening near you.
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">

          {categories.map((category) => (

            <Link
              key={category.name}
              href={`/events?category=${encodeURIComponent(category.name)}`}
              className="group relative h-64 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >

              {/* Background image */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />

              {/* Dark gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Purple/orange glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-orange-500/20 opacity-70 group-hover:opacity-100 transition" />

              <div className="absolute bottom-0 left-0 right-0 p-5">

                <h3 className="text-2xl font-black text-white">
                  {category.name}
                </h3>

                <p className="text-gray-200 text-sm mt-2 opacity-0 group-hover:opacity-100 transition duration-300">
                  {category.description}
                </p>

                <div className="mt-3 text-orange-400 font-bold text-sm">
                  Explore →
                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>
    </section>
  );
}