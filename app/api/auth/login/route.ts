import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
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
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

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
    // 1. TRY NORMAL LOGIN
    // ============================================================

    const {
      data: loginData,
      error: loginError,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Existing user successfully logged in.
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
        },
        { status: 200 }
      );
    }

    // ============================================================
    // 2. PASSWORD LOGIN FAILED
    //
    // For the checkout flow, create an anonymous Supabase
    // session instead.
    // ============================================================

    console.log(
      "Password login failed. Attempting anonymous checkout session."
    );

    console.log(
      "Password login error:",
      loginError?.message
    );

    // Clear any existing session before creating the guest one.
    await supabase.auth.signOut();

    // ============================================================
    // 3. CREATE ANONYMOUS USER
    // ============================================================

    const {
      data: anonymousData,
      error: anonymousError,
    } = await supabase.auth.signInAnonymously();

    // ============================================================
    // 4. ANONYMOUS LOGIN FAILED
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

          details:
            anonymousError?.details || null,

          hint:
            anonymousError?.hint || null,
        },
        { status: 500 }
      );
    }

    // ============================================================
    // 5. ANONYMOUS LOGIN SUCCESS
    // ============================================================

    console.log(
      "Anonymous checkout session created:",
      anonymousData.user.id
    );

    return NextResponse.json(
      {
        success: true,
        guest: true,

        user: {
          id: anonymousData.user.id,
          email: anonymousData.user.email,
          user_metadata:
            anonymousData.user.user_metadata,
        },
      },
      { status: 200 }
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
      { status: 500 }
    );
  }
}