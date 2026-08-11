import { supabase } from "@/lib/supabase";
import VerifyPaymentButton from "@/components/admin/VerifyPaymentButton";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const {
    data: payments,
    error,
  } = await supabase
    .from("payment_verifications")
    .select("*")
    .eq("status", "pending")
    .order("created_at", {
      ascending: false,
    });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-black mb-10">
          💰 Pending Payments
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-5 rounded-xl mb-8">
            {error.message}
          </div>
        )}

        {!payments || payments.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 shadow-xl text-center">
            <h2 className="text-3xl font-black">
              No Pending Payments
            </h2>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">

            {payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white rounded-3xl shadow-xl p-8"
              >

                <h2 className="text-2xl font-black">
                  Payment Verification
                </h2>

                <div className="mt-5 space-y-3">

                  <p>
                    Payment ID:
                    <b> {payment.id}</b>
                  </p>

                  <p>
                    Amount:
                    <b>
                      {" "}
                      $
                      {Number(
                        payment.total_amount
                      ).toFixed(2)}
                    </b>
                  </p>

                  <p>
                    Tickets:
                    <b>
                      {" "}
                      {payment.quantity}
                    </b>
                  </p>

                  <p>
                    User:
                    <b>
                      {" "}
                      {payment.user_id}
                    </b>
                  </p>

                  <p>
                    Event:
                    <b>
                      {" "}
                      {payment.event_id}
                    </b>
                  </p>

                  <p>
                    Bank:
                    <b>
                      {" "}
                      {payment.bank_id}
                    </b>
                  </p>

                </div>

                {payment.screenshot_path && (
                  <div className="mt-6">

                    <p className="font-bold mb-3">
                      Payment Screenshot
                    </p>

                    <p className="bg-gray-100 rounded-xl p-4 break-all text-sm">
                      {payment.screenshot_path}
                    </p>

                  </div>
                )}

                <VerifyPaymentButton
                  payment={payment}
                />

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}