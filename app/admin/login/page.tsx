"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loginAdmin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      /*
       * Sign in with Supabase Auth.
       */
      const {
        data,
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (loginError || !data.user) {
        setError(
          loginError?.message ||
            "Invalid email or password."
        );

        return;
      }

      /*
       * Make sure the browser has a valid session.
       */
      const {
        data: {
          session,
        },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "Login succeeded but no session was created. Please try again."
        );

        return;
      }

      /*
       * Verify admin status using the authenticated
       * user's UUID.
       */
      const {
        data: admin,
        error: adminError,
      } = await supabase
        .from("admins")
        .select("id, auth_id, email")
        .eq("auth_id", data.user.id)
        .maybeSingle();

      if (adminError) {
        console.error(
          "Admin verification error:",
          adminError
        );

        setError(
          "Database error checking administrator account."
        );

        return;
      }

      if (!admin) {
        await supabase.auth.signOut();

        setError(
          "This account is not registered as an administrator."
        );

        return;
      }

      /*
       * Admin is authenticated.
       *
       * Full page navigation forces the server and
       * middleware to read the newly-created cookies.
       */
      window.location.href = "/admin/dashboard";
    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-blue-600
        via-purple-600
        to-pink-500
        p-6
      "
    >
      <div
        className="
          bg-white
          rounded-3xl
          shadow-2xl
          p-10
          w-full
          max-w-md
        "
      >
        <div className="text-center">
          <div className="text-5xl mb-4">
            🔐
          </div>

          <h1 className="text-3xl font-bold">
            Admin Portal
          </h1>

          <p className="text-gray-500 mt-2">
            Global Events Management
          </p>
        </div>

        <form
          onSubmit={loginAdmin}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="text-sm font-semibold">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
                w-full
                mt-2
                border
                rounded-xl
                p-3
                outline-none
                focus:ring-2
                focus:ring-purple-500
              "
              placeholder="admin@email.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="
                w-full
                mt-2
                border
                rounded-xl
                p-3
                outline-none
                focus:ring-2
                focus:ring-purple-500
              "
              placeholder="********"
              required
            />
          </div>

          {error && (
            <div
              className="
                bg-red-100
                text-red-600
                p-3
                rounded-xl
                text-center
              "
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-gradient-to-r
              from-blue-600
              to-purple-600
              text-white
              py-3
              rounded-xl
              font-bold
              hover:opacity-90
              disabled:opacity-50
            "
          >
            {loading
              ? "Checking..."
              : "Login as Admin"}
          </button>
        </form>
      </div>
    </main>
  );
}