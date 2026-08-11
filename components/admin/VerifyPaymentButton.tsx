"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Payment = {
  id: string;
  payment_id: string;
  user_id: string;
  event_id: string;
  amount: number;
};

export default function VerifyPaymentButton({
  payment,
}: {
  payment: Payment;
}) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function approve() {
    if (loading) return;

    const confirmed = window.confirm(
      "Approve this payment and create the customer's ticket?"
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      // ----------------------------------------------------------
      // CHECK PAYMENT IS STILL PENDING
      // ----------------------------------------------------------

      const {
        data: currentPayment,
        error: paymentCheckError,
      } = await supabase
        .from("payments")
        .select(
          "id, payment_id, user_id, event_id, amount, status"
        )
        .eq("id", payment.id)
        .single();

      if (paymentCheckError) {
        throw new Error(
          paymentCheckError.message
        );
      }

      if (!currentPayment) {
        throw new Error(
          "Payment could not be found."
        );
      }

      if (
        currentPayment.status !==
        "pending"
      ) {
        throw new Error(
          "This payment has already been processed."
        );
      }

      // ----------------------------------------------------------
      // LOAD EVENT
      // ----------------------------------------------------------

      const {
        data: event,
        error: eventError,
      } = await supabase
        .from("events")
        .select(
          "id, ticket_price, tickets_remaining"
        )
        .eq(
          "id",
          currentPayment.event_id
        )
        .single();

      if (eventError || !event) {
        throw new Error(
          "Event could not be found."
        );
      }

      const ticketPrice =
        Number(event.ticket_price) || 0;

      const amount =
        Number(currentPayment.amount) || 0;

      if (
        ticketPrice <= 0 ||
        amount <= 0
      ) {
        throw new Error(
          "Invalid payment or ticket price."
        );
      }

      // ----------------------------------------------------------
      // DETERMINE QUANTITY
      // ----------------------------------------------------------

      const quantity = Math.max(
        1,
        Math.round(
          amount / ticketPrice
        )
      );

      // ----------------------------------------------------------
      // CHECK TICKETS
      // ----------------------------------------------------------

      const remaining =
        Number(
          event.tickets_remaining
        );

      if (
        Number.isFinite(remaining) &&
        remaining < quantity
      ) {
        throw new Error(
          "There are not enough tickets remaining."
        );
      }

      // ----------------------------------------------------------
      // CREATE ORDER
      // ----------------------------------------------------------

      const {
        data: order,
        error: orderError,
      } = await supabase
        .from("orders")
        .insert({
          user_id:
            currentPayment.user_id,

          event_id:
            currentPayment.event_id,

          quantity,

          total_price:
            amount,

          total_amount:
            amount,

          payment_status:
            "paid",

          verified: true,
        })
        .select()
        .single();

      if (orderError || !order) {
        throw new Error(
          orderError?.message ||
            "Could not create order."
        );
      }

      // ----------------------------------------------------------
      // CREATE TICKETS
      // ----------------------------------------------------------

      const tickets = Array.from(
        { length: quantity },
        (_, index) => ({
          order_id: order.id,

          user_id:
            currentPayment.user_id,

          event_id:
            currentPayment.event_id,

          qr_code:
            `tixel-${order.id}-${index + 1}-${crypto.randomUUID()}`,

          status: "active",
        })
      );

      const {
        error: ticketError,
      } = await supabase
        .from("tickets")
        .insert(tickets);

      if (ticketError) {
        // Remove order if ticket creation failed.
        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        throw new Error(
          ticketError.message
        );
      }

      // ----------------------------------------------------------
      // UPDATE PAYMENT
      // ----------------------------------------------------------

      const {
        error: updatePaymentError,
      } = await supabase
        .from("payments")
        .update({
          status: "approved",
          order_id: order.id,
        })
        .eq("id", currentPayment.id)
        .eq("status", "pending");

      if (updatePaymentError) {
        throw new Error(
          updatePaymentError.message
        );
      }

      // ----------------------------------------------------------
      // UPDATE EVENT TICKET COUNT
      // ----------------------------------------------------------

      if (Number.isFinite(remaining)) {
        const newRemaining =
          Math.max(
            0,
            remaining - quantity
          );

        await supabase
          .from("events")
          .update({
            tickets_remaining:
              newRemaining,
          })
          .eq(
            "id",
            currentPayment.event_id
          );
      }

      alert(
        `Payment approved. ${quantity} ticket${
          quantity === 1 ? "" : "s"
        } created.`
      );

      router.refresh();

    } catch (error) {
      console.error(
        "Payment approval error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Could not approve payment."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={approve}
      className="
        mt-6
        w-full
        bg-green-600
        hover:bg-green-700
        disabled:bg-gray-400
        text-white
        py-4
        rounded-xl
        font-black
        transition
      "
    >
      {loading
        ? "Approving..."
        : "✅ APPROVE PAYMENT"}
    </button>
  );
}