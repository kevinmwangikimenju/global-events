"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type QuantitySelectorProps = {
  initialQuantity: number;
  maxQuantity: number;
  eventId: string;
  ticketPrice: number;
};

export default function QuantitySelector({
  initialQuantity,
  maxQuantity,
  eventId,
  ticketPrice,
}: QuantitySelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const safeMax =
    Number.isInteger(maxQuantity) && maxQuantity > 0
      ? maxQuantity
      : 1;

  const safeInitial = Math.min(
    Math.max(
      Number.isInteger(initialQuantity) && initialQuantity > 0
        ? initialQuantity
        : 1,
      1
    ),
    safeMax
  );

  const safeTicketPrice =
    Number.isFinite(ticketPrice) && ticketPrice >= 0
      ? ticketPrice
      : 0;

  const [quantity, setQuantity] = useState(safeInitial);

  function updateQuantity(nextQuantity: number) {
    const next = Math.min(
      Math.max(Math.floor(nextQuantity), 1),
      safeMax
    );

    setQuantity(next);

    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("quantity", String(next));

    router.push(
      `/checkout/${encodeURIComponent(eventId)}?${params.toString()}`,
      {
        scroll: false,
      }
    );
  }

  function decrease() {
    if (quantity > 1) {
      updateQuantity(quantity - 1);
    }
  }

  function increase() {
    if (quantity < safeMax) {
      updateQuantity(quantity + 1);
    }
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const rawValue = event.target.value;

    if (rawValue === "") {
      return;
    }

    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
      return;
    }

    updateQuantity(value);
  }

  const selectedTotal = safeTicketPrice * quantity;

  return (
    <div className="w-full">

      {/* ======================================================
          QUANTITY CONTROLS
      ====================================================== */}

      <div className="flex items-center gap-4">

        {/* DECREASE */}

        <button
          type="button"
          onClick={decrease}
          disabled={quantity <= 1}
          aria-label="Decrease ticket quantity"
          className="
            w-12
            h-12
            rounded-xl
            border-2
            border-gray-300
            bg-white
            text-2xl
            font-black
            text-gray-900
            flex
            items-center
            justify-center
            hover:bg-gray-100
            disabled:opacity-40
            disabled:cursor-not-allowed
            transition
          "
        >
          −
        </button>

        {/* QUANTITY INPUT */}

        <input
          type="number"
          min={1}
          max={safeMax}
          value={quantity}
          onChange={handleInputChange}
          aria-label="Ticket quantity"
          className="
            w-24
            h-12
            rounded-xl
            border-2
            border-gray-300
            bg-white
            text-center
            text-xl
            font-black
            text-gray-900
            outline-none
            focus:border-purple-600
            focus:ring-2
            focus:ring-purple-200
          "
        />

        {/* INCREASE */}

        <button
          type="button"
          onClick={increase}
          disabled={quantity >= safeMax}
          aria-label="Increase ticket quantity"
          className="
            w-12
            h-12
            rounded-xl
            border-2
            border-gray-300
            bg-white
            text-2xl
            font-black
            text-gray-900
            flex
            items-center
            justify-center
            hover:bg-gray-100
            disabled:opacity-40
            disabled:cursor-not-allowed
            transition
          "
        >
          +
        </button>

      </div>

      {/* ======================================================
          AVAILABILITY
      ====================================================== */}

      <p className="mt-3 text-sm text-gray-500">
        {safeMax} ticket{safeMax === 1 ? "" : "s"} available
      </p>

      {/* ======================================================
          CURRENT SELECTION
      ====================================================== */}

      <p className="mt-1 text-sm font-bold text-purple-700">
        {quantity} ticket{quantity === 1 ? "" : "s"} selected
      </p>

      {/* ======================================================
          SELECTED TOTAL
      ====================================================== */}

      <div className="mt-4 rounded-xl bg-purple-50 border border-purple-100 px-4 py-3">

        <div className="flex items-center justify-between gap-4">

          <span className="text-sm text-gray-600">
            Selected total
          </span>

          <span className="font-black text-purple-700">
            ${selectedTotal.toFixed(2)}
          </span>

        </div>

      </div>

    </div>
  );
}