'use client';

import { motion, Variants } from 'framer-motion';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

// Container variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

// Item variants for each content section
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1],
    } 
  },
} as const;

export default function AboutPage() {
  return (
    <>
      <Navbar isLoaded={true} />
      <div className="min-h-screen bg-white dark:bg-black pt-20 pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center mt-16 mb-24"
          >
            <h1 className="text-5xl md:text-6xl font-normal tracking-tight text-black dark:text-white">
              The Studio
            </h1>
          </motion.div>
          ---
          {/* Main Content Sections */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            {/* Our Philosophy Section */}
            <motion.div
              variants={itemVariants as Variants}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mb-20"
            >
              <h2 className="text-3xl font-normal text-black dark:text-white mb-4 md:mb-0">
                Our Philosophy
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Kami percaya pada perpaduan antara seni dan teknologi. Setiap proyek kami
                didorong oleh gairah untuk menciptakan desain yang bersih, interaktivitas
                yang memiliki tujuan, dan komitmen untuk menghasilkan solusi digital yang
                tidak hanya terlihat menakjubkan, tetapi juga berfungsi tanpa cela.
              </p>
            </motion.div>
            ---
            {/* Our Process Section */}
            <motion.div
              variants={itemVariants as Variants}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mb-20"
            >
              <h2 className="text-3xl font-normal text-black dark:text-white mb-4 md:mb-0">
                Our Process
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Kami memulai dengan mendalami visi Anda. Dari ideasi strategis hingga desain
                yang cermat dan pengembangan yang sempurna, kami bekerja sama untuk
                menghidupkan ide-ide Anda. Proses kami transparan, berulang, dan berfokus pada
                penyampaian hasil yang melampaui ekspektasi.
              </p>
            </motion.div>
            ---
            {/* Let's Create Section without a button */}
            <motion.div
              variants={itemVariants as Variants}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-12"
            >
              <h2 className="text-3xl font-normal text-black dark:text-white mb-4 md:mb-0">
                Let's Create
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Siap mengubah kehadiran digital Anda? Kami sangat bersemangat tentang apa
                yang kami lakukan dan selalu mencari tantangan baru.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}