import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, gross_amount, customer_details } = body;

    const secret = process.env.MIDTRANS_SERVER_KEY;
    if (!secret) {
      return NextResponse.json({ error: "MIDTRANS_SERVER_KEY is not set di .env.local" }, { status: 500 });
    }

    const encodedSecret = Buffer.from(secret + ":").toString("base64");

    const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${encodedSecret}`,
      },
      body: JSON.stringify({
        transaction_details: {
          order_id,
          gross_amount: Math.round(gross_amount),
        },
        customer_details,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error_messages ? data.error_messages.join(", ") : "Gagal membuat transaksi Midtrans");
    }

    return NextResponse.json({ token: data.token });
  } catch (error: any) {
    console.error("Midtrans Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
