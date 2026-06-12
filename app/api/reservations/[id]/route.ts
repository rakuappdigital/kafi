import { NextRequest, NextResponse } from "next/server";
import { readReservations, writeReservations, Status } from "@/lib/reservations";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status, key } = await req.json();

  if (key !== (process.env.ADMIN_KEY ?? "kafi2024")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reservations = readReservations();
  const idx = reservations.findIndex((r) => r.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  reservations[idx].status = status as Status;
  writeReservations(reservations);

  return NextResponse.json(reservations[idx]);
}
