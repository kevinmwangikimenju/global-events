"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type QuantitySelectorProps = {
  initialQuantity: number;
  maxQuantity: number;
  eventId: string;
};

export default function QuantitySelector({
  initialQuantity,
  maxQuantity,
  eventId,
}: QuantitySelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const safeMax = Math.max(
    Number.isInteger(maxQuantity) && maxQuantity > 0
      ? maxQuantity
      : 1,
    1
  );

  const safeInitial = Math.min(
    Math.max(
      Number.isInteger(initialQuantity) && initialQuantity > 0
        ? initialQuantity
        : 1,
      1
    ),
    safeMax
  );

  const [quantity, setQuantity] = useState(safeInitial);

  function updateQuantity(nextQuantity: number) {
    const next = Math.min(
      Math.max(Math.floor(nextQuantity), 1),
      safeMax
    );

    setQuantity(next);

    const params = new URLSearchParams(searchParams.toString());

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
    const value = Number(event.target.value);

    if (!Number.isFinite(value)) {
      return;
    }

    updateQuantity(value);
  }

  return (
    <div className="w-full">
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

      {/* AVAILABILITY */}

      <p className="mt-3 text-sm text-gray-500">
        {safeMax} ticket{safeMax === 1 ? "" : "s"} available
      </p>

      {/* CURRENT SELECTION */}

      <p className="mt-1 text-sm font-bold text-purple-700">
        {quantity} ticket{quantity === 1 ? "" : "s"} selected
      </p>
    </div>
  );
}