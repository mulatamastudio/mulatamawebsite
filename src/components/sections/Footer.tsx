'use client';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="px-6 py-8 bg-white border-t border-zinc-100">
      <div className="max-w-6xl mx-auto">
        
        {/* Baris 1: Filosofi */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <p className="text-sm text-zinc-600 mb-1">
            We believe
          </p>
          <p className="text-lg font-light text-zinc-800 italic">
            In every beginning there is growth
          </p>
        </motion.div>

        {/* Garis pemisah */}
        <div className="w-20 h-px bg-zinc-300 mx-auto mb-6"></div>

        {/* Baris 2: Email, Links & Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4"
        >
          {/* Email */}
          <a 
            href="mailto:mulatamastudio@gmail.com" 
            className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors duration-300"
          >
            mulatamastudio@gmail.com
          </a>
          
          {/* Links dan Copyright dalam satu baris */}
          <div className="flex items-center gap-5">
            <a 
              href="/terms" 
              className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors duration-300"
            >
              Terms
            </a>
            
            <div className="w-px h-4 bg-zinc-300"></div>
            
            <a 
              href="/faq" 
              className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors duration-300"
            >
              FAQ
            </a>
            
            <div className="w-px h-4 bg-zinc-300"></div>
            
            <p className="text-xs text-zinc-400">
              © {currentYear} Mulatama Studio
            </p>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}