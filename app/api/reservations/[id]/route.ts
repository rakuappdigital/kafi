import { NextRequest, NextResponse } from "next/server";
import { updateReservationStatus, Status } from "@/lib/reservations";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status, key } = await req.json();

  if (key !== (process.env.ADMIN_KEY ?? "kafi2024")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reservation = await updateReservationStatus(id, status as Status);
    return NextResponse.json(reservation);
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
