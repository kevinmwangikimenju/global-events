import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
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
              // Middleware handles cookies.
            }
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const paymentId = String(
      body.paymentId || ""
    ).trim();

    const action = String(
      body.action || ""
    ).trim();

    if (!paymentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      action !== "approved" &&
      action !== "rejected"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid verification action.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // LOAD PAYMENT
    // ------------------------------------------------------------

    const {
      data: payment,
      error: paymentError,
    } = await supabase
      .from("payment_verifications")
      .select("*")
      .eq("id", paymentId)
      .eq("status", "pending")
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Payment verification request was not found or has already been processed.",
        },
        { status: 404 }
      );
    }

    // ------------------------------------------------------------
    // REJECT PAYMENT
    // ------------------------------------------------------------

    if (action === "rejected") {
      const {
        error: rejectError,
      } = await supabase
        .from("payment_verifications")
        .update({
          status: "rejected",
        })
        .eq("id", payment.id);

      if (rejectError) {
        return NextResponse.json(
          {
            success: false,
            error: rejectError.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        status: "rejected",
        message:
          "Verification failed. The customer will need to try again later.",
      });
    }

    // ------------------------------------------------------------
    // APPROVE PAYMENT
    // ------------------------------------------------------------

    const quantity =
      Number(payment.quantity) || 1;

    const totalAmount =
      Number(payment.total_amount) || 0;

    if (quantity <= 0 || totalAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Payment contains invalid quantity or amount.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // LOAD EVENT
    // ------------------------------------------------------------

    const {
      data: event,
      error: eventError,
    } = await supabase
      .from("events")
      .select(
        "id, title, ticket_price, tickets_remaining"
      )
      .eq("id", payment.event_id)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        {
          success: false,
          error: "Event could not be found.",
        },
        { status: 404 }
      );
    }

    // ------------------------------------------------------------
    // CHECK TICKET AVAILABILITY
    // ------------------------------------------------------------

    if (
      event.tickets_remaining !== null &&
      event.tickets_remaining !== undefined
    ) {
      const remaining =
        Number(event.tickets_remaining);

      if (
        Number.isFinite(remaining) &&
        remaining < quantity
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "There are not enough tickets remaining.",
          },
          { status: 400 }
        );
      }
    }

    // ------------------------------------------------------------
    // CREATE ORDER
    // ------------------------------------------------------------

    const {
      data: order,
      error: orderError,
    } = await supabase
      .from("orders")
      .insert({
        user_id: payment.user_id,
        event_id: payment.event_id,
        quantity: quantity,
        total_price: totalAmount,
        total_amount: totalAmount,
        payment_status: "paid",
        verified: true,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error(
        "Order creation error:",
        orderError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            orderError?.message ||
            "Could not create the order.",
        },
        { status: 500 }
      );
    }

    // ------------------------------------------------------------
    // CREATE ONE TICKET FOR EACH TICKET PURCHASED
    // ------------------------------------------------------------

    const tickets = Array.from(
      { length: quantity },
      (_, index) => ({
        order_id: order.id,
        user_id: payment.user_id,
        event_id: payment.event_id,
        qr_code:
          `tixel-${order.id}-${Date.now()}-${index}-${crypto.randomUUID()}`,
        status: "active",
      })
    );

    const {
      error: ticketsError,
    } = await supabase
      .from("tickets")
      .insert(tickets);

    if (ticketsError) {
      console.error(
        "Ticket creation error:",
        ticketsError
      );

      // Remove the order because tickets failed.
      await supabase
        .from("orders")
        .delete()
        .eq("id", order.id);

      return NextResponse.json(
        {
          success: false,
          error:
            "Payment was not completed because the tickets could not be created.",
        },
        { status: 500 }
      );
    }

    // ------------------------------------------------------------
    // REDUCE AVAILABLE TICKETS
    // ------------------------------------------------------------

    if (
      event.tickets_remaining !== null &&
      event.tickets_remaining !== undefined
    ) {
      const remaining =
        Number(event.tickets_remaining);

      if (Number.isFinite(remaining)) {
        await supabase
          .from("events")
          .update({
            tickets_remaining:
              remaining - quantity,
          })
          .eq("id", event.id);
      }
    }

    // ------------------------------------------------------------
    // MARK PAYMENT AS APPROVED
    // ------------------------------------------------------------

    const {
      error: approveError,
    } = await supabase
      .from("payment_verifications")
      .update({
        status: "approved",
      })
      .eq("id", payment.id);

    if (approveError) {
      console.error(
        "Payment update error:",
        approveError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Tickets were created, but payment status could not be updated.",
        },
        { status: 500 }
      );
    }

    // ------------------------------------------------------------
    // SUCCESS
    // ------------------------------------------------------------

    return NextResponse.json({
      success: true,
      status: "approved",
      orderId: order.id,
      quantity: quantity,
      message:
        "Payment approved and tickets created successfully.",
    });

  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while verifying the payment.",
      },
      { status: 500 }
    );
  }
}