import fs from "fs";
import path from "path";

export type Slot = "sabah" | "aksam";
export type Status = "beklemede" | "onaylandi" | "iptal";

export interface Reservation {
  id: string;
  date: string; // YYYY-MM-DD
  slot: Slot;
  name: string;
  phone: string;
  email: string;
  guestCount: number;
  note: string;
  status: Status;
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "reservations.json");

export function readReservations(): Reservation[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function writeReservations(reservations: Reservation[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(reservations, null, 2));
}

export function isSlotAvailable(date: string, slot: Slot): boolean {
  const reservations = readReservations();
  return !reservations.some(
    (r) => r.date === date && r.slot === slot && r.status !== "iptal"
  );
}

export function createReservation(data: Omit<Reservation, "id" | "status" | "createdAt">): Reservation {
  const reservations = readReservations();
  const reservation: Reservation = {
    ...data,
    id: Date.now().toString(),
    status: "beklemede",
    createdAt: new Date().toISOString(),
  };
  reservations.push(reservation);
  writeReservations(reservations);
  return reservation;
}
