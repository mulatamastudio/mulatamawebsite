'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is your typical project timeline?",
    answer: "Our projects generally range from 6-12 weeks depending on complexity. We follow an iterative process with weekly check-ins to ensure we're aligned with your vision and timeline."
  },
  {
    question: "Do you work with international clients?",
    answer: "Yes, we work with clients worldwide. Our team is distributed across time zones, allowing us to accommodate various schedules. We're experienced in remote collaboration and use tools like Figma, Slack, and Zoom to ensure seamless communication."
  },
  {
    question: "What's included in your development process?",
    answer: "Our end-to-end process includes discovery, strategy, design, development, testing, and launch. We also offer post-launch support and maintenance packages to keep your digital product performing at its best."
  },
  {
    question: "How do you ensure website performance?",
    answer: "We implement performance optimization from the ground up—optimized assets, efficient code, modern bundling techniques, and CDN integration. Most of our projects score 90+ on PageSpeed Insights while maintaining visual excellence."
  },
  {
    question: "What about ongoing support after launch?",
    answer: "We offer tailored support plans based on your needs. This can include technical maintenance, content updates, performance monitoring, and regular backups. We become an extension of your team."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Auto-close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openIndex !== null && 
          itemsRef.current[openIndex] &&
          !itemsRef.current[openIndex]?.contains(event.target as Node)) {
        setOpenIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openIndex]);

  return (
    <section className="py-32 px-6 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Left-aligned title */}
          <div className="lg:col-span-1">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-light tracking-tight text-black dark:text-white"
            >
              Questions
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
                className="block mt-2 text-lg font-normal text-gray-500 dark:text-gray-400"
              >
                Common inquiries
              </motion.span>
            </motion.h2>
          </div>
          
          {/* FAQ Items - Left aligned */}
          <div className="lg:col-span-3">
            <div className="space-y-1">
              {faqData.map((item, index) => (
                <motion.div 
                  key={index}
                  ref={(el: HTMLDivElement | null) => {
                    itemsRef.current[index] = el;
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  className="border-t border-gray-100 dark:border-gray-900 py-6"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="flex justify-between items-start w-full text-left py-2 font-light text-xl text-black dark:text-white transition-all duration-300"
                  >
                    <span className="pr-8 transition-all duration-300" 
                      style={{ transform: hoveredIndex === index ? 'translateX(8px)' : 'translateX(0)' }}>
                      {item.question}
                    </span>
                    <motion.span 
                      className="text-gray-400 dark:text-gray-500 text-2xl ml-4 mt-1 flex-shrink-0"
                      animate={{ rotate: openIndex === index ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      +
                    </motion.span>
                  </button>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="pt-2 pb-4 text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-2xl"
                        >
                          {item.answer}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
            
            {/* Contact prompt */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-900"
            >
              <p className="text-gray-500 dark:text-gray-400 mb-4">Couldn't find what you're looking for?</p>
              <a 
                href="/contact" 
                className="inline-flex items-center text-black dark:text-white group font-light"
              >
                <span className="border-b border-transparent group-hover:border-black dark:group-hover:border-white transition-all duration-500">
                  Get in touch
                </span>
                <svg 
                  className="w-4 h-4 ml-2 transition-transform duration-500 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;