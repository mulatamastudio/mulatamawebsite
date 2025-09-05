'use client';

import React, { useState, useEffect } from 'react';

export default function VideoHeroSection() {
  // State untuk menyimpan nilai skala video (1 = 100%, 0.8 = 80%, dst.)
  const [scale, setScale] = useState(1);
  const MIN_SCALE = 0.85; // Skala minimum video saat di-scroll
  const SCROLL_RANGE = 400; // Jarak scroll (dalam pixel) untuk mencapai skala minimum

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Menghitung seberapa jauh progres scroll dalam rentang yang ditentukan
      const scrollProgress = Math.min(scrollY / SCROLL_RANGE, 1);
      
      // Menghitung skala baru berdasarkan progres scroll
      // Saat scrollY = 0, scale = 1. Saat scrollY >= SCROLL_RANGE, scale = MIN_SCALE
      const newScale = 1 - scrollProgress * (1 - MIN_SCALE);
      
      setScale(newScale);
    };

    // Menambahkan event listener saat komponen pertama kali dirender
    window.addEventListener('scroll', handleScroll);

    // Membersihkan event listener saat komponen tidak lagi ditampilkan
    // Ini penting untuk performa dan menghindari memory leak
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Array kosong berarti efek ini hanya berjalan sekali (saat mount dan unmount)

  return (
    <section className="h-screen w-full flex items-center justify-center overflow-hidden sticky top-0">
      <div 
        className="w-full h-full transition-transform duration-200 ease-out"
        style={{ transform: `scaleX(${scale})` }}
      >
        <video
          className="w-full h-full object-cover"
          src="/hero-video.mp4" // 📹 GANTI DENGAN PATH VIDEO ANDA DI FOLDER /public
          autoPlay
          loop
          muted
          playsInline // Penting untuk autoplay di perangkat mobile
        />
      </div>
    </section>
  );
}