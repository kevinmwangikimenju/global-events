"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type QuantitySelectorProps = {
  eventId: string;
  ticketPrice: number;
  ticketsRemaining: number;
  initialQuantity?: number;
};

export default function QuantitySelector({
  eventId,
  ticketPrice,
  ticketsRemaining,
  initialQuantity = 1,
}: QuantitySelectorProps) {
  const router = useRouter();

  const maximum =
    ticketsRemaining > 0
      ? ticketsRemaining
      : 1;

  const safeInitialQuantity = Math.min(
    Math.max(initialQuantity, 1),
    maximum
  );

  const [quantity, setQuantity] = useState(
    safeInitialQuantity
  );

  const total =
    ticketPrice * quantity;

  // ============================================================
  // UPDATE CHECKOUT URL
  // ============================================================

  useEffect(() => {
    const url =
      `/checkout/${eventId}?quantity=${quantity}`;

    window.history.replaceState(
      null,
      "",
      url
    );
  }, [eventId, quantity]);

  // ============================================================
  // DECREASE
  // ============================================================

  function decrease() {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  }

  // ============================================================
  // INCREASE
  // ============================================================

  function increase() {
    setQuantity((current) =>
      Math.min(maximum, current + 1)
    );
  }

  // ============================================================
  // CONTINUE
  // ============================================================

  function continueToPayment() {
    router.push(
      `/payment?event=${encodeURIComponent(
        eventId
      )}&quantity=${encodeURIComponent(
        String(quantity)
      )}`
    );
  }

  return (
    <div className="space-y-6">

      {/* ====================================================== */}
      {/* QUANTITY */}
      {/* ====================================================== */}

      <div>

        <p className="text-sm text-gray-500">
          Number of tickets
        </p>

        <div className="mt-3 flex items-center gap-3">

          {/* MINUS */}

          <button
            type="button"
            onClick={decrease}
            disabled={quantity <= 1}
            className="
              w-12
              h-12
              rounded-xl
              border-2
              border-gray-200
              bg-white
              text-2xl
              font-black
              hover:bg-gray-100
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            −
          </button>

          {/* NUMBER */}

          <div
            className="
              w-20
              h-12
              rounded-xl
              bg-gray-100
              flex
              items-center
              justify-center
              text-xl
              font-black
            "
          >
            {quantity}
          </div>

          {/* PLUS */}

          <button
            type="button"
            onClick={increase}
            disabled={quantity >= maximum}
            className="
              w-12
              h-12
              rounded-xl
              border-2
              border-gray-200
              bg-white
              text-2xl
              font-black
              hover:bg-gray-100
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            +
          </button>

        </div>

        <p className="mt-2 text-xs text-gray-500">
          Maximum available: {ticketsRemaining} ticket
          {ticketsRemaining === 1 ? "" : "s"}
        </p>

      </div>

      {/* ====================================================== */}
      {/* PRICE CALCULATION */}
      {/* ====================================================== */}

      <div className="border-t border-gray-200 pt-6">

        <div className="flex justify-between items-center">

          <span className="text-gray-600">
            Price per ticket
          </span>

          <span className="font-bold">
            ${ticketPrice.toFixed(2)}
          </span>

        </div>

        <div className="flex justify-between items-center mt-4">

          <span className="text-gray-600">
            Tickets
          </span>

          <span className="font-bold">
            {quantity}
          </span>

        </div>

        <div className="border-t border-gray-200 my-5" />

        <div className="flex justify-between items-center">

          <span className="text-xl font-black">
            Total
          </span>

          <span className="text-3xl font-black text-purple-700">
            ${total.toFixed(2)}
          </span>

        </div>

      </div>

      {/* ====================================================== */}
      {/* PAYMENT */}
      {/* ====================================================== */}

      <button
        type="button"
        onClick={continueToPayment}
        className="
          block
          w-full
          text-center
          py-4
          rounded-xl
          bg-gradient-to-r
          from-orange-500
          to-purple-700
          text-white
          font-black
          text-lg
          shadow-lg
          hover:scale-[1.02]
          transition
        "
      >
        Continue to Payment
      </button>

    </div>
  );
}