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
          success: false,
          error: "Email and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // COOKIES
    // ============================================================

    const cookieStore = await cookies();

    // ============================================================
    // SUPABASE SERVER CLIENT
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
    // TRY NORMAL LOGIN FIRST
    // ============================================================
    //
    // If the email/password belongs to a real registered user,
    // keep the normal authenticated account.
    //
    // If it does NOT belong to a registered user, we will create
    // an anonymous guest session instead.
    //
    // ============================================================

    const {
      data: loginData,
      error: loginError,
    } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    // ============================================================
    // REAL USER LOGIN SUCCESS
    // ============================================================

    if (
      !loginError &&
      loginData.user &&
      loginData.session
    ) {
      return NextResponse.json(
        {
          success: true,
          guest: false,

          user: {
            id: loginData.user.id,
            email: loginData.user.email,
            user_metadata:
              loginData.user.user_metadata,
          },

          session: {
            access_token:
              loginData.session.access_token,

            refresh_token:
              loginData.session.refresh_token,

            expires_at:
              loginData.session.expires_at,

            expires_in:
              loginData.session.expires_in,

            token_type:
              loginData.session.token_type,
          },
        },
        {
          status: 200,
        }
      );
    }

    // ============================================================
    // PASSWORD LOGIN FAILED
    // ============================================================
    //
    // IMPORTANT:
    //
    // For the ticket checkout flow, an invalid/nonexistent
    // email + password must NOT stop checkout.
    //
    // Instead we create a Supabase anonymous user.
    //
    // The email/password entered by the visitor is therefore
    // only used to attempt normal authentication.
    //
    // It is NOT stored as a guest account password.
    //
    // ============================================================

    console.log(
      "Normal login failed. Creating anonymous guest checkout session."
    );

    // ============================================================
    // CREATE ANONYMOUS SESSION
    // ============================================================

    const {
      data: anonymousData,
      error: anonymousError,
    } =
      await supabase.auth.signInAnonymously();

    // ============================================================
    // ANONYMOUS LOGIN FAILED
    // ============================================================

    if (
      anonymousError ||
      !anonymousData.user ||
      !anonymousData.session
    ) {
      console.error(
        "Anonymous authentication failed:",
        anonymousError?.message
      );

      return NextResponse.json(
        {
          success: false,

          error:
            "Guest checkout is currently unavailable. Please try again later.",
        },
        {
          status: 500,
        }
      );
    }

    // ============================================================
    // GUEST LOGIN SUCCESS
    // ============================================================

    return NextResponse.json(
      {
        success: true,
        guest: true,

        user: {
          id: anonymousData.user.id,
          email: anonymousData.user.email ?? null,

          user_metadata:
            anonymousData.user.user_metadata,
        },

        session: {
          access_token:
            anonymousData.session.access_token,

          refresh_token:
            anonymousData.session.refresh_token,

          expires_at:
            anonymousData.session.expires_at,

          expires_in:
            anonymousData.session.expires_in,

          token_type:
            anonymousData.session.token_type,
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
        success: false,

        error:
          "Unable to process login request.",
      },
      {
        status: 500,
      }
    );
  }
}