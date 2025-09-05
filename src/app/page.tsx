'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import Homeboard from '@/components/sections/HomeBoard';
import FirstSectionHome from '@/components/sections/FirstSectionHome';
import PortfolioVideo from '@/components/sections/PortfolioVideo';
import PortfolioText from '@/components/sections/PortfolioText';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isBoardVisible, setIsBoardVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleEnterStudio = () => {
    setIsBoardVisible(false);
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>
      
      <AnimatePresence>
        {isBoardVisible && !isLoading && <Homeboard onEnter={handleEnterStudio} />}
      </AnimatePresence>
      
      {!isBoardVisible && (
        <>
          <Navbar isLoaded={!isLoading} />
          <main className="overflow-x-hidden bg-white dark:bg-black">
            <FirstSectionHome /> {/* We make websites. */}
            
            {/* Komponen portofolio ditempatkan di sini */}
            <PortfolioVideo />
            <PortfolioText />
            
            <Footer />
          </main>
        </>
      )}
    </>
  );
}