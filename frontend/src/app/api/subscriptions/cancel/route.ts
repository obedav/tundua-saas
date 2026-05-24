import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clientEnv } from "@/lib/env";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(
      `${clientEnv.NEXT_PUBLIC_API_URL}/api/v1/subscriptions/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Subscription cancel error:", error);
    return NextResponse.json({ success: false, error: "Cancellation failed" }, { status: 500 });
  }
}
