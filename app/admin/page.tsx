"use client";
import { useState, useEffect, useCallback } from "react";

type Status = "beklemede" | "onaylandi" | "iptal";
interface Reservation {
  id: string; date: string; slot: "sabah" | "aksam";
  name: string; phone: string; email: string;
  guestCount: number; note: string; status: Status; createdAt: string;
}

const STATUS_LABELS: Record<Status, { label: string; color: string }> = {
  beklemede: { label: "Beklemede", color: "#E07840" },
  onaylandi: { label: "Onaylandı", color: "#2d8a4e" },
  iptal: { label: "İptal", color: "#9a2a2a" },
};

const ADMIN_KEY = "dogus@kafi@83";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [tried, setTried] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Status | "hepsi">("hepsi");
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/reservations?key=${ADMIN_KEY}`);
    if (res.ok) setReservations(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchReservations();
  }, [authed, fetchReservations]);

  async function updateStatus(id: string, status: Status) {
    await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, key: ADMIN_KEY }),
    });
    fetchReservations();
  }

  async function deleteReservation(id: string) {
    await fetch(`/api/reservations/${id}?key=${ADMIN_KEY}`, { method: "DELETE" });
    fetchReservations();
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5EDD8" }}>
        <div className="p-8 rounded-2xl w-full max-w-sm" style={{ backgroundColor: "#EDE0C4" }}>
          <h1 className="text-2xl font-medium mb-6" style={{ fontFamily: "var(--font-playfair)", color: "#C8622A" }}>
            ka-fi Admin
          </h1>
          <input type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { setTried(true); if (password === ADMIN_KEY) setAuthed(true); } }}
            placeholder="Şifre"
            className="w-full px-4 py-3 rounded-xl mb-4 outline-none"
            style={{ backgroundColor: "#F5EDD8", fontFamily: "var(--font-inter)" }} />
          <button onClick={() => { setTried(true); if (password === ADMIN_KEY) setAuthed(true); }}
            className="w-full py-3 rounded-full text-white"
            style={{ backgroundColor: "#C8622A", fontFamily: "var(--font-inter)" }}>
            Giriş
          </button>
          {tried && password !== ADMIN_KEY && (
            <p className="text-sm text-center mt-3 opacity-50" style={{ fontFamily: "var(--font-inter)" }}>
              Yanlış şifre
            </p>
          )}
        </div>
      </div>
    );
  }

  const filtered = filter === "hepsi"
    ? reservations.filter((r) => r.status !== "iptal")
    : reservations.filter((r) => r.status === filter);
  const counts = {
    beklemede: reservations.filter((r) => r.status === "beklemede").length,
    onaylandi: reservations.filter((r) => r.status === "onaylandi").length,
    iptal: reservations.filter((r) => r.status === "iptal").length,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5EDD8" }}>
      <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "#C8622A22" }}>
        <h1 className="text-xl font-medium" style={{ fontFamily: "var(--font-playfair)", color: "#C8622A" }}>
          ka-fi · Admin
        </h1>
        <button onClick={fetchReservations}
          className="text-sm px-4 py-2 rounded-full"
          style={{ backgroundColor: "#EDE0C4", fontFamily: "var(--font-inter)" }}>
          Yenile
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {(["beklemede", "onaylandi", "iptal"] as Status[]).map((s) => (
            <div key={s} className="p-4 rounded-2xl text-center" style={{ backgroundColor: "#EDE0C4" }}>
              <div className="text-3xl font-medium mb-1" style={{ color: STATUS_LABELS[s].color, fontFamily: "var(--font-inter)" }}>
                {counts[s]}
              </div>
              <div className="text-xs opacity-50" style={{ fontFamily: "var(--font-inter)" }}>
                {STATUS_LABELS[s].label}
              </div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["hepsi", "beklemede", "onaylandi", "iptal"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-full text-sm transition-all"
              style={{
                backgroundColor: filter === f ? "#C8622A" : "#EDE0C4",
                color: filter === f ? "white" : "#1a1a1a",
                fontFamily: "var(--font-inter)",
              }}>
              {f === "hepsi" ? "Hepsi" : STATUS_LABELS[f as Status].label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-16 opacity-40" style={{ fontFamily: "var(--font-inter)" }}>Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 opacity-40" style={{ fontFamily: "var(--font-inter)" }}>Rezervasyon bulunamadı</div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((r) => (
              <div key={r.id} className="p-5 rounded-2xl" style={{ backgroundColor: "#EDE0C4" }}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium" style={{ fontFamily: "var(--font-inter)" }}>{r.name}</div>
                    <div className="text-sm opacity-50 mt-0.5" style={{ fontFamily: "var(--font-inter)" }}>
                      {new Date(r.date + "T00:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                      {" · "}
                      {r.slot === "sabah" ? "Sabah (10:00–14:00)" : "Akşam (17:00–22:00)"}
                      {" · "}
                      {r.guestCount} kişi
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: STATUS_LABELS[r.status].color + "22",
                      color: STATUS_LABELS[r.status].color,
                      fontFamily: "var(--font-inter)"
                    }}>
                    {STATUS_LABELS[r.status].label}
                  </span>
                </div>

                <div className="text-sm opacity-60 mb-3 flex flex-col gap-1" style={{ fontFamily: "var(--font-inter)" }}>
                  <span>📞 {r.phone}</span>
                  {r.email && <span>✉️ {r.email}</span>}
                  {r.note && <span>📝 {r.note}</span>}
                </div>

                <div className="flex gap-2">
                  {r.status !== "onaylandi" && (
                    <button onClick={() => updateStatus(r.id, "onaylandi")}
                      className="text-xs px-3 py-1.5 rounded-full text-white"
                      style={{ backgroundColor: "#2d8a4e", fontFamily: "var(--font-inter)" }}>
                      Onayla
                    </button>
                  )}
                  {r.status !== "beklemede" && (
                    <button onClick={() => updateStatus(r.id, "beklemede")}
                      className="text-xs px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: "#E07840", color: "white", fontFamily: "var(--font-inter)" }}>
                      Beklemeye Al
                    </button>
                  )}
                  {r.status !== "iptal" && confirmCancel !== r.id && (
                    <button onClick={() => setConfirmCancel(r.id)}
                      className="text-xs px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: "#9a2a2a22", color: "#9a2a2a", fontFamily: "var(--font-inter)" }}>
                      İptal Et
                    </button>
                  )}
                  {confirmCancel === r.id && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => { updateStatus(r.id, "iptal"); setConfirmCancel(null); }}
                        className="text-xs px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: "#9a2a2a", color: "white", fontFamily: "var(--font-inter)" }}>
                        Kesin İptal Et
                      </button>
                      <button onClick={() => setConfirmCancel(null)}
                        className="text-xs px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: "#EDE0C4", color: "#1a1a1a", fontFamily: "var(--font-inter)" }}>
                        Vazgeç
                      </button>
                    </div>
                  )}
                  {r.status === "iptal" && (
                    <button onClick={() => deleteReservation(r.id)}
                      className="text-xs px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: "#1a1a1a22", color: "#1a1a1a", fontFamily: "var(--font-inter)" }}>
                      Sil
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
