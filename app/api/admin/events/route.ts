import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(
  request: Request
) {
  try {
    const supabase =
      await createSupabaseServerClient();

    /*
     * Get the authenticated Supabase user
     * from the server-side session.
     */
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must login first.",
        },
        { status: 401 }
      );
    }

    /*
     * Verify that this authenticated Supabase
     * user is actually in the admins table.
     */
    const { data: admin, error: adminError } =
      await supabase
        .from("admins")
        .select("id, auth_id, email")
        .eq("auth_id", user.id)
        .maybeSingle();

    if (adminError) {
      console.error(
        "Admin verification error:",
        adminError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify administrator account.",
        },
        { status: 500 }
      );
    }

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This account is not registered as an administrator.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const bannerUrl =
      typeof body.banner_url === "string"
        ? body.banner_url.trim()
        : "";

    const category =
      typeof body.category === "string"
        ? body.category.trim()
        : "";

    const venue =
      typeof body.venue === "string"
        ? body.venue.trim()
        : "";

    const city =
      typeof body.city === "string"
        ? body.city.trim()
        : "";

    const country =
      typeof body.country === "string"
        ? body.country.trim()
        : "";

    const eventDate =
      typeof body.event_date === "string"
        ? body.event_date
        : "";

    const eventTime =
      typeof body.event_time === "string"
        ? body.event_time
        : "";

    const ticketPrice =
      Number(body.ticket_price);

    const ticketQuantity =
      Number(body.ticket_quantity);

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error: "Event title is required.",
        },
        { status: 400 }
      );
    }

    if (!eventDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Event date is required.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(ticketPrice) ||
      ticketPrice < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ticket price.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(ticketQuantity) ||
      ticketQuantity < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ticket quantity.",
        },
        { status: 400 }
      );
    }

    /*
     * Insert using the SAME authenticated server
     * Supabase client.
     */
    const { data: event, error } =
      await supabase
        .from("events")
        .insert({
          title,
          description,
          banner_url: bannerUrl,
          category,
          venue,
          city,
          country,
          event_date: eventDate,
          event_time: eventTime,
          ticket_price: ticketPrice,
          ticket_quantity: ticketQuantity,
          tickets_remaining: ticketQuantity,
          status: "published",
          created_by: user.id,
        })
        .select()
        .single();

    if (error) {
      console.error(
        "Event insert error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        event,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create event API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create event.",
      },
      { status: 500 }
    );
  }
}