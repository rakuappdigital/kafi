import { NextRequest, NextResponse } from "next/server";
import {
  readReservations,
  createReservation,
  isSlotAvailable,
  Slot,
} from "@/lib/reservations";

export async function GET(req: NextRequest) {
  const adminKey = req.nextUrl.searchParams.get("key");
  if (adminKey !== (process.env.ADMIN_KEY ?? "kafi2024")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const reservations = readReservations();
  return NextResponse.json(reservations.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { date, slot, name, phone, email, guestCount, note } = body;

  if (!date || !slot || !name || !phone) {
    return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
  }

  if (!isSlotAvailable(date, slot as Slot)) {
    return NextResponse.json({ error: "Bu slot dolu" }, { status: 409 });
  }

  const reservation = createReservation({
    date,
    slot: slot as Slot,
    name,
    phone,
    email: email || "",
    guestCount: Number(guestCount) || 1,
    note: note || "",
  });

  return NextResponse.json(reservation, { status: 201 });
}
