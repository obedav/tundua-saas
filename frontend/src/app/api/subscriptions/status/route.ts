import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(
    `${process.env["NEXT_PUBLIC_API_URL"]}/api/v1/subscriptions/status`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
