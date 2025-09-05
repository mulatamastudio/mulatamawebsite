'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

// Props interface disederhanakan
interface NavbarProps {
  isLoaded: boolean;
}

// Data tautan navigasi
const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/works', label: 'Work' },
  { href: '/about-us', label: 'About' },
  { href: '/community', label: 'Community' },
];

// Komponen reusable untuk tautan dengan efek "sliding window"
const SlidingLink = ({ href, label, isBold = false }: { href: string; label: string; isBold?: boolean }) => {
  const textColor = isBold ? 'text-zinc-900' : 'text-zinc-600';
  const textHoverColor = isBold ? 'text-zinc-900' : 'text-zinc-900';
  const fontWeight = isBold ? 'font-semibold' : 'font-normal';
  
  return (
    <Link href={href} className="relative block h-6 overflow-hidden text-sm">
      <motion.div
        className="flex flex-col"
        whileHover={{ y: '-50%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <span className={`flex h-6 items-center px-3 ${fontWeight} ${textColor}`}>{label}</span>
        <span className={`flex h-6 items-center px-3 ${fontWeight} ${textHoverColor}`}>{label}</span>
      </motion.div>
    </Link>
  );
};

export default function Navbar({ isLoaded }: NavbarProps) {
  // State untuk melacak visibilitas navbar
  const [isVisible, setIsVisible] = useState(true);
  // Ref untuk menyimpan posisi scroll sebelumnya tanpa memicu re-render
  const prevScrollY = useRef(0);

  // Menggunakan useCallback untuk menghindari recreasi fungsi saat scroll
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > prevScrollY.current && currentScrollY > 100) {
      setIsVisible(false);
    } 
    else if (currentScrollY < prevScrollY.current || currentScrollY < 100) {
      setIsVisible(true);
    }

    prevScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    // Tambahkan event listener saat komponen dipasang
    window.addEventListener('scroll', handleScroll);

    // Bersihkan event listener saat komponen dilepas
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const yPosition = isVisible ? 0 : -90;

  return (
    <header className="relative z-50">
      {/* Elemen 1: Brand Name (Kiri Atas) */}
      <motion.div
        className="fixed top-6 left-6"
        initial={{ y: -100, x: -50, opacity: 0 }}
        animate={{ 
          y: yPosition, 
          x: isLoaded ? 0 : -50, 
          opacity: isLoaded ? 1 : 0 
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link 
          href="/" 
          className="flex h-12 items-center justify-center rounded-full border border-zinc-200/80 bg-white/80 px-6 shadow-lg backdrop-blur-md"
          prefetch={false}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-zinc-900">Mulatama Studio.</span>
            <div className="h-4 w-px bg-zinc-300 hidden md:block" />
            
            {/* Menggunakan SlidingLink yang telah dibuat */}
            <SlidingLink 
              href="/" 
              label="Creative & Digital Solutions" 
              isBold={false}
            />

          </div>
        </Link>
      </motion.div>

      {/* Elemen 2: Panel Aksi (Kanan Atas) */}
      <motion.div
        className="fixed top-6 right-6"
        initial={{ y: -100, x: 50, opacity: 0 }}
        animate={{ 
          y: yPosition, 
          x: isLoaded ? 0 : 50, 
          opacity: isLoaded ? 1 : 0 
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: isLoaded ? 0.2 : 0 }}
      >
        <div className="flex h-12 items-center gap-4 rounded-full border border-zinc-200/80 bg-white/80 p-2 shadow-lg backdrop-blur-md">
          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <SlidingLink key={link.href} href={link.href} label={link.label} isBold={false} />
            ))}
          </nav>
          
          <div className="h-6 w-px bg-zinc-300/80" />

          {/* Menggunakan SlidingLink yang telah dibuat untuk tombol "Let's Talk" */}
          <div className="pr-2">
            <SlidingLink 
              href="/#contact" 
              label="Let's Talk" 
              isBold={true}
            />
          </div>
        </div>
      </motion.div>
    </header>
  );
}