import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 group"
    >
      {/* Tixel logo */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <Image
          src="/tixel-logo.png"
          alt="Tixel"
          fill
          priority
          className="object-contain group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Brand */}
      <div className="leading-none">
        <div className="text-black text-xl font-black tracking-tight">
          tixel
        </div>

        <div className="text-[9px] text-gray-500 mt-1 tracking-wide">
          Global Events Marketplace
        </div>
      </div>
    </Link>
  );
}