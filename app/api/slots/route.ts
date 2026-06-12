import { NextRequest, NextResponse } from "next/server";
import { getSlotState } from "@/lib/reservations";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });

  try {
    const [sabah, aksam] = await Promise.all([
      getSlotState(date, "sabah"),
      getSlotState(date, "aksam"),
    ]);
    return NextResponse.json({ sabah, aksam });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
