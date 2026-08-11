"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { supabase } from "@/lib/supabase";

export default function VerifyPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const [message, setMessage] = useState("");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  async function verifyTicket(ticketCode: string) {
    stopScanner();

    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("ticket_code", ticketCode)
      .single();

    if (!order) {
      setMessage("❌ Invalid Ticket");
      return;
    }

    if (order.verified) {
      setMessage("⚠️ Ticket Already Used");
      return;
    }

    await supabase
      .from("orders")
      .update({
        verified: true,
      })
      .eq("id", order.id);

    setMessage("✅ Ticket Verified Successfully");
  }

  async function startScanner() {
    if (scannerRef.current) return;

    const scanner = new Html5Qrcode("reader");

    scannerRef.current = scanner;

    setScanning(true);

    await scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,
        },
      },
      (decodedText) => {
        verifyTicket(decodedText);
      },
      () => {}
    );
  }

  async function stopScanner() {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {}

      scannerRef.current = null;
      setScanning(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-center p-10">

      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-2xl">

        <h1 className="text-4xl font-black mb-8 text-center">
          QR Ticket Verification
        </h1>

        <div
          id="reader"
          className="rounded-2xl overflow-hidden"
        />

        <div className="mt-8 text-center text-2xl font-bold">
          {message}
        </div>

        {!scanning && (
          <button
            onClick={startScanner}
            className="mt-8 w-full bg-purple-700 text-white py-4 rounded-xl font-bold"
          >
            Scan Another Ticket
          </button>
        )}

      </div>

    </main>
  );
}