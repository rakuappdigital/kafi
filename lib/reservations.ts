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

export type SlotState = "musait" | "beklemede" | "dolu";

export async function getSlotState(date: string, slot: Slot): Promise<SlotState> {
  const sql = getDb();
  const rows = await sql`
    SELECT status FROM reservations
    WHERE date = ${date} AND slot = ${slot} AND status != 'iptal'
    LIMIT 1
  `;
  if (rows.length === 0) return "musait";
  return rows[0].status === "onaylandi" ? "dolu" : "beklemede";
}

export async function isSlotAvailable(date: string, slot: Slot): Promise<boolean> {
  const state = await getSlotState(date, slot);
  return state === "musait";
}

export async function getSlotStatesInRange(
  startDate: string,
  endDate: string
): Promise<Record<string, { sabah: SlotState; aksam: SlotState }>> {
  const sql = getDb();
  const rows = await sql`
    SELECT date, slot, status FROM reservations
    WHERE date >= ${startDate} AND date <= ${endDate} AND status != 'iptal'
  `;
  const result: Record<string, { sabah: SlotState; aksam: SlotState }> = {};
  for (const row of rows as { date: string | Date; slot: Slot; status: Status }[]) {
    const dateKey = typeof row.date === "string" ? row.date.slice(0, 10) : row.date.toISOString().slice(0, 10);
    if (!result[dateKey]) result[dateKey] = { sabah: "musait", aksam: "musait" };
    result[dateKey][row.slot] = row.status === "onaylandi" ? "dolu" : "beklemede";
  }
  return result;
}

export class SlotConflictError extends Error {
  constructor() {
    super("Bu slot az önce başka biri tarafından rezerve edildi");
    this.name = "SlotConflictError";
  }
}

export async function createReservation(
  data: Omit<Reservation, "id" | "status" | "created_at">
): Promise<Reservation> {
  const sql = getDb();
  try {
    const rows = await sql`
      INSERT INTO reservations (date, slot, name, phone, email, guest_count, note, status)
      VALUES (${data.date}, ${data.slot}, ${data.name}, ${data.phone}, ${data.email}, ${data.guest_count}, ${data.note}, 'beklemede')
      RETURNING *
    `;
    return rows[0] as Reservation;
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "23505") {
      throw new SlotConflictError();
    }
    throw err;
  }
}

export async function deleteReservation(id: string): Promise<void> {
  const sql = getDb();
  await sql`DELETE FROM reservations WHERE id = ${id}`;
}

export async function updateReservationStatus(id: string, status: Status): Promise<Reservation> {
  const sql = getDb();
  const rows = await sql`
    UPDATE reservations SET status = ${status} WHERE id = ${id} RETURNING *
  `;
  return rows[0] as Reservation;
}
