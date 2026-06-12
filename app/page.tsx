"use client";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F5EDD8", color: "#1a1a1a" }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ backgroundColor: "rgba(245,237,216,0.92)", backdropFilter: "blur(8px)" }}>
        <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-playfair)", color: "#C8622A" }}>
          ka-fi
        </span>
        <div className="flex items-center gap-6 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
          <a href="#hakkimizda" className="opacity-60 hover:opacity-100 transition-opacity">Hakkımızda</a>
          <a href="#galeri" className="opacity-60 hover:opacity-100 transition-opacity">Galeri</a>
          <Link href="/rezervasyon"
            className="px-4 py-2 rounded-full text-white text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "#C8622A" }}>
            Rezervasyon
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #F5EDD8 60%, #EDE0C4 100%)" }}>
        {/* Arka plan görseli */}
        <div className="absolute inset-0 opacity-10">
          <Image src="/balkabagi.jpeg" alt="" fill className="object-cover" priority />
        </div>
        <div className="relative z-10 flex flex-col items-center">
        <p className="text-sm uppercase tracking-widest mb-4 opacity-50" style={{ fontFamily: "var(--font-inter)" }}>
          coffee house
        </p>
        <h1 className="text-8xl md:text-9xl font-medium mb-6"
          style={{ fontFamily: "var(--font-playfair)", color: "#C8622A", letterSpacing: "-2px" }}>
          ka-fi
        </h1>
        <p className="text-lg md:text-xl opacity-60 max-w-md mb-10 leading-relaxed" style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}>
          Sıcak bir köşe, özel anlar için.<br />Etkinliklerinizi bizimle planlayın.
        </p>
        <Link href="/rezervasyon"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white text-base transition-all hover:scale-105 hover:shadow-lg"
          style={{ backgroundColor: "#C8622A", fontFamily: "var(--font-inter)" }}>
          Rezervasyon Yap
          <span>→</span>
        </Link>

        </div>
        {/* Scroll hint */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-30">
          <span className="text-xs" style={{ fontFamily: "var(--font-inter)" }}>aşağı kaydır</span>
          <div className="w-px h-8" style={{ backgroundColor: "#C8622A" }}></div>
        </div>
      </section>

      {/* Hakkımızda */}
      <section id="hakkimizda" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest mb-4 opacity-40" style={{ fontFamily: "var(--font-inter)" }}>
              hakkımızda
            </p>
            <h2 className="text-4xl font-medium mb-6 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              Her yudum bir hikaye
            </h2>
            <p className="opacity-60 leading-relaxed mb-4" style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}>
              ka-fi, kahvenin bir ritüel olduğuna inanan insanlar için tasarlanmış butik bir coffee house.
              Şehrin koşturmacasından uzak, kendinize ait bir köşe.
            </p>
            <p className="opacity-60 leading-relaxed" style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}>
              Özel etkinlikleriniz, küçük toplantılarınız veya sadece birlikte vakit geçirmek istediğiniz
              anlar için sabah ve akşam slotlarımızı rezerve edebilirsiniz.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FeatureCard icon="☕" title="Specialty Coffee" desc="Single origin ve özenle hazırlanmış içecekler" />
            <FeatureCard icon="🌿" title="Sıcak Atmosfer" desc="Turuncu duvarlar, yeşil bitkiler, doğal ışık" />
            <FeatureCard icon="🥪" title="Ev Yapımı Lezzetler" desc="Taze sandviçler ve günlük tatlılar" />
            <FeatureCard icon="📅" title="Özel Etkinlik" desc="Günde 2 slot, tamamen size özel" />
          </div>
        </div>
      </section>

      {/* Galeri */}
      <section id="galeri" className="py-16 px-6" style={{ backgroundColor: "#EDE0C4" }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-2 opacity-40 text-center" style={{ fontFamily: "var(--font-inter)" }}>
            galeri
          </p>
          <h2 className="text-3xl font-medium mb-10 text-center" style={{ fontFamily: "var(--font-playfair)" }}>
            ka-fi'den kareler
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { src: "/sandvic-cay.jpeg", alt: "Sandviç & Çay" },
              { src: "/berry.jpeg", alt: "Berry Limonata" },
              { src: "/sandvic-ic.jpeg", alt: "İç Mekan" },
              { src: "/acik-hava.jpeg", alt: "Açık Hava" },
              { src: "/kurabiye.jpeg", alt: "Kurabiye" },
              { src: "/matcha.jpeg", alt: "Matcha Latte" },
              { src: "/latte.jpeg", alt: "Latte" },
              { src: "/balkabagi.jpeg", alt: "Özel Fincan" },
              { src: "/kafi-kupa.jpeg", alt: "ka-fi" },
            ].map((item) => (
              <div key={item.src} className="aspect-square rounded-2xl overflow-hidden relative">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-sm opacity-40" style={{ fontFamily: "var(--font-inter)" }}>
            @kaficoffeehouse
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-4xl font-medium mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
          Yerinizi ayırtın
        </h2>
        <p className="opacity-50 mb-8 text-lg" style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}>
          Sabah veya akşam slotu — sadece birkaç adım.
        </p>
        <Link href="/rezervasyon"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-white text-base transition-all hover:scale-105"
          style={{ backgroundColor: "#C8622A", fontFamily: "var(--font-inter)" }}>
          Hemen Rezervasyon Yap →
        </Link>
      </section>

      {/* İletişim & Konum */}
      <section id="iletisim" className="py-20 px-6" style={{ backgroundColor: "#1a1a1a", color: "#F5EDD8" }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <p className="text-xs uppercase tracking-widest mb-4 opacity-40" style={{ fontFamily: "var(--font-inter)" }}>
              konum
            </p>
            <p className="opacity-70 leading-relaxed text-sm" style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}>
              {/* Adresini buraya yaz */}
              İstanbul
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest mb-4 opacity-40" style={{ fontFamily: "var(--font-inter)" }}>
              saatler
            </p>
            <div className="text-sm opacity-70 leading-relaxed" style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}>
              <p>Sabah Slotu: 10:00 – 14:00</p>
              <p>Akşam Slotu: 17:00 – 22:00</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest mb-4 opacity-40" style={{ fontFamily: "var(--font-inter)" }}>
              sosyal medya
            </p>
            <a href="https://instagram.com/kaficoffeehouse" target="_blank" rel="noopener noreferrer"
              className="text-sm opacity-70 hover:opacity-100 transition-opacity"
              style={{ fontFamily: "var(--font-inter)", color: "#C8622A" }}>
              @kaficoffeehouse
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 border-t text-center opacity-30 text-xs"
        style={{ borderColor: "#C8622A33", fontFamily: "var(--font-inter)", backgroundColor: "#1a1a1a", color: "#F5EDD8" }}>
        © 2024 ka-fi coffee house
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="p-5 rounded-2xl" style={{ backgroundColor: "#EDE0C4" }}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-medium text-sm mb-1" style={{ fontFamily: "var(--font-inter)" }}>{title}</div>
      <div className="text-xs opacity-50 leading-relaxed" style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}>{desc}</div>
    </div>
  );
}
