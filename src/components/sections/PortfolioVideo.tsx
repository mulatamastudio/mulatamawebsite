'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PortfolioVideo = () => {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  const width = useTransform(scrollYProgress, [0.3, 0.7], ['80%', '100%']);
  const opacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  return (
    <motion.section 
      ref={targetRef} 
      className="h-[100vh] relative bg-white"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="w-full h-full"
          style={{ width, opacity }}
        >
          <video
            className="w-full h-full object-cover"
            src="/portfolio.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PortfolioVideo;