'use client';
import { motion } from 'framer-motion';
import React, { useRef, useEffect, useState, useCallback } from 'react';

// Fungsi untuk membuat pola seni generatif hitam yang bernafas
const generateGenerativeArt = (width: number, height: number, time: number) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // Lebih pudar
        const gridSize = 30; // Grid yang lebih rapat
        const noise = 0.5 + Math.sin(time) * 0.5; // Efek "nafas" global

        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
                const angle = (Math.sin(x / 100 + time) + Math.cos(y / 100 + time)) * 0.5;
                const scale = 0.5 + Math.abs(Math.sin(angle + noise)) * 0.5;
                const startX = x + Math.cos(angle) * gridSize * 0.5 * noise;
                const startY = y + Math.sin(angle) * gridSize * 0.5 * noise;

                ctx.save();
                ctx.translate(startX, startY);
                ctx.rotate(angle);
                ctx.scale(scale, scale);
                ctx.beginPath();
                ctx.arc(0, 0, gridSize / 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    }
    return canvas.toDataURL();
};

interface HomeboardProps {
    onEnter: () => void;
}

export default function Homeboard({ onEnter }: HomeboardProps) {
    const [generativeArtUrl, setGenerativeArtUrl] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const [time, setTime] = useState(0);

    const updateGenerativeArt = useCallback(() => {
        if (containerRef.current) {
            const { clientWidth, clientHeight } = containerRef.current;
            setGenerativeArtUrl(generateGenerativeArt(clientWidth, clientHeight, time));
        }
    }, [time]);

    useEffect(() => {
        const handleResize = () => updateGenerativeArt();
        window.addEventListener('resize', handleResize);
        
        // Update animasi setiap frame
        let animationFrameId: number;
        const animate = (timestamp: number) => {
            setTime(timestamp / 2000); // Kecepatan animasi
            updateGenerativeArt();
            animationFrameId = requestAnimationFrame(animate);
        };
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [updateGenerativeArt]);

    return (
        <motion.div
            ref={containerRef}
            className="fixed inset-0 z-50 h-screen w-screen bg-white flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1 } }}
            exit={{ 
                scale: 0.9,
                opacity: 0,
                transition: { 
                    duration: 1.2,
                    ease: [0.65, 0.05, 0.36, 1] // Kurva yang lebih halus
                }
            }}
        >
            {generativeArtUrl && (
                <div 
                    className="absolute inset-0 z-0" 
                    style={{ 
                        backgroundImage: `url(${generativeArtUrl})`, 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center' 
                    }} 
                />
            )}

            {/* Tombol "Enter Studio" */}
            <div className="relative z-10">
                <motion.button
                    onClick={onEnter}
                    className="relative px-10 py-5 text-xl font-bold rounded-full shadow-lg overflow-hidden focus:outline-none"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] } }}
                    whileHover={{ scale: 1.1, backgroundColor: '#000' }} // Sedikit membesar dan berubah warna
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <motion.span 
                        className="relative z-10 text-white"
                        whileHover={{ color: '#fff' }}
                        transition={{ duration: 0.3 }}
                    >
                        Enter Studio
                    </motion.span>
                </motion.button>
            </div>
        </motion.div>
    );
}