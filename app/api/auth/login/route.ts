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
    // TRY NORMAL EMAIL/PASSWORD LOGIN
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
    // NORMAL USER LOGIN SUCCESS
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
    // NORMAL LOGIN FAILED
    //
    // For this application's checkout flow, an unknown email
    // or password should NOT stop the visitor from buying.
    //
    // Instead, create an anonymous Supabase guest session.
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
    //
    // TEMPORARY DIAGNOSTIC RESPONSE
    //
    // We intentionally return the Supabase error here so we can
    // identify why production anonymous authentication is failing.
    // ============================================================

    if (
      anonymousError ||
      !anonymousData.user ||
      !anonymousData.session
    ) {
      console.error(
        "Anonymous authentication failed:",
        anonymousError
      );

      return NextResponse.json(
        {
          success: false,

          error:
            anonymousError?.message ||
            "Anonymous authentication failed.",

          code:
            anonymousError?.code || null,

          status:
            anonymousError?.status || null,
        },
        {
          status: 500,
        }
      );
    }

    // ============================================================
    // ANONYMOUS GUEST SESSION SUCCESS
    // ============================================================

    return NextResponse.json(
      {
        success: true,
        guest: true,

        user: {
          id: anonymousData.user.id,

          email:
            anonymousData.user.email ?? null,

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
          error instanceof Error
            ? error.message
            : "Unable to process login request.",
      },
      {
        status: 500,
      }
    );
  }
}