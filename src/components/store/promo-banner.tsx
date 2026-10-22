"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface Slide {
  label: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
  /** gradient overlay direction + color stops */
  overlay: string;
  /** accent color for the eyebrow label */
  accentClass: string;
  /** CTA button style */
  ctaClass: string;
}

const SLIDES: Slide[] = [
  {
    label: "Produk Segar",
    title: "Sayur & Buah Segar Setiap Hari",
    subtitle:
      "Langsung dari petani lokal, dipanen pagi dan diantar ke rumahmu.",
    cta: "Belanja Sayur & Buah",
    href: "/products?category=fresh-produce",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&h=600&fit=crop&crop=center",
    overlay: "from-black/70 via-black/40 to-transparent",
    accentClass: "bg-primary/90 text-white",
    ctaClass: "bg-primary text-white hover:bg-primary-dark",
  },
  {
    label: "Dairy & Bakery",
    title: "Roti & Susu untuk Keluarga",
    subtitle:
      "Koleksi dairy, telur, dan roti artisan pilihan. Segar setiap hari.",
    cta: "Lihat Koleksi Dairy",
    href: "/products?category=dairy-eggs",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1400&h=600&fit=crop&crop=center",
    overlay: "from-amber-950/80 via-amber-950/40 to-transparent",
    accentClass: "bg-amber-500/90 text-white",
    ctaClass: "bg-amber-500 text-white hover:bg-amber-600",
  },
  {
    label: "Promo Ongkir",
    title: "Gratis Ongkir Belanja Rp 150.000",
    subtitle:
      "Hemat ongkos kirim untuk setiap pesanan di atas Rp 150.000.",
    cta: "Mulai Belanja",
    href: "/products",
    image:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1400&h=600&fit=crop&crop=center",
    overlay: "from-sky-950/80 via-sky-950/40 to-transparent",
    accentClass: "bg-sky-500/90 text-white",
    ctaClass: "bg-sky-500 text-white hover:bg-sky-600",
  },
];

const INTERVAL = 5000;

export function PromoBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchRef = useRef<number | null>(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  function onTouchStart(e: React.TouchEvent) {
    touchRef.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchRef.current;
    if (Math.abs(diff) > 50) {
      diff < 0 ? next() : prev();
    }
    touchRef.current = null;
  }

  const slide = SLIDES[current];

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Promo banners"
    >
      {/* Background image layer — all images preloaded, only current visible */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== current}
        >
          <Image
            src={s.image}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${slide.overlay} transition-colors duration-700`}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-lg">
          <span
            className={`inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${slide.accentClass}`}
          >
            {slide.label}
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {slide.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/85 sm:text-lg">
            {slide.subtitle}
          </p>
          <Link
            href={slide.href}
            className={`mt-6 inline-flex items-center rounded-md px-6 py-3 text-sm font-semibold transition-colors ${slide.ctaClass}`}
          >
            {slide.cta}
          </Link>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current
                ? "w-6 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
