import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 group"
    >

      {/* Tixel mark */}
      <div className="
        w-9
        h-9
        rounded-xl
        bg-gradient-to-br
        from-orange-500
        via-pink-500
        to-purple-700
        flex
        items-center
        justify-center
        shadow-lg
        group-hover:scale-105
        transition
      ">

        <span className="text-white font-black text-xl">
          ×
        </span>

      </div>


      {/* Brand */}
      <div className="leading-none">

        <div className="
          text-black
          text-xl
          font-black
          tracking-tight
        ">
          tixel
        </div>

        <div className="
          text-[9px]
          text-gray-500
          mt-1
          tracking-wide
        ">
          Global Events Marketplace
        </div>

      </div>

    </Link>
  );
}