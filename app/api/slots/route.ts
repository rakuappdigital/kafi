import { NextRequest, NextResponse } from "next/server";
import { isSlotAvailable } from "@/lib/reservations";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });

  return NextResponse.json({
    sabah: isSlotAvailable(date, "sabah"),
    aksam: isSlotAvailable(date, "aksam"),
  });
}
