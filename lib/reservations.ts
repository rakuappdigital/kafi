import { getDb } from "./db";

export type Slot = "sabah" | "aksam";
export type Status = "beklemede" | "onaylandi" | "iptal";

export interface Reservation {
  id: string;
  date: string;
  slot: Slot;
  name: string;
  phone: string;
  email: string;
  guest_count: number;
  note: string;
  status: Status;
  created_at: string;
}

export async function getReservations(): Promise<Reservation[]> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM reservations ORDER BY created_at DESC`;
  return rows as Reservation[];
}

export async function isSlotAvailable(date: string, slot: Slot): Promise<boolean> {
  const sql = getDb();
  const rows = await sql`
    SELECT id FROM reservations
    WHERE date = ${date} AND slot = ${slot} AND status != 'iptal'
  `;
  return rows.length === 0;
}

export async function createReservation(
  data: Omit<Reservation, "id" | "status" | "created_at">
): Promise<Reservation> {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO reservations (date, slot, name, phone, email, guest_count, note, status)
    VALUES (${data.date}, ${data.slot}, ${data.name}, ${data.phone}, ${data.email}, ${data.guest_count}, ${data.note}, 'beklemede')
    RETURNING *
  `;
  return rows[0] as Reservation;
}

export async function updateReservationStatus(id: string, status: Status): Promise<Reservation> {
  const sql = getDb();
  const rows = await sql`
    UPDATE reservations SET status = ${status} WHERE id = ${id} RETURNING *
  `;
  return rows[0] as Reservation;
}
