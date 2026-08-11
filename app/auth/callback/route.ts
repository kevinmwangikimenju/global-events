import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");

  const nextParam =
    requestUrl.searchParams.get("next");

  const next =
    nextParam &&
    nextParam.startsWith("/")
      ? nextParam
      : "/dashboard";

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
          } catch {
            /*
             * Cookie changes may be handled by
             * middleware during a server-component
             * request.
             */
          }
        },
      },
    }
  );

  /*
   * Supabase OAuth returns a temporary authorization
   * code. Exchange that code for the user's session.
   */

  if (code) {
    const {
      error,
    } =
      await supabase.auth.exchangeCodeForSession(
        code
      );

    if (!error) {
      return NextResponse.redirect(
        new URL(
          next,
          requestUrl.origin
        )
      );
    }

    console.error(
      "OAuth session exchange failed:",
      error.message
    );
  }

  /*
   * If the OAuth callback failed, return the user
   * to login and preserve the page they originally
   * wanted to access.
   */

  const loginUrl = new URL(
    "/login",
    requestUrl.origin
  );

  loginUrl.searchParams.set(
    "error",
    "authentication_failed"
  );

  loginUrl.searchParams.set(
    "redirect",
    next
  );

  return NextResponse.redirect(
    loginUrl
  );
}