"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Logo from "@/components/Logo";

import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";

const ADMIN_EMAILS = [
  "duncanwesongawechuli@gmail.com",
  "kipchirchirenock348@gmail.com",
  "blessingrono2004@gmail.com",
];

function getSafeRedirect(value: string | null) {
  if (!value) {
    return "/dashboard";
  }

  // Only allow internal paths.
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [redirectPath, setRedirectPath] =
    useState("/dashboard");

  const [partnerOpen, setPartnerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ------------------------------------------------------------
  // READ REDIRECT FROM URL
  // ------------------------------------------------------------

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const redirect = params.get("redirect");

    setRedirectPath(
      getSafeRedirect(redirect)
    );
  }, []);

  // ------------------------------------------------------------
  // NORMAL LOGIN
  // ------------------------------------------------------------

  async function handleLogin() {
    if (loading) {
      return;
    }

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      alert(
        "Please enter your email and password."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email: cleanEmail,
            password,
          }),
        }
      );

      let result: any = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      // --------------------------------------------------------
      // LOGIN FAILED
      // --------------------------------------------------------

      if (!response.ok) {
        console.error(
          "Login failed:",
          result
        );

        alert(
          result?.error ||
            "Login failed. Please check your email and password."
        );

        setLoading(false);
        return;
      }

      if (
        !result?.success ||
        !result?.user
      ) {
        alert(
          "Login was not completed. Please try again."
        );

        setLoading(false);
        return;
      }

      const userEmail =
        result.user.email
          ?.trim()
          .toLowerCase() || "";

      // --------------------------------------------------------
      // ADMIN
      // --------------------------------------------------------

      if (
        ADMIN_EMAILS.includes(userEmail)
      ) {
        window.location.replace(
          "/admin/dashboard"
        );

        return;
      }

      // --------------------------------------------------------
      // NORMAL USER
      // --------------------------------------------------------

      window.location.replace(
        redirectPath
      );
    } catch (error) {
      console.error(
        "Unexpected login error:",
        error
      );

      alert(
        "Unable to connect to the login server. Please try again."
      );

      setLoading(false);
    }
  }

  // ------------------------------------------------------------
  // GUEST / DEMO LOGIN
  //
  // This does NOT create a fake Supabase session.
  // It simply lets a visitor enter the normal demo/user area.
  // ------------------------------------------------------------

  function handleGuestLogin() {
    if (loading) {
      return;
    }

    window.location.replace(
      redirectPath
    );
  }

  // ------------------------------------------------------------
  // SOCIAL LOGIN
  // ------------------------------------------------------------

  function handleSocialLogin(
    provider:
      | "google"
      | "apple"
      | "facebook"
  ) {
    if (loading) {
      return;
    }

    const safeRedirect =
      getSafeRedirect(redirectPath);

    const callbackUrl =
      `${window.location.origin}/auth/callback` +
      `?next=${encodeURIComponent(
        safeRedirect
      )}`;

    const providerUrl =
      `/auth/login?provider=${provider}` +
      `&next=${encodeURIComponent(
        safeRedirect
      )}` +
      `&callback=${encodeURIComponent(
        callbackUrl
      )}`;

    window.location.href =
      providerUrl;
  }

  // ------------------------------------------------------------
  // REGISTER URL
  // ------------------------------------------------------------

  const registerUrl =
    `/register?redirect=${encodeURIComponent(
      redirectPath
    )}`;

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-100">

      {/* HEADER */}

      <header className="h-20 bg-white shadow flex items-center justify-between px-8">

        <Logo />

        <nav className="flex gap-8 items-center font-semibold">

          <Link
            href="/"
            className="hover:text-purple-600 transition"
          >
            Home
          </Link>

          <Link
            href="/login"
            className="hover:text-purple-600 transition"
          >
            Sign In
          </Link>

          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setPartnerOpen(
                  !partnerOpen
                )
              }
              className="
                bg-gradient-to-r
                from-orange-500
                to-purple-600
                text-white
                px-6
                py-3
                rounded-full
                font-bold
                hover:scale-105
                transition
              "
            >
              Partner with us
            </button>

            {partnerOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-14
                  bg-white
                  shadow-2xl
                  rounded-2xl
                  p-4
                  w-72
                  z-50
                  border
                  border-gray-100
                "
              >

                <Link
                  href="/"
                  className="
                    block
                    p-3
                    hover:bg-gray-100
                    rounded-xl
                  "
                >
                  Festivals and Promoters
                </Link>

                <Link
                  href="/"
                  className="
                    block
                    p-3
                    hover:bg-gray-100
                    rounded-xl
                  "
                >
                  Artists
                </Link>

                <Link
                  href="/"
                  className="
                    block
                    p-3
                    hover:bg-gray-100
                    rounded-xl
                  "
                >
                  Ticket Companies
                </Link>

              </div>
            )}

          </div>

        </nav>

      </header>

      {/* LOGIN */}

      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">

        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">

          <h1 className="text-3xl font-black text-center text-gray-900">
            Login to Tixel
          </h1>

          <p className="text-gray-500 text-center mt-3">
            Access your tickets and events
          </p>

          {/* CHECKOUT MESSAGE */}

          {redirectPath !== "/dashboard" && (
            <div
              className="
                mt-6
                rounded-xl
                bg-purple-50
                border
                border-purple-100
                p-4
                text-sm
                text-purple-700
              "
            >
              <strong>
                Sign in to continue your purchase.
              </strong>

              <p className="mt-1">
                After signing in, you will
                automatically return to your
                ticket purchase.
              </p>
            </div>
          )}

          {/* EMAIL */}

          <label className="block mt-8 text-sm font-bold text-gray-700">
            Email address
          </label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            className="
              mt-2
              w-full
              border
              border-gray-200
              rounded-xl
              p-4
              outline-none
              focus:border-purple-500
              focus:ring-2
              focus:ring-purple-200
              transition
            "
            autoComplete="email"
            disabled={loading}
          />

          {/* PASSWORD */}

          <label className="block mt-4 text-sm font-bold text-gray-700">
            Password
          </label>

          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            className="
              mt-2
              w-full
              border
              border-gray-200
              rounded-xl
              p-4
              outline-none
              focus:border-purple-500
              focus:ring-2
              focus:ring-purple-200
              transition
            "
            autoComplete="current-password"
            disabled={loading}
          />

          {/* LOGIN BUTTON */}

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="
              mt-6
              w-full
              bg-gradient-to-r
              from-orange-500
              to-purple-600
              text-white
              py-4
              rounded-xl
              font-black
              text-lg
              shadow-lg
              hover:scale-[1.02]
              transition
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            {loading
              ? "Logging in..."
              : "Continue"}
          </button>

          {/* GUEST / DEMO */}

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading}
            className="
              mt-3
              w-full
              border
              border-gray-300
              text-gray-700
              py-4
              rounded-xl
              font-bold
              hover:bg-gray-50
              transition
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            Continue as Guest
          </button>

          {/* GUEST NOTICE */}

          <p className="text-center text-xs text-gray-400 mt-3">
            Guest mode is for browsing and demo purposes.
          </p>

          {/* DIVIDER */}

          <div className="flex items-center gap-4 my-7">

            <div className="flex-1 h-px bg-gray-200" />

            <span className="text-gray-400 text-sm font-semibold">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-200" />

          </div>

          {/* GOOGLE */}

          <button
            type="button"
            disabled={loading}
            onClick={() =>
              handleSocialLogin("google")
            }
            className="
              w-full
              border
              border-gray-200
              rounded-xl
              py-3
              font-semibold
              hover:bg-gray-50
              transition
              disabled:opacity-60
            "
          >
            <FcGoogle className="inline mr-3 text-lg" />

            Continue with Google
          </button>

          {/* APPLE */}

          <button
            type="button"
            disabled={loading}
            onClick={() =>
              handleSocialLogin("apple")
            }
            className="
              mt-3
              w-full
              border
              border-gray-200
              rounded-xl
              py-3
              font-semibold
              hover:bg-gray-50
              transition
              disabled:opacity-60
            "
          >
            <FaApple className="inline mr-3 text-lg" />

            Continue with Apple
          </button>

          {/* FACEBOOK */}

          <button
            type="button"
            disabled={loading}
            onClick={() =>
              handleSocialLogin("facebook")
            }
            className="
              mt-3
              w-full
              border
              border-gray-200
              rounded-xl
              py-3
              font-semibold
              hover:bg-gray-50
              transition
              disabled:opacity-60
            "
          >
            <FaFacebook className="inline mr-3 text-blue-600 text-lg" />

            Continue with Facebook
          </button>

          {/* REGISTER */}

          <p className="text-center mt-8 text-gray-500">

            New to Tixel?

            <Link
              href={registerUrl}
              className="
                ml-2
                text-purple-600
                font-bold
                hover:text-purple-800
              "
            >
              Create account
            </Link>

          </p>

        </div>

      </main>

    </div>
  );
}