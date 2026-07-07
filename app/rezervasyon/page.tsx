"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Slot = "sabah" | "aksam";
type SlotState = "musait" | "beklemede" | "dolu";
type SlotStatus = { sabah: SlotState; aksam: SlotState } | null;

const SLOT_LABELS: Record<Slot, { label: string; time: string; desc: string }> = {
  sabah: { label: "Sabah", time: "10:00 – 16:00", desc: "Kahvaltı ve öğle saatleri" },
  aksam: { label: "Akşam", time: "17:00 – 23:00", desc: "Akşam etkinlikleri" },
};

function formatDateTR(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });
}

function getMonthLabel(monthOffset: number) {
  const today = new Date();
  const d = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  return d.toLocaleDateString("tr-TR", { month: "long" });
}

function getMonthDays(monthOffset: number) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + monthOffset;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = monthOffset === 0 ? today.getDate() + 1 : 1;
  const days: string[] = [];
  for (let day = startDay; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day).toISOString().split("T")[0]);
  }
  return days;
}

function pricePerGuest(guestCount: number) {
  return guestCount <= 15 ? 700 : 600;
}

export default function ReservasyonPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMonth, setSelectedMonth] = useState<0 | 1>(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slotStatus, setSlotStatus] = useState<SlotStatus>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", guestCount: "10", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [monthSlotStatus, setMonthSlotStatus] = useState<Record<string, SlotStatus>>({});

  const days = getMonthDays(selectedMonth);

  useEffect(() => {
    if (days.length === 0) return;
    fetch(`/api/slots/range?start=${days[0]}&end=${days[days.length - 1]}`)
      .then((r) => r.json())
      .then((data) => setMonthSlotStatus(data))
      .catch(() => setMonthSlotStatus({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    setSelectedSlot(null);
    fetch(`/api/slots?date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => setSlotStatus(data))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, slot: selectedSlot, ...form }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Bir hata oluştu");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Bağlantı hatası");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: "#F5EDD8" }}>
        <div className="text-5xl mb-4">✓</div>
        <h2 className="text-3xl font-medium mb-3" style={{ fontFamily: "var(--font-playfair)", color: "#C8622A" }}>
          Rezervasyonunuz Alındı
        </h2>
        <p className="opacity-60 mb-2" style={{ fontFamily: "var(--font-inter)" }}>
          {formatDateTR(selectedDate)} · {selectedSlot && SLOT_LABELS[selectedSlot].label} ({selectedSlot && SLOT_LABELS[selectedSlot].time})
        </p>
        <p className="opacity-50 text-sm mb-8" style={{ fontFamily: "var(--font-inter)" }}>
          Size rezervasyon onayı için maille en kısa sürede ulaşacağız. Lütfen mail kutunuzu kontrol etmeyi unutmayın; aksi halde rezervasyonunuz geçerli olmayacaktır.
        </p>
        <Link href="/"
          className="px-6 py-3 rounded-full text-white"
          style={{ backgroundColor: "#C8622A", fontFamily: "var(--font-inter)" }}>
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5EDD8" }}>
      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between border-b" style={{ borderColor: "#C8622A22" }}>
        <Link href="/" className="text-xl font-medium" style={{ fontFamily: "var(--font-playfair)", color: "#C8622A" }}>
          ka-fi
        </Link>
        <span className="text-sm opacity-40" style={{ fontFamily: "var(--font-inter)" }}>
          Rezervasyon
        </span>
      </div>

      <div className="max-w-lg mx-auto px-6 py-10">
        {/* Steps */}
        <div className="flex items-center gap-3 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all"
                style={{
                  backgroundColor: step >= s ? "#C8622A" : "#EDE0C4",
                  color: step >= s ? "white" : "#1a1a1a",
                  fontFamily: "var(--font-inter)"
                }}>
                {s}
              </div>
              {s < 3 && <div className="h-px w-8" style={{ backgroundColor: step > s ? "#C8622A" : "#EDE0C4" }} />}
            </div>
          ))}
          <span className="ml-2 text-sm opacity-40" style={{ fontFamily: "var(--font-inter)" }}>
            {step === 1 ? "Tarih Seç" : step === 2 ? "Slot Seç" : "Bilgilerini Gir"}
          </span>
        </div>

        {/* Step 1: Date */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-medium mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              Hangi gün?
            </h2>
            <div className="flex gap-2 mb-6">
              {([0, 1] as const).map((offset) => (
                <button key={offset}
                  onClick={() => setSelectedMonth(offset)}
                  className="px-5 py-2 rounded-full text-sm font-medium capitalize transition-all"
                  style={{
                    backgroundColor: selectedMonth === offset ? "#C8622A" : "#EDE0C4",
                    color: selectedMonth === offset ? "white" : "#1a1a1a",
                    fontFamily: "var(--font-inter)",
                  }}>
                  {getMonthLabel(offset)}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {days.map((day) => {
                const dayStatus = monthSlotStatus[day];
                const sabahDolu = dayStatus?.sabah === "dolu";
                const aksamDolu = dayStatus?.aksam === "dolu";
                const bothFull = sabahDolu && aksamDolu;
                const oneFull = (sabahDolu || aksamDolu) && !bothFull;
                const isSelected = selectedDate === day;
                return (
                  <button key={day}
                    onClick={() => { setSelectedDate(day); setStep(2); }}
                    className="relative overflow-hidden p-4 rounded-xl text-left transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor: isSelected ? "#C8622A" : "#EDE0C4",
                      color: isSelected ? "white" : "#1a1a1a",
                    }}>
                    {!isSelected && (bothFull || oneFull) && (
                      <div className="absolute inset-0 pointer-events-none" style={{
                        background: bothFull
                          ? "rgba(200,98,42,0.55)"
                          : "linear-gradient(135deg, rgba(200,98,42,0.55) 0%, rgba(200,98,42,0.55) 50%, transparent 50%, transparent 100%)",
                      }} />
                    )}
                    <div className="relative">
                      <div className="text-xs opacity-60 mb-1" style={{ fontFamily: "var(--font-inter)" }}>
                        {new Date(day + "T00:00:00").toLocaleDateString("tr-TR", { weekday: "long" })}
                      </div>
                      <div className="font-medium" style={{ fontFamily: "var(--font-inter)" }}>
                        {new Date(day + "T00:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}
                      </div>
                      {!isSelected && (bothFull || oneFull) && (
                        <div className="text-[10px] font-medium mt-1" style={{ color: "#C8622A" }}>
                          {bothFull ? "Tüm slotlar dolu" : `${sabahDolu ? "Sabah" : "Akşam"} slotu dolu`}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Slot */}
        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm opacity-40 mb-6 hover:opacity-70"
              style={{ fontFamily: "var(--font-inter)" }}>
              ← Geri
            </button>
            <h2 className="text-2xl font-medium mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
              Hangi slot?
            </h2>
            <p className="text-sm opacity-50 mb-6" style={{ fontFamily: "var(--font-inter)" }}>
              {formatDateTR(selectedDate)}
            </p>

            {loadingSlots ? (
              <div className="text-center py-10 opacity-40" style={{ fontFamily: "var(--font-inter)" }}>Yükleniyor...</div>
            ) : (
              <div className="flex flex-col gap-3">
                {(["sabah", "aksam"] as Slot[]).map((slot) => {
                  const state: SlotState = slotStatus?.[slot] ?? "musait";
                  const isAvailable = state === "musait";
                  const isPending = state === "beklemede";
                  return (
                    <button key={slot}
                      disabled={!isAvailable}
                      onClick={() => { setSelectedSlot(slot); setStep(3); }}
                      className="p-5 rounded-2xl text-left transition-all"
                      style={{
                        backgroundColor: "#EDE0C4",
                        opacity: !isAvailable ? 0.55 : 1,
                        cursor: !isAvailable ? "not-allowed" : "pointer",
                        border: selectedSlot === slot ? "2px solid #C8622A" : "2px solid transparent",
                      }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-lg mb-1" style={{ fontFamily: "var(--font-inter)" }}>
                            {SLOT_LABELS[slot].label}
                          </div>
                          <div className="text-sm opacity-60" style={{ fontFamily: "var(--font-inter)" }}>
                            {SLOT_LABELS[slot].time}
                          </div>
                          {isPending ? (
                            <div className="flex items-center gap-1.5 mt-2">
                              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#E07840" }} />
                              <span className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#E07840" }}>
                                Bekleyen talep var —{" "}
                                <span style={{ textDecoration: "underline" }}>kaficoffeehouse@gmail.com</span>
                              </span>
                            </div>
                          ) : (
                            <div className="text-xs opacity-40 mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                              {SLOT_LABELS[slot].desc}
                            </div>
                          )}
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full mt-1"
                          style={{
                            backgroundColor: isAvailable ? "#C8622A22" : isPending ? "#E0784022" : "#1a1a1a22",
                            color: isAvailable ? "#C8622A" : isPending ? "#E07840" : "#1a1a1a",
                            fontFamily: "var(--font-inter)"
                          }}>
                          {isAvailable ? "Müsait" : isPending ? "Beklemede" : "Dolu"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Form */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <button type="button" onClick={() => setStep(2)}
              className="flex items-center gap-2 text-sm opacity-40 mb-6 hover:opacity-70"
              style={{ fontFamily: "var(--font-inter)" }}>
              ← Geri
            </button>
            <h2 className="text-2xl font-medium mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
              Bilgileriniz
            </h2>
            <p className="text-sm opacity-50 mb-6" style={{ fontFamily: "var(--font-inter)" }}>
              {formatDateTR(selectedDate)} · {selectedSlot && SLOT_LABELS[selectedSlot].label}
            </p>

            <div className="flex flex-col gap-4">
              <Field label="Ad Soyad / Organizasyon *" value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Adınız veya organizasyon adı" required />
              <Field label="Cep Telefonu *" value={form.phone} type="tel"
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="05xx xxx xx xx" required />
              <Field label="E-posta *" value={form.email} type="email"
                onChange={(v) => setForm((f) => ({ ...f, email: v }))} placeholder="ornek@mail.com" required />
              <div>
                <label className="block text-sm mb-2 opacity-60" style={{ fontFamily: "var(--font-inter)" }}>
                  Kişi Sayısı
                </label>
                <select value={form.guestCount}
                  onChange={(e) => setForm((f) => ({ ...f, guestCount: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{ backgroundColor: "#EDE0C4", fontFamily: "var(--font-inter)", border: "none" }}>
                  {Array.from({ length: 16 }, (_, i) => i + 10).map((n) => (
                    <option key={n} value={n}>{n} kişi</option>
                  ))}
                </select>
                <div className="mt-2 text-sm opacity-60" style={{ fontFamily: "var(--font-inter)" }}>
                  Kişi başı {pricePerGuest(Number(form.guestCount))}₺ · Toplam{" "}
                  <span className="font-medium" style={{ color: "#C8622A" }}>
                    {pricePerGuest(Number(form.guestCount)) * Number(form.guestCount)}₺
                  </span>
                  <div className="text-xs opacity-50 mt-0.5">
                    10-15 kişi: 700₺/kişi · 16-25 kişi: 600₺/kişi
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2 opacity-60" style={{ fontFamily: "var(--font-inter)" }}>
                  Notunuz (opsiyonel)
                </label>
                <textarea value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  rows={3}
                  placeholder="Özel istek, etkinlik türü..."
                  className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                  style={{ backgroundColor: "#EDE0C4", fontFamily: "var(--font-inter)", border: "none" }} />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl text-sm text-red-700 bg-red-50">
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting || !form.name || !form.phone || !form.email}
              className="w-full mt-6 py-4 rounded-full text-white font-medium transition-all hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: "#C8622A", fontFamily: "var(--font-inter)" }}>
              {submitting ? "Gönderiliyor..." : "Rezervasyon Yap"}
            </button>
          </form>
        )}

        <div className="mt-10 p-4 rounded-xl text-sm opacity-60 flex flex-col gap-3"
          style={{ backgroundColor: "#EDE0C4", fontFamily: "var(--font-inter)" }}>
          <p>
            Seçtiğiniz slotta bekleyen talep görünüyorsa daha sonra tekrar deneyebilir ya da bize ulaşıp bilgi alabilirsiniz.
          </p>
          <p>
            Rezervasyonla ilgili sorularınız için bize ulaşabilirsiniz.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1" style={{ borderTop: "1px solid #C8622A22" }}>
            <span className="text-xs uppercase tracking-widest opacity-60">İletişim:</span>
            <a href="mailto:kaficoffeehouse@gmail.com"
              className="inline-flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity"
              style={{ color: "#C8622A" }}>
              kaficoffeehouse@gmail.com
            </a>
            <a href="https://instagram.com/kaficoffeehouse" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity"
              style={{ color: "#C8622A" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8622A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="#C8622A"/>
              </svg>
              kaficoffeehouse
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", required }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm mb-2 opacity-60" style={{ fontFamily: "var(--font-inter)" }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full px-4 py-3 rounded-xl outline-none"
        style={{ backgroundColor: "#EDE0C4", fontFamily: "var(--font-inter)", border: "none" }} />
    </div>
  );
}
