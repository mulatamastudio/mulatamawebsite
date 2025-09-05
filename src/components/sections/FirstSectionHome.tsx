'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function FirstSectionHome() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-white">
      <motion.h1
        className="text-center text-5xl font-medium tracking-tight text-zinc-900 md:text-8xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        We make <span className="font-serif italic">websites</span>.
      </motion.h1>
    </section>
  );
}