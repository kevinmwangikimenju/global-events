"use client";

import Link from "next/link";
import { useState } from "react";

import Logo from "@/components/Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[76px] flex items-center justify-between">

          {/* TIXEL LOGO */}
          <div className="shrink-0">
            <Logo />
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-8">

            <Link
              href="/#events"
              className="text-sm font-bold text-gray-700 hover:text-orange-500 transition"
            >
              Events
            </Link>

            <Link
              href="/#categories"
              className="text-sm font-bold text-gray-700 hover:text-orange-500 transition"
            >
              Categories
            </Link>

            <Link
              href="/#cities"
              className="text-sm font-bold text-gray-700 hover:text-orange-500 transition"
            >
              Cities
            </Link>

            <Link
              href="/#about"
              className="text-sm font-bold text-gray-700 hover:text-orange-500 transition"
            >
              About
            </Link>

            <Link
              href="/#contact"
              className="text-sm font-bold text-gray-700 hover:text-orange-500 transition"
            >
              Contact
            </Link>

          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-3">

            <Link
              href="/login"
              className="
                px-6
                py-2.5
                rounded-full
                border-2
                border-black
                text-black
                text-sm
                font-bold
                hover:bg-black
                hover:text-white
                transition
              "
            >
              Login
            </Link>

            <Link
              href="/register"
              className="
                px-6
                py-2.5
                rounded-full
                bg-gradient-to-r
                from-orange-500
                via-pink-500
                to-purple-700
                text-white
                text-sm
                font-bold
                shadow-lg
                hover:scale-105
                transition
              "
            >
              Sign Up
            </Link>

          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden p-3 rounded-xl bg-black text-white"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {open ? (
                <>
                  <path d="M6 6L18 18" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 6H20" />
                  <path d="M4 12H20" />
                  <path d="M4 18H20" />
                </>
              )}
            </svg>
          </button>

        </div>

        {/* MOBILE NAVIGATION */}
        {open && (
          <div className="md:hidden bg-white border-t border-gray-200 px-6 py-5 space-y-4">

            <Link
              href="/#events"
              className="block font-bold"
              onClick={() => setOpen(false)}
            >
              Events
            </Link>

            <Link
              href="/#categories"
              className="block font-bold"
              onClick={() => setOpen(false)}
            >
              Categories
            </Link>

            <Link
              href="/#cities"
              className="block font-bold"
              onClick={() => setOpen(false)}
            >
              Cities
            </Link>

            <Link
              href="/#about"
              className="block font-bold"
              onClick={() => setOpen(false)}
            >
              About
            </Link>

            <Link
              href="/#contact"
              className="block font-bold"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>

            <Link
              href="/login"
              className="block font-bold"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>

            <Link
              href="/register"
              className="
                block
                text-center
                bg-gradient-to-r
                from-orange-500
                to-purple-700
                text-white
                py-3
                rounded-xl
                font-bold
              "
              onClick={() => setOpen(false)}
            >
              Sign Up
            </Link>

          </div>
        )}

      </div>
    </header>
  );
}