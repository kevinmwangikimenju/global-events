import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    // ============================================================
    // READ LOGIN DATA
    // ============================================================

    const body = await request.json();

    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body?.password === "string"
        ? body.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        {
          error:
            "Email and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // GET COOKIES
    // ============================================================

    const cookieStore = await cookies();

    // ============================================================
    // CREATE SUPABASE SERVER CLIENT
    // ============================================================

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },

          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(
                ({ name, value, options }) => {
                  cookieStore.set(
                    name,
                    value,
                    options
                  );
                }
              );
            } catch (error) {
              console.error(
                "Supabase cookie update failed:",
                error
              );
            }
          },
        },
      }
    );

    // ============================================================
    // SIGN IN
    // ============================================================

    const {
      data,
      error,
    } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    // ============================================================
    // LOGIN FAILED
    // ============================================================

    if (error) {
      console.error(
        "Supabase login error:",
        error.message
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 401,
        }
      );
    }

    // ============================================================
    // VERIFY USER
    // ============================================================

    if (!data.user || !data.session) {
      return NextResponse.json(
        {
          error:
            "Login was not completed. Please try again.",
        },
        {
          status: 401,
        }
      );
    }

    // ============================================================
    // RETURN SUCCESS
    // ============================================================

    /*
     * Supabase SSR has already written the authentication
     * cookies through setAll() above.
     *
     * Returning the response normally allows those cookies
     * to remain available to the browser/server.
     */

    return NextResponse.json(
      {
        success: true,

        user: {
          id: data.user.id,
          email: data.user.email,
        },

        session: {
          access_token:
            data.session.access_token,

          refresh_token:
            data.session.refresh_token,

          expires_at:
            data.session.expires_at,

          expires_in:
            data.session.expires_in,

          token_type:
            data.session.token_type,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Login API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to process login.",
      },
      {
        status: 500,
      }
    );
  }
}