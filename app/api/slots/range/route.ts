import { NextRequest, NextResponse } from "next/server";
import { getSlotStatesInRange } from "@/lib/reservations";

export async function GET(req: NextRequest) {
  const start = req.nextUrl.searchParams.get("start");
  const end = req.nextUrl.searchParams.get("end");
  if (!start || !end) return NextResponse.json({ error: "start ve end gerekli" }, { status: 400 });

  try {
    const data = await getSlotStatesInRange(start, end);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
