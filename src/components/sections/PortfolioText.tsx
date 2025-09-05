'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PortfolioText() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-white">
      <motion.div
        className="absolute top-8 left-8 text-3xl font-medium tracking-tight text-zinc-900 md:text-5xl z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        For your{' '}
        <span className="font-serif italic text-zinc-800">portfolio</span>
        {', '}
        <span className="font-mono font-light text-zinc-700">business</span>
        {', '}
        <span className="font-sans font-bold text-zinc-900">event</span>.
      </motion.div>
      
      {/* Tulisan For you. di pojok kanan bawah */}
      <motion.div
        className="absolute bottom-8 right-8 text-xl font-medium text-zinc-900 md:text-3xl z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
      >
        For you.
      </motion.div>
    </section>
  );
}