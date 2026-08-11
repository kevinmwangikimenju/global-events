import { supabase } from "./supabase";

// ============================================================
// HELPERS
// ============================================================

function getSafeRedirect(
  redirectPath?: string
) {
  if (
    redirectPath &&
    redirectPath.startsWith("/") &&
    !redirectPath.startsWith("//")
  ) {
    return redirectPath;
  }

  return "/dashboard";
}

// ============================================================
// REGISTER
// ============================================================

export async function register(
  email: string,
  password: string,
  fullName: string
) {
  try {
    const cleanEmail =
      email.trim().toLowerCase();

    const cleanName =
      fullName.trim();

    const {
      data,
      error,
    } =
      await supabase.auth.signUp({
        email: cleanEmail,

        password,

        options: {
          data: {
            full_name: cleanName,
          },
        },
      });

    return {
      data,
      error,
    };
  } catch (error) {
    console.error(
      "Registration failed:",
      error
    );

    return {
      data: {
        user: null,
        session: null,
      },

      error:
        error instanceof Error
          ? error
          : new Error(
              "Unable to create account."
            ),
    };
  }
}

// ============================================================
// LOGIN
// ============================================================

export async function login(
  email: string,
  password: string
) {
  try {
    const response =
      await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email:
              email
                .trim()
                .toLowerCase(),

            password,
          }),
        }
      );

    let result: any = null;

    try {
      result =
        await response.json();
    } catch {
      result = null;
    }

    if (!response.ok) {
      return {
        user: null,
        session: null,

        error: new Error(
          result?.error ||
            "Login failed. Please check your email and password."
        ),
      };
    }

    if (
      !result?.success ||
      !result?.user
    ) {
      return {
        user: null,
        session: null,

        error: new Error(
          "Login was not completed."
        ),
      };
    }

    /*
     * The server route has already created
     * the authenticated Supabase cookies.
     */

    const {
      data: sessionData,
      error: sessionError,
    } =
      await supabase.auth.getSession();

    if (sessionError) {
      console.error(
        "Could not read Supabase session:",
        sessionError
      );

      /*
       * The server already authenticated
       * the user, so still return the user.
       */

      return {
        user: result.user,
        session: null,
        error: sessionError,
      };
    }

    return {
      user:
        sessionData.session?.user ||
        result.user ||
        null,

      session:
        sessionData.session ||
        result.session ||
        null,

      error: null,
    };
  } catch (error) {
    console.error(
      "Login request failed:",
      error
    );

    return {
      user: null,
      session: null,

      error:
        error instanceof Error
          ? error
          : new Error(
              "Unable to connect to the login server."
            ),
    };
  }
}

// ============================================================
// SOCIAL LOGIN
// ============================================================

export async function socialLogin(
  provider:
    | "google"
    | "apple"
    | "facebook",

  redirectPath?: string
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return {
      data: null,

      error: new Error(
        "Social login must be started in the browser."
      ),
    };
  }

  const destination =
    getSafeRedirect(
      redirectPath
    );

  const callbackUrl =
    `${window.location.origin}/auth/callback` +
    `?next=${encodeURIComponent(
      destination
    )}`;

  const {
    data,
    error,
  } =
    await supabase.auth.signInWithOAuth(
      {
        provider,

        options: {
          redirectTo:
            callbackUrl,
        },
      }
    );

  return {
    data,
    error,
  };
}

// ============================================================
// LOGOUT
// ============================================================

export async function logout() {
  try {
    const { error } =
      await supabase.auth.signOut();

    return {
      error,
    };
  } catch (error) {
    console.error(
      "Logout failed:",
      error
    );

    return {
      error:
        error instanceof Error
          ? error
          : new Error(
              "Unable to log out."
            ),
    };
  }
}