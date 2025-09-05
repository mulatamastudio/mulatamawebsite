'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface HomeHeroProps {
  isLoaded: boolean;
}

// Data untuk konten visual di setiap kolom
const column1 = [
  { type: 'image', src: '/imageone.png' },
  { type: 'image', src: 'https://placehold.co/600x800/e5e7eb/404040?text=Work+A' },
  { type: 'image', src: '/imagethree.png' },
];
const column2 = [
  { type: 'image', src: 'https://placehold.co/600x800/d4d4d8/171717?text=Work+B' },
  { type: 'video', src: '/hero-video.mp4' }, // Pastikan video ini ada di /public
  { type: 'image', src: 'https://placehold.co/600x800/a1a1aa/f4f4f5?text=Work+C' },
];
const column3 = [
  { type: 'image', src: '/imagetwo.png' },
  { type: 'image', src: 'https://placehold.co/600x800/404040/e5e5e5?text=Work+D' },
  { type: 'image', src: 'https://placehold.co/600x800/18181b/ffffff?text=Work+E' },
];

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

// Komponen untuk setiap kartu media
const MediaCard = ({ item }: { item: { type: string; src: string } }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    });
    const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

    return (
        <motion.div 
            ref={ref} 
            className="mb-8 overflow-hidden rounded-2xl shadow-lg"
            style={{ y }}
            variants={itemVariants}
        >
            {item.type === 'image' ? (
                <Image src={item.src} alt="Showcase work" width={600} height={800} className="w-full object-cover" />
            ) : (
                <video src={item.src} autoPlay loop muted playsInline className="w-full object-cover" />
            )}
        </motion.div>
    );
};

export default function HomeHeroSection({ isLoaded }: HomeHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start']
    });

    // Efek paralaks untuk setiap kolom
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -450]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <section ref={containerRef} className="relative h-[200vh] w-full bg-white">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
            className="container mx-auto grid h-full grid-cols-3 gap-8 px-4 py-12"
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
            <motion.div style={{ y: y1 }}>{column1.map((item, i) => <MediaCard key={i} item={item} />)}</motion.div>
            <motion.div style={{ y: y2 }} className="mt-24">{column2.map((item, i) => <MediaCard key={i} item={item} />)}</motion.div>
            <motion.div style={{ y: y3 }} className="mt-12">{column3.map((item, i) => <MediaCard key={i} item={item} />)}</motion.div>
        </motion.div>
        
        {/* Lapisan Judul dan Tombol "Enter" */}
        <motion.div 
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-t from-black/50 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1.5, delay: 1 }}
        >
            <h1 className="text-6xl font-extrabold tracking-widest text-white sm:text-8xl">MULATAMA</h1>
            <p className="mt-4 text-lg font-medium tracking-wider text-zinc-300">STUDIO</p>
            <Link href="/home" className="mt-12 rounded-full bg-white/90 px-6 py-3 text-base font-semibold text-zinc-900 shadow-lg backdrop-blur-sm transition-transform hover:scale-105">
                Enter Studio
            </Link>
        </motion.div>
      </div>
    </section>
  );
}