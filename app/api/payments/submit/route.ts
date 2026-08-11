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
                  cookieStore.set(name, value, options);
                }
              );
            } catch {
              // Middleware handles cookie updates.
            }
          },
        },
      }
    );

    // ------------------------------------------------------------
    // CHECK USER
    // ------------------------------------------------------------

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in to submit a payment.",
        },
        { status: 401 }
      );
    }

    // ------------------------------------------------------------
    // READ FORM
    // ------------------------------------------------------------

    const formData = await request.formData();

    const eventId = String(
      formData.get("eventId") || ""
    ).trim();

    const bankId = String(
      formData.get("bankId") || ""
    ).trim();

    const quantityValue = Number(
      formData.get("quantity")
    );

    const screenshot = formData.get("screenshot");

    // ------------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------------

    const quantity =
      Number.isInteger(quantityValue) &&
      quantityValue > 0
        ? quantityValue
        : 0;

    if (!eventId) {
      return NextResponse.json(
        {
          success: false,
          error: "Event ID is required.",
        },
        { status: 400 }
      );
    }

    if (!bankId) {
      return NextResponse.json(
        {
          success: false,
          error: "Please select the bank used for payment.",
        },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ticket quantity.",
        },
        { status: 400 }
      );
    }

    if (
      !screenshot ||
      !(screenshot instanceof File)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Please upload your payment screenshot.",
        },
        { status: 400 }
      );
    }

    if (screenshot.size <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "The uploaded screenshot is empty.",
        },
        { status: 400 }
      );
    }

    if (screenshot.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The payment screenshot must be smaller than 10 MB.",
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(screenshot.type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Only PNG, JPG and WEBP screenshots are allowed.",
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
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        {
          success: false,
          error: "The selected event could not be found.",
        },
        { status: 404 }
      );
    }

    // ------------------------------------------------------------
    // CHECK AVAILABILITY
    // ------------------------------------------------------------

    const ticketsRemaining = Number(
      event.tickets_remaining
    );

    if (
      Number.isFinite(ticketsRemaining) &&
      ticketsRemaining < quantity
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "There are not enough tickets remaining for this purchase.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // LOAD BANK
    // ------------------------------------------------------------

    const {
      data: bank,
      error: bankError,
    } = await supabase
      .from("banks")
      .select(
        "id, bank_name, account_name, bsb, account_number, payid, status"
      )
      .eq("id", bankId)
      .eq("status", "active")
      .maybeSingle();

    if (bankError || !bank) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The selected payment account is no longer available.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // CALCULATE TOTAL
    // ------------------------------------------------------------

    const ticketPrice =
      Number(event.ticket_price) || 0;

    const total =
      ticketPrice * quantity;

    if (total <= 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The ticket price for this event is invalid.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // UPLOAD SCREENSHOT
    // ------------------------------------------------------------

    const extension =
      screenshot.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const fileName =
      `${user.id}/${event.id}/${crypto.randomUUID()}.${extension}`;

    const screenshotBuffer = Buffer.from(
      await screenshot.arrayBuffer()
    );

    const {
      error: uploadError,
    } = await supabase.storage
      .from("payment-screenshots")
      .upload(
        fileName,
        screenshotBuffer,
        {
          contentType: screenshot.type,
          upsert: false,
        }
      );

    if (uploadError) {
      console.error(
        "Screenshot upload error:",
        uploadError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Could not upload the payment screenshot.",
        },
        { status: 500 }
      );
    }

    // ------------------------------------------------------------
    // GET PUBLIC URL
    // ------------------------------------------------------------

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("payment-screenshots")
      .getPublicUrl(fileName);

    const proofUrl =
      publicUrlData.publicUrl;

    // ------------------------------------------------------------
    // CREATE PAYMENT
    //
    // IMPORTANT:
    // This uses the REAL payments table you confirmed.
    // ------------------------------------------------------------

    const paymentId =
      `PAY-${Date.now()}-${crypto.randomUUID()
        .slice(0, 8)
        .toUpperCase()}`;

    const {
      data: payment,
      error: paymentError,
    } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        event_id: event.id,
        bank_id: bank.id,
        payment_id: paymentId,
        amount: total,
        proof_url: proofUrl,
        status: "pending",
      })
      .select(
        "id, payment_id, amount, status, event_id, user_id"
      )
      .single();

    if (paymentError) {
      console.error(
        "Payment insert error:",
        paymentError
      );

      await supabase.storage
        .from("payment-screenshots")
        .remove([fileName]);

      return NextResponse.json(
        {
          success: false,
          error:
            "Could not create the payment verification request.",
        },
        { status: 500 }
      );
    }

    // ------------------------------------------------------------
    // SUCCESS
    // ------------------------------------------------------------

    return NextResponse.json({
      success: true,

      payment: {
        id: payment.id,
        payment_id: payment.payment_id,
        amount: payment.amount,
        status: payment.status,
      },

      message:
        "Payment submitted successfully. Your payment is now being verified.",
    });

  } catch (error) {
    console.error(
      "Payment submission error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while submitting your payment.",
      },
      { status: 500 }
    );
  }
}