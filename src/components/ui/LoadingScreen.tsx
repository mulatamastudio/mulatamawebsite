'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Playfair_Display, Roboto_Mono, Cormorant_Garamond, Sacramento, Inter } from 'next/font/google';

// Inisialisasi setiap font loader
const playfair = Playfair_Display({ subsets: ['latin'], weight: '700' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], weight: '500' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: '700' });
const sacramento = Sacramento({ subsets: ['latin'], weight: '400' });
const inter = Inter({ subsets: ['latin'], weight: '700' });

// Membuat array dari kelas font untuk iterasi
const fontStyles = [
  playfair.className,
  cormorant.className,
  robotoMono.className,
  sacramento.className,
  inter.className,
];

// Mendefinisikan tinggi setiap baris teks untuk kalkulasi animasi
// DIUBAH: Ukuran disesuaikan untuk font yang lebih kecil di pojok
const lineHeight = 60; 

export default function LoadingScreen() {
  const [currentFontIndex, setCurrentFontIndex] = useState(0);

  // Efek untuk mengganti font setiap 500 milidetik
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentFontIndex((prevIndex) => (prevIndex + 1) % fontStyles.length);
    }, 500); // Kecepatan perubahan font

    return () => clearInterval(intervalId);
  }, []);

  return (
    <motion.div
      // DIUBAH: Posisi diubah ke pojok kanan bawah
      className="fixed top-0 left-0 z-50 flex h-full w-full items-end justify-end bg-white p-8 sm:p-12"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {/* DIUBAH: Ukuran teks disesuaikan */}
      <div className="flex items-baseline text-4xl font-bold text-zinc-900 sm:text-5xl">
        <span className="tracking-tight">Mulatama</span>
        
        {/* Wadah "Jendela Geser" untuk kata "Studio" */}
        <div 
            className="relative ml-3 text-left overflow-hidden"
            style={{ height: lineHeight }}
        >
          <motion.div
            className="flex flex-col"
            // Menganimasikan posisi Y berdasarkan indeks font saat ini
            animate={{ y: `-${currentFontIndex * lineHeight}px` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Merender semua gaya font di dalam satu kolom */}
            {fontStyles.map((fontClass, index) => (
              <span 
                key={index} 
                className={fontClass} 
                style={{ height: lineHeight, display: 'flex', alignItems: 'baseline' }}
              >
                Studio.
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}