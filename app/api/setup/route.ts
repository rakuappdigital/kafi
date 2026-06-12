import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== (process.env.ADMIN_KEY ?? "kafi2024")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS reservations (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      date TEXT NOT NULL,
      slot TEXT NOT NULL CHECK (slot IN ('sabah', 'aksam')),
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      guest_count INTEGER NOT NULL DEFAULT 10,
      note TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'beklemede' CHECK (status IN ('beklemede', 'onaylandi', 'iptal')),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  return NextResponse.json({ ok: true, message: "Tablo hazır" });
}
