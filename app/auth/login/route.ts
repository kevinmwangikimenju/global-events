import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SUPPORTED_PROVIDERS = [
  "google",
  "apple",
  "facebook",
] as const;

type Provider =
  (typeof SUPPORTED_PROVIDERS)[number];

function getSafeRedirect(
  value: string | null
) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/dashboard";
  }

  return value;
}

// ============================================================
// CREATE SERVER SUPABASE CLIENT
// ============================================================

async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
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
              ({
                name,
                value,
                options,
              }) => {
                cookieStore.set(
                  name,
                  value,
                  options
                );
              }
            );
          } catch {
            /*
             * This can happen when cookies are
             * changed from a Server Component.
             *
             * Route handlers can normally write
             * these cookies.
             */
          }
        },
      },
    }
  );
}

// ============================================================
// EMAIL / PASSWORD LOGIN
// ============================================================

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const email =
      typeof body?.email === "string"
        ? body.email
            .trim()
            .toLowerCase()
        : "";

    const password =
      typeof body?.password === "string"
        ? body.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Email and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase =
      await createSupabaseServerClient();

    const {
      data,
      error,
    } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    if (error) {
      console.error(
        "Supabase login error:",
        error.message
      );

      return NextResponse.json(
        {
          success: false,
          error:
            error.message ||
            "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Login succeeded but no user was returned.",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,

        user: {
          id: data.user.id,
          email: data.user.email,
          user_metadata:
            data.user.user_metadata,
        },

        session: data.session
          ? {
              access_token:
                data.session.access_token,
              refresh_token:
                data.session.refresh_token,
              expires_at:
                data.session.expires_at,
            }
          : null,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Login route error:",
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

// ============================================================
// SOCIAL / OAUTH LOGIN
// ============================================================

export async function GET(
  request: Request
) {
  const requestUrl =
    new URL(request.url);

  const providerParam =
    requestUrl.searchParams.get(
      "provider"
    );

  const next =
    getSafeRedirect(
      requestUrl.searchParams.get(
        "next"
      )
    );

  if (
    !SUPPORTED_PROVIDERS.includes(
      providerParam as Provider
    )
  ) {
    return NextResponse.redirect(
      new URL(
        "/login?error=unsupported_provider",
        requestUrl.origin
      )
    );
  }

  const provider =
    providerParam as Provider;

  try {
    const supabase =
      await createSupabaseServerClient();

    const callbackUrl =
      new URL(
        "/auth/callback",
        requestUrl.origin
      );

    callbackUrl.searchParams.set(
      "next",
      next
    );

    const {
      data,
      error,
    } =
      await supabase.auth.signInWithOAuth(
        {
          provider,

          options: {
            redirectTo:
              callbackUrl.toString(),
          },
        }
      );

    if (
      error ||
      !data?.url
    ) {
      console.error(
        "OAuth start failed:",
        error?.message
      );

      return NextResponse.redirect(
        new URL(
          `/login?error=oauth_failed&provider=${encodeURIComponent(
            provider
          )}`,
          requestUrl.origin
        )
      );
    }

    return NextResponse.redirect(
      data.url
    );
  } catch (error) {
    console.error(
      "OAuth route error:",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/login?error=oauth_failed",
        requestUrl.origin
      )
    );
  }
}