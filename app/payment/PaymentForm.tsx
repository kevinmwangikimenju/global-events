"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Bank = {
  id: string;
  bank_name: string;
  account_name: string;
  bsb?: string | null;
  account_number?: string | null;
  payid?: string | null;
  status?: string | null;
};

type PaymentFormProps = {
  banks: Bank[];
  banksError: string | null;
  quantity: number;
  ticketPrice: number;
  total: number;
  eventId: string;
};

export default function PaymentForm({
  banks,
  banksError,
  quantity,
  ticketPrice,
  total,
  eventId,
}: PaymentFormProps) {
  const router = useRouter();

  const [bankId, setBankId] = useState("");
  const [screenshot, setScreenshot] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function submitPayment(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!bankId) {
      setError(
        "Please select the bank you used for payment."
      );
      return;
    }

    if (!screenshot) {
      setError(
        "Please upload your payment screenshot."
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "eventId",
        eventId
      );

      formData.append(
        "bankId",
        bankId
      );

      formData.append(
        "quantity",
        String(quantity)
      );

      formData.append(
        "screenshot",
        screenshot
      );

      const response = await fetch(
        "/api/payments/submit",
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Payment submission failed."
        );
      }

      setMessage(
        data.message ||
          "Payment submitted successfully."
      );

      setScreenshot(null);
      setBankId("");

      const fileInput =
        document.getElementById(
          "payment-screenshot"
        ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      router.refresh();

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting your payment."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submitPayment}
      className="mt-10 space-y-8"
    >

      {/* ---------------------------------------------------- */}
      {/* TOTAL */}
      {/* ---------------------------------------------------- */}

      <div className="bg-gray-50 border rounded-2xl p-6">

        <div className="flex justify-between">
          <span className="text-gray-600">
            {quantity} ticket
            {quantity === 1 ? "" : "s"}
          </span>

          <span className="font-bold">
            ${ticketPrice.toFixed(2)} each
          </span>
        </div>

        <div className="border-t my-4" />

        <div className="flex justify-between items-center">

          <span className="text-xl font-black">
            Amount to Pay
          </span>

          <span className="text-3xl font-black text-purple-700">
            ${total.toFixed(2)}
          </span>

        </div>

      </div>

      {/* ---------------------------------------------------- */}
      {/* BANK ERROR */}
      {/* ---------------------------------------------------- */}

      {banksError && (
        <div className="bg-red-100 border border-red-200 text-red-700 rounded-2xl p-5">
          {banksError}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* BANK SELECTION */}
      {/* ---------------------------------------------------- */}

      <div>

        <label
          htmlFor="bank"
          className="block text-lg font-black mb-3"
        >
          Select Payment Bank
        </label>

        {banks.length === 0 ? (
          <div className="bg-orange-50 border border-orange-200 text-orange-700 rounded-2xl p-5">
            No active payment accounts are currently
            available.
          </div>
        ) : (
          <select
            id="bank"
            value={bankId}
            onChange={(e) =>
              setBankId(e.target.value)
            }
            disabled={loading}
            className="
              w-full
              border
              border-gray-300
              rounded-xl
              px-5
              py-4
              bg-white
              text-gray-900
              font-semibold
              outline-none
              focus:ring-2
              focus:ring-purple-500
            "
          >

            <option value="">
              -- Select a bank --
            </option>

            {banks.map((bank) => (
              <option
                key={bank.id}
                value={bank.id}
              >
                {bank.bank_name} —{" "}
                {bank.account_name}
              </option>
            ))}

          </select>
        )}

      </div>

      {/* ---------------------------------------------------- */}
      {/* BANK DETAILS */}
      {/* ---------------------------------------------------- */}

      {bankId && (
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">

          <h3 className="text-xl font-black text-purple-800">
            Payment Account
          </h3>

          {(() => {
            const bank =
              banks.find(
                (item) =>
                  item.id === bankId
              );

            if (!bank) return null;

            return (
              <div className="mt-5 space-y-3">

                <p>
                  <span className="text-gray-500">
                    Bank:
                  </span>{" "}
                  <strong>
                    {bank.bank_name}
                  </strong>
                </p>

                <p>
                  <span className="text-gray-500">
                    Account Name:
                  </span>{" "}
                  <strong>
                    {bank.account_name}
                  </strong>
                </p>

                {bank.bsb && (
                  <p>
                    <span className="text-gray-500">
                      BSB:
                    </span>{" "}
                    <strong>
                      {bank.bsb}
                    </strong>
                  </p>
                )}

                {bank.account_number && (
                  <p>
                    <span className="text-gray-500">
                      Account Number:
                    </span>{" "}
                    <strong>
                      {bank.account_number}
                    </strong>
                  </p>
                )}

                {bank.payid && (
                  <p>
                    <span className="text-gray-500">
                      PayID:
                    </span>{" "}
                    <strong>
                      {bank.payid}
                    </strong>
                  </p>
                )}

                <div className="mt-5 bg-white rounded-xl p-4 border">

                  <p className="text-sm text-gray-500">
                    Please pay exactly
                  </p>

                  <p className="text-3xl font-black text-purple-700">
                    ${total.toFixed(2)}
                  </p>

                </div>

              </div>
            );
          })()}

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SCREENSHOT */}
      {/* ---------------------------------------------------- */}

      <div>

        <label
          htmlFor="payment-screenshot"
          className="block text-lg font-black mb-3"
        >
          Upload Payment Screenshot
        </label>

        <input
          id="payment-screenshot"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          disabled={loading}
          onChange={(e) => {
            const file =
              e.target.files?.[0] || null;

            setScreenshot(file);
            setError("");
          }}
          className="
            w-full
            border
            border-gray-300
            rounded-xl
            px-4
            py-4
            bg-white
          "
        />

        <p className="text-sm text-gray-500 mt-2">
          PNG, JPG or WEBP. Maximum 10 MB.
        </p>

        {screenshot && (
          <p className="mt-3 text-sm font-semibold text-green-700">
            Selected: {screenshot.name}
          </p>
        )}

      </div>

      {/* ---------------------------------------------------- */}
      {/* ERROR */}
      {/* ---------------------------------------------------- */}

      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 rounded-2xl p-5">
          {error}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SUCCESS */}
      {/* ---------------------------------------------------- */}

      {message && (
        <div className="bg-green-100 border border-green-200 text-green-700 rounded-2xl p-5">
          <p className="font-black">
            Payment Submitted
          </p>

          <p className="mt-1">
            {message}
          </p>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SUBMIT */}
      {/* ---------------------------------------------------- */}

      <button
        type="submit"
        disabled={
          loading ||
          banks.length === 0
        }
        className="
          w-full
          bg-purple-700
          hover:bg-purple-800
          disabled:bg-gray-400
          text-white
          py-5
          rounded-2xl
          font-black
          text-xl
          transition
        "
      >
        {loading
          ? "Submitting Payment..."
          : `Submit Payment — $${total.toFixed(2)}`}
      </button>

      <p className="text-center text-sm text-gray-500">
        Your payment will remain pending until an
        administrator verifies the payment screenshot.
      </p>

    </form>
  );
}