'use client';
import React from 'react';
import Image from 'next/image';
import styles from './MarqueeSection.module.css';

// Daftar logo asli
const clientLogos = [
  { src: '/monfleur.png', alt: 'Monfleur Logo' },
  { src: '/gohte.svg', alt: 'Gohte Logo' },
  { src: '/huruhara.jpg', alt: 'Huruhara Logo' },
];

// Buat array yang lebih panjang untuk mengisi layar
const logosToDisplay = Array(3).fill(clientLogos).flat();

// Gabungkan array dengan dirinya sendiri untuk menciptakan loop yang mulus
const doubledLogos = [...logosToDisplay, ...logosToDisplay];

export default function MarqueeSection() {
  return (
    <section className="w-full bg-white py-8 ">
      <div className={styles.marquee}>
        <div className={styles.track}>
          {doubledLogos.map((logo, index) => (
            <div key={index} className={styles.logoContainer}>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={100} // DIUBAH: Ukuran diperkecil lagi
                height={35}  // DIUBAH: Ukuran diperkecil lagi
                className="object-contain transition-transform duration-300 ease-in-out hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}