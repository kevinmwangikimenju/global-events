"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Logo from "@/components/Logo";

import {
  register,
  socialLogin,
} from "@/lib/auth";

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

  if (
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/dashboard";
  }

  return value;
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [redirectPath, setRedirectPath] =
    useState("/dashboard");

  const [loading, setLoading] =
    useState(false);

  // ------------------------------------------------------------
  // READ REDIRECT
  // ------------------------------------------------------------

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    setRedirectPath(
      getSafeRedirect(
        params.get("redirect")
      )
    );
  }, []);

  // ------------------------------------------------------------
  // REGISTER
  // ------------------------------------------------------------

  async function handleRegister() {
    if (loading) {
      return;
    }

    const cleanName = name.trim();
    const cleanEmail =
      email.trim().toLowerCase();

    if (
      !cleanName ||
      !cleanEmail ||
      !password
    ) {
      alert(
        "Please fill in all fields."
      );
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error } =
        await register(
          cleanEmail,
          password,
          cleanName
        );

      if (error) {
        console.error(
          "Registration error:",
          error
        );

        alert(
          error.message ||
            "Unable to create your account."
        );

        setLoading(false);
        return;
      }

      const createdEmail =
        data.user?.email
          ?.trim()
          .toLowerCase() || "";

      // --------------------------------------------------------
      // EMAIL CONFIRMATION
      // --------------------------------------------------------

      /*
       * If Supabase requires email confirmation,
       * there may be a user but no active session.
       *
       * In that case we cannot safely send the user
       * directly to checkout because they aren't
       * authenticated yet.
       */

      if (!data.session) {
        alert(
          "Account created successfully. Please check your email and confirm your account, then log in to continue your purchase."
        );

        const loginUrl =
          `/login?redirect=${encodeURIComponent(
            redirectPath
          )}`;

        window.location.replace(
          loginUrl
        );

        return;
      }

      // --------------------------------------------------------
      // ADMIN
      // --------------------------------------------------------

      if (
        ADMIN_EMAILS.includes(
          createdEmail
        )
      ) {
        window.location.replace(
          "/admin/dashboard"
        );

        return;
      }

      // --------------------------------------------------------
      // NORMAL USER
      //
      // If registration came from checkout,
      // return to checkout.
      //
      // Otherwise go to dashboard.
      // --------------------------------------------------------

      window.location.replace(
        redirectPath
      );
    } catch (error) {
      console.error(
        "Unexpected registration error:",
        error
      );

      alert(
        "Unable to create your account. Please try again."
      );

      setLoading(false);
    }
  }

  // ------------------------------------------------------------
  // SOCIAL SIGNUP
  // ------------------------------------------------------------

  async function handleSocialSignup(
    provider:
      | "google"
      | "apple"
      | "facebook"
  ) {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const { error } =
        await socialLogin(
          provider,
          redirectPath
        );

      if (error) {
        console.error(
          "Social signup error:",
          error
        );

        alert(
          error.message ||
            "Unable to continue with social login."
        );

        setLoading(false);
      }
    } catch (error) {
      console.error(
        "Social signup failed:",
        error
      );

      alert(
        "Unable to continue with social login."
      );

      setLoading(false);
    }
  }

  const loginUrl =
    `/login?redirect=${encodeURIComponent(
      redirectPath
    )}`;

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------

  return (
    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-orange-100
        via-pink-100
        to-purple-200
        p-6
      "
    >

      <div
        className="
          bg-white
          w-full
          max-w-md
          rounded-3xl
          shadow-2xl
          p-10
        "
      >

        <div
          className="
            flex
            justify-center
            mb-8
          "
        >
          <Logo />
        </div>

        <h1
          className="
            text-4xl
            font-black
            text-center
            text-gray-900
          "
        >
          Create Account 🎉
        </h1>

        <p
          className="
            text-center
            text-gray-500
            mt-3
          "
        >
          Join and discover amazing events
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
              Create an account to continue.
            </strong>

            <p className="mt-1">
              After creating your account,
              you will be returned to your
              ticket purchase.
            </p>
          </div>
        )}

        {/* NAME */}

        <label
          className="
            block
            mt-8
            font-semibold
            text-gray-700
          "
        >
          Full Name
        </label>

        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Your full name"
          autoComplete="name"
          disabled={loading}
          className="
            mt-2
            w-full
            p-4
            rounded-2xl
            border
            outline-none
            focus:ring-2
            focus:ring-purple-500
            disabled:opacity-60
          "
        />

        {/* EMAIL */}

        <label
          className="
            block
            mt-5
            font-semibold
            text-gray-700
          "
        >
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder="Email address"
          autoComplete="email"
          disabled={loading}
          className="
            mt-2
            w-full
            p-4
            rounded-2xl
            border
            outline-none
            focus:ring-2
            focus:ring-purple-500
            disabled:opacity-60
          "
        />

        {/* PASSWORD */}

        <label
          className="
            block
            mt-5
            font-semibold
            text-gray-700
          "
        >
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRegister();
            }
          }}
          placeholder="Create password"
          autoComplete="new-password"
          disabled={loading}
          className="
            mt-2
            w-full
            p-4
            rounded-2xl
            border
            outline-none
            focus:ring-2
            focus:ring-purple-500
            disabled:opacity-60
          "
        />

        {/* REGISTER */}

        <button
          type="button"
          onClick={handleRegister}
          disabled={loading}
          className="
            mt-8
            w-full
            py-4
            rounded-2xl
            text-white
            font-bold
            text-lg
            bg-gradient-to-r
            from-orange-500
            via-pink-500
            to-purple-600
            hover:scale-105
            transition
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>

        {/* DIVIDER */}

        <div
          className="
            flex
            items-center
            gap-4
            my-8
          "
        >

          <div
            className="
              flex-1
              h-px
              bg-gray-200
            "
          />

          <span className="text-gray-400">
            OR
          </span>

          <div
            className="
              flex-1
              h-px
              bg-gray-200
            "
          />

        </div>

        {/* GOOGLE */}

        <button
          type="button"
          disabled={loading}
          onClick={() =>
            handleSocialSignup("google")
          }
          className="
            w-full
            py-3
            rounded-xl
            border
            font-semibold
            hover:bg-gray-50
            disabled:opacity-60
          "
        >
          <FcGoogle
            size={24}
            className="inline mr-3"
          />

          Continue with Google
        </button>

        {/* APPLE */}

        <button
          type="button"
          disabled={loading}
          onClick={() =>
            handleSocialSignup("apple")
          }
          className="
            mt-3
            w-full
            py-3
            rounded-xl
            border
            font-semibold
            hover:bg-gray-50
            disabled:opacity-60
          "
        >
          <FaApple
            size={24}
            className="inline mr-3"
          />

          Continue with Apple
        </button>

        {/* FACEBOOK */}

        <button
          type="button"
          disabled={loading}
          onClick={() =>
            handleSocialSignup("facebook")
          }
          className="
            mt-3
            w-full
            py-3
            rounded-xl
            border
            font-semibold
            hover:bg-gray-50
            disabled:opacity-60
          "
        >
          <FaFacebook
            size={24}
            className="
              inline
              mr-3
              text-blue-600
            "
          />

          Continue with Facebook
        </button>

        {/* LOGIN */}

        <p
          className="
            text-center
            mt-8
            text-gray-600
          "
        >
          Already have an account?

          <Link
            href={loginUrl}
            className="
              ml-2
              font-bold
              text-purple-600
            "
          >
            Login
          </Link>
        </p>

      </div>

    </main>
  );
}