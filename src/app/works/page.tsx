'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

interface WorkItem {
  id: number;
  created_at: string;
  title: string;
  category: string;
  imageUrl: string;
}

// Item animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 15,
      delay: 0.1 
    }
  },
} as const;

export default function WorkPage() {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from Supabase
  const fetchWorks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('works')
        .select('id, title, category, imageUrl, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setWorks(data);
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  // Divide works into two columns for a masonry-like layout
  const col1 = works.filter((_, i) => i % 2 === 0);
  const col2 = works.filter((_, i) => i % 2 !== 0);

  // Function to determine random-like image height for visual variety
  const getImageHeight = (index: number) => {
    const heights = [400, 500, 600, 700];
    return heights[index % heights.length];
  };

  const renderWorkItems = (column: WorkItem[]) => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {column.map((work, index) => (
        <motion.div
          key={work.id}
          variants={itemVariants as Variants}
          className="mb-24 md:mb-32"
        >
          {/* Mengganti Link menjadi motion.div untuk efek hover */}
          <motion.div
            whileHover={{ y: -8, transition: { type: "spring", stiffness: 100, damping: 10 } }}
            className="group block relative overflow-hidden"
          >
            <Link href={`/work/${work.id}`}>
              <div 
                className="relative w-full overflow-hidden" 
                style={{ height: `${getImageHeight(index)}px` }}
              >
                <Image
                  src={work.imageUrl}
                  alt={work.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="mt-8 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-black dark:text-white">
                  {work.title}
                </h3>
                <span className="text-lg text-gray-500 dark:text-gray-400">
                  [{work.category}]
                </span>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <>
      <Navbar isLoaded={true} />
      <div className="min-h-screen bg-white dark:bg-black py-40 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence>
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-64"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
              </motion.div>
            ) : works.length === 0 ? (
              <motion.div
                key="no-projects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10"
              >
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No projects yet</h3>
              </motion.div>
            ) : (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-24">
                {/* Column 1 */}
                {renderWorkItems(col1)}
                {/* Column 2 with vertical offset */}
                <div className="mt-24 md:mt-32">
                  {renderWorkItems(col2)}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </>
  );
}