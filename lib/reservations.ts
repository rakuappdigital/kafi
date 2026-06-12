import { getSupabase } from "./supabase";

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
  const { data, error } = await getSupabase()
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function isSlotAvailable(date: string, slot: Slot): Promise<boolean> {
  const { data, error } = await getSupabase()
    .from("reservations")
    .select("id")
    .eq("date", date)
    .eq("slot", slot)
    .neq("status", "iptal");
  if (error) throw error;
  return (data ?? []).length === 0;
}

export async function createReservation(
  data: Omit<Reservation, "id" | "status" | "created_at">
): Promise<Reservation> {
  const { data: created, error } = await getSupabase()
    .from("reservations")
    .insert([{ ...data, status: "beklemede" }])
    .select()
    .single();
  if (error) throw error;
  return created;
}

export async function updateReservationStatus(id: string, status: Status): Promise<Reservation> {
  const { data, error } = await getSupabase()
    .from("reservations")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
