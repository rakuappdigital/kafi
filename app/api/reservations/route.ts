import { NextRequest, NextResponse } from "next/server";
import { getReservations, createReservation, isSlotAvailable, Slot, SlotConflictError } from "@/lib/reservations";
import { sendReservationEmails } from "@/lib/email";

export async function GET(req: NextRequest) {
  const adminKey = req.nextUrl.searchParams.get("key");
  if (adminKey !== (process.env.ADMIN_KEY ?? "kafi2024")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const reservations = await getReservations();
    return NextResponse.json(reservations);
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { date, slot, name, phone, email, guestCount, note } = body;

  if (!date || !slot || !name || !phone || !email) {
    return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Geçerli bir e-posta adresi girin" }, { status: 400 });
  }

  try {
    const available = await isSlotAvailable(date, slot as Slot);
    if (!available) {
      return NextResponse.json({ error: "Bu slot dolu" }, { status: 409 });
    }

    const reservation = await createReservation({
      date,
      slot: slot as Slot,
      name,
      phone,
      email,
      guest_count: Number(guestCount) || 10,
      note: note || "",
    });

    sendReservationEmails(reservation).catch(() => {});

    return NextResponse.json(reservation, { status: 201 });
  } catch (err) {
    if (err instanceof SlotConflictError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
