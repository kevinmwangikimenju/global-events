import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-3xl font-black text-purple-500">
            TIXEL
          </h2>

          <p className="mt-5 text-gray-400">
            Discover. Book. Experience.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3 className="font-bold text-xl mb-5">
            Explore
          </h3>

          <div className="space-y-3">
            <Link href="/">Home</Link>
            <br />

            <a href="#events">Events</a>
            <br />

            <a href="#categories">Categories</a>
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-bold text-xl mb-5">
            Support
          </h3>

          <div className="space-y-3">
            <p>Help Center</p>
            <p>Privacy Policy</p>
            <p>Terms & Conditions</p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-xl mb-5">
            Contact
          </h3>

          <div className="space-y-3">
            <p>support@tixel.com</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6 text-center text-gray-500">
        © {new Date().getFullYear()} TIXEL. All rights reserved.
      </div>
    </footer>
  );
}