'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

// Define a static data structure for blog posts
// In a real application, you would fetch this from a database
const blogPosts = [
  {
    id: 1,
    title: 'Desain Berbasis Emosi: Menciptakan Pengalaman Pengguna yang Berkesan',
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1549646440-a3597d39ef5b?q=80&w=2670&auto=format&fit=crop',
    excerpt: 'Memahami bagaimana emosi memengaruhi interaksi pengguna adalah kunci untuk menciptakan produk digital yang benar-benar berkesan dan terhubung dengan audiens.',
    author: 'Steve Jobs',
    date: '2023-10-26',
  },
  {
    id: 2,
    title: 'Framework CSS Baru untuk Pengembang Web Modern',
    category: 'Development',
    imageUrl: 'https://images.unsplash.com/photo-1528643501712-4f358d343c68?q=80&w=2670&auto=format&fit=crop',
    excerpt: 'Tinjauan mendalam tentang framework CSS terbaru yang menjanjikan peningkatan performa dan kemudahan dalam pengembangan antarmuka pengguna.',
    author: 'Bill Gates',
    date: '2023-10-25',
  },
  {
    id: 3,
    title: 'Pentingnya Branding dalam Pengembangan Startup',
    category: 'Branding',
    imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375259e?q=80&w=2670&auto=format&fit=crop',
    excerpt: 'Branding bukan hanya tentang logo. Ini adalah tentang cerita, nilai, dan janji yang Anda berikan kepada pelanggan. Pelajari mengapa ini krusial sejak hari pertama.',
    author: 'Elon Musk',
    date: '2023-10-24',
  },
  {
    id: 4,
    title: 'Panduan Praktis untuk Optimalisasi SEO di Next.js',
    category: 'Marketing',
    imageUrl: 'https://images.unsplash.com/photo-1557833074-b527de222538?q=80&w=2670&auto=format&fit=crop',
    excerpt: 'Langkah-langkah sederhana namun efektif untuk meningkatkan peringkat SEO situs web Anda yang dibangun dengan framework Next.js.',
    author: 'Mark Zuckerberg',
    date: '2023-10-23',
  },
  {
    id: 5,
    title: 'Seni Fotografi Produk untuk E-commerce',
    category: 'Photography',
    imageUrl: 'https://images.unsplash.com/photo-1588636402741-6e3e5c945b08?q=80&w=2670&auto=format&fit=crop',
    excerpt: 'Pelajari teknik-teknik kunci untuk mengambil foto produk yang profesional dan menarik, yang dapat meningkatkan konversi penjualan Anda.',
    author: 'Sheryl Sandberg',
    date: '2023-10-22',
  },
  {
    id: 6,
    title: 'Tren Terbaru dalam Desain Interaksi UI/UX',
    category: 'UI/UX',
    imageUrl: 'https://images.unsplash.com/photo-1563986768605-da4d142c1302?q=80&w=2670&auto=format&fit=crop',
    excerpt: 'Ikuti perkembangan tren desain interaksi terpanas tahun ini, dari *micro-interactions* hingga *generative design*.',
    author: 'Sundar Pichai',
    date: '2023-10-21',
  },
];

// Animation variants for each blog post card
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 15,
    }
  },
} as const;

export default function CommunityPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar isLoaded={true} />
      <div className="min-h-screen bg-white dark:bg-black pt-20 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center mt-16 mb-24"
          >
            <h1 className="text-5xl md:text-6xl font-normal tracking-tight text-black dark:text-white">
              Community Blog
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
              Wawasan terbaru dari tim kami dan komunitas kreatif.
            </p>
          </motion.div>
          
          {/* Blog Post Grid */}
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
            ) : (
              <motion.div
                key="grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {blogPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    variants={cardVariants as Variants}
                  >
                    <Link href={`/blog/${post.id}`} className="group block h-full">
                      <div className="flex flex-col h-full overflow-hidden">
                        {/* Image */}
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                        </div>
                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="mb-4">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                              {post.category}
                            </span>
                            <h3 className="text-2xl font-normal leading-tight mt-1 text-black dark:text-white transition-colors duration-300 group-hover:text-gray-500">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                              {post.excerpt}
                            </p>
                          </div>
                          {/* Author & Date */}
                          <div className="flex items-center text-sm text-gray-400 dark:text-gray-600 mt-2">
                            <span>{post.author}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </>
  );
}