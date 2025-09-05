'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Props interface disederhanakan
interface NavbarProps {
  isLoaded: boolean;
}

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/works', label: 'Work' },
  { href: '/about-us', label: 'About' },
  { href: '/community', label: 'Community' },
];

// Komponen untuk setiap tautan navigasi dengan efek "sliding window"
const NavLink = ({ href, label }: { href: string; label: string; }) => {
  return (
    <Link href={href} className="relative block h-6 overflow-hidden text-sm">
      <motion.div
        className="flex flex-col"
        whileHover={{ y: '-50%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <span className="flex h-6 items-center px-3 text-zinc-600">{label}</span>
        <span className="flex h-6 items-center px-3 font-semibold text-zinc-900">{label}</span>
      </motion.div>
    </Link>
  );
};

export default function Navbar({ isLoaded }: NavbarProps) {
  // State untuk melacak visibilitas navbar dan posisi scroll sebelumnya
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    // Fungsi untuk menangani event scroll
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Sembunyikan navbar jika menggulir ke bawah dan sudah melewati 100px dari atas
      if (currentScrollY > prevScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } 
      // Tampilkan navbar jika menggulir ke atas atau sudah kembali ke bagian atas halaman
      else if (currentScrollY < prevScrollY || currentScrollY < 100) {
        setIsVisible(true);
      }

      // Perbarui posisi scroll untuk perbandingan berikutnya
      setPrevScrollY(currentScrollY);
    };

    // Tambahkan event listener saat komponen dipasang
    window.addEventListener('scroll', handleScroll);

    // Bersihkan event listener saat komponen dilepas untuk menghindari memory leak
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  // Tentukan posisi Y untuk animasi berdasarkan state `isVisible`
  const yPosition = isVisible ? 0 : -90; // -90px untuk menggerakkan ke atas

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
            <div className="relative hidden h-6 overflow-hidden md:block">
              <motion.div
                className="flex flex-col"
                whileHover={{ y: '-50%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <span className="flex h-6 items-center text-sm text-zinc-500">Creative & Digital Solutions</span>
                <span className="flex h-6 items-center text-sm font-semibold text-zinc-900">Home</span>
              </motion.div>
            </div>
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
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>
          
          <div className="h-6 w-px bg-zinc-300/80" />

          <div className="pr-2">
            <Link 
              href="/#contact" 
              className="relative block h-6 overflow-hidden text-sm"
            >
              <motion.div
                className="flex flex-col"
                whileHover={{ y: '-50%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <span className="flex h-6 items-center px-3 font-semibold text-zinc-900">Let's Talk</span>
                <span className="flex h-6 items-center px-3 font-semibold text-zinc-900">Hi mate</span>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>
    </header>
  );
}