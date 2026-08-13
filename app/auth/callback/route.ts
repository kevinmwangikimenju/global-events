import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getSafeRedirect(value: string | null) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return "/dashboard";
  }

  return value;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");

  const next = getSafeRedirect(
    requestUrl.searchParams.get("next")
  );

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
              "Supabase callback cookie update failed:",
              error
            );
          }
        },
      },
    }
  );

  if (code) {
    const { error } =
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