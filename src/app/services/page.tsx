'use client';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

// Data which includes title, caption, and image for services
const phrases = [
    { 
        id: 0,
        title: "Creative Websites", 
        caption: "Modern and stylish websites to showcase your personal brand or work—such as online portfolios, photography galleries, or artist showcases.",
        imageUrl: "/imageone.png",
        examples: ["Portfolio Website", "Personal Website", "Artist Showcase"]
    },
    { 
        id: 1,
        title: "Business Websites", 
        caption: "Professional websites designed for companies and small businesses—like digital menus for restaurants & cafés, product catalogs, or company profiles.",
        imageUrl: "/imagetwo.png",
        examples: ["E-commerce", "Company Profile", "Digital Menu"]
    },
    { 
        id: 2,
        title: "Event Websites", 
        caption: "Unique and interactive websites for special occasions—such as digital wedding invitations, birthday celebrations, or event landing pages.",
        imageUrl: "/imagethree.png",
        examples: ["Digital Invitation", "Wedding Website", "Event Landing Page"]
    },
];

const animationDuration = 4.5; // Duration in seconds

// Animation variants for the title ("sliding window" effect)
const titleVariants: Variants = {
    initial: { y: '110%' },
    animate: { y: '0%', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
    exit: { y: '-110%', transition: { duration: 0.4, ease: [0.45, 0, 0.55, 1] } },
};

// Variants for the caption and examples (fade in/out)
const contentVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.7, ease: 'easeOut', staggerChildren: 0.1 } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } },
};

const exampleItemVariants: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
};

const itemStaggerVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

// Variants for the index number
const uiVariants: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

export default function ServicesPage() {
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true); // Trigger entry animations on page load
        const intervalId = setInterval(() => {
            handleNext();
        }, animationDuration * 1000);
        return () => clearInterval(intervalId);
    }, [phraseIndex]);
    
    const handleNext = () => {
        setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    };

    const currentPhrase = phrases[phraseIndex];

  return (
    <>
      {/* FIXED: Removed the unnecessary isPlaying and togglePlay props */}
      <Navbar isLoaded={true} />
      <main>
        <section className="relative min-h-screen w-full overflow-hidden bg-white pt-28 pb-28">
            <div className="container mx-auto grid h-full grid-cols-1 items-center gap-12 px-8 lg:grid-cols-2">
                
                {/* Left Column: Narrative & Action */}
                <motion.div 
                    className="relative z-10"
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                >
                    <motion.div className="space-y-6" variants={itemStaggerVariants}>
                        <div className="relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div key={phraseIndex} variants={titleVariants} initial="initial" animate="animate" exit="exit">
                                    <h1 className="px-1 text-6xl font-extrabold leading-tight tracking-tighter text-zinc-900 sm:text-7xl">{currentPhrase.title}</h1>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="relative w-full max-w-lg min-h-[10rem] overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div key={phraseIndex} variants={contentVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0">
                                    <p className="pt-2 text-lg text-zinc-600">{currentPhrase.caption}</p>
                                    <motion.div className="mt-6 flex flex-wrap gap-3" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                                        {currentPhrase.examples.map((example, i) => (
                                            <motion.span key={i} variants={exampleItemVariants} className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700">{example}</motion.span>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                    <motion.div className="mt-12" variants={itemStaggerVariants}>
                        <Link href="/#contact" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-zinc-900 px-8 py-3 text-base font-semibold text-zinc-900 transition-colors duration-300 hover:text-white">
                            <div className="absolute inset-0 z-0 translate-y-full transform bg-zinc-900 transition-transform duration-300 ease-in-out group-hover:translate-y-0" />
                            <span className="relative z-10">Start This Project</span>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right Column: Image */}
                <motion.div 
                    className="relative h-[70vh] w-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                >
                    <AnimatePresence>
                        <motion.div key={phraseIndex} className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.8 } }} exit={{ opacity: 0, transition: { duration: 0.4 } }}>
                            <Image src={currentPhrase.imageUrl} alt={currentPhrase.title} layout="fill" objectFit="cover" className="transition-transform duration-500 ease-in-out hover:scale-105" />
                        </motion.div>
                    </AnimatePresence>

                    <motion.div className="absolute top-6 right-6 z-20" initial={{ opacity: 0 }} animate={{ opacity: isLoaded ? 1 : 0 }} transition={{ duration: 1, delay: 1 }}>
                         <button 
                            onClick={handleNext} 
                            className="flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200/80 bg-white/50 px-3 py-2 text-sm font-medium text-zinc-900 shadow-lg backdrop-blur-md transition-colors hover:bg-white"
                         >
                            <div className="relative h-5 w-5 overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.span key={phraseIndex} variants={uiVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0">
                                        {String(phraseIndex + 1).padStart(2, '0')}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                            <span className="text-zinc-400">/</span>
                            <span className="text-zinc-900">{String(phrases.length).padStart(2, '0')}</span>
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
      </main>
      <Footer />
    </>
  );
}