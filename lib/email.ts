import { Resend } from "resend";
import { Reservation } from "./reservations";

const KAFI_EMAIL = "kaficoffeehouse@gmail.com";

const SLOT_LABELS = {
  sabah: "Sabah (10:00 – 16:00)",
  aksam: "Akşam (17:00 – 23:00)",
};

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("tr-TR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export async function sendReservationEmails(r: Reservation) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const resend = new Resend(key);

  const dateLabel = formatDate(r.date);
  const slotLabel = SLOT_LABELS[r.slot];

  // Sana bildirim (Resend free plan: sadece kayıtlı adrese gönderilebilir)
  await resend.emails.send({
    from: "Kafi Rezervasyon <onboarding@resend.dev>",
    to: "rakuappdigital@gmail.com",
    subject: `Yeni Rezervasyon — ${r.name} / ${dateLabel}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;padding:24px">
        <h2 style="color:#C8622A">Yeni Rezervasyon Talebi</h2>
        <table style="width:100%;border-collapse:collapse;font-size:15px">
          <tr><td style="padding:8px 0;color:#888">Ad / Organizasyon</td><td><strong>${r.name}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#888">Telefon</td><td><strong>${r.phone}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#888">E-posta</td><td><strong>${r.email}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#888">Tarih</td><td><strong>${dateLabel}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#888">Slot</td><td><strong>${slotLabel}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#888">Kişi Sayısı</td><td><strong>${r.guest_count}</strong></td></tr>
          ${r.note ? `<tr><td style="padding:8px 0;color:#888">Not</td><td>${r.note}</td></tr>` : ""}
        </table>
        <p style="margin-top:24px;font-size:13px;color:#aaa">
          Admin paneli: <a href="https://kafi-nu.vercel.app/admin">kafi-nu.vercel.app/admin</a>
        </p>
      </div>
    `,
  });

}
