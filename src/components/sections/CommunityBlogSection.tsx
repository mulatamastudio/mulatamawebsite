'use client';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// Data dummy untuk postingan blog
const featuredPost = {
    category: 'Community Spotlight',
    title: 'How a Digital Invitation Transformed a Wedding Experience',
    excerpt: 'An in-depth look at how we collaborated with a client to create an unforgettable digital experience for their special day...',
    author: 'Steven Mulya Tjendratama',
    imageUrl: '/imagethree.png',
    link: '#',
};

const recentPosts = [
    { category: 'Design Tips', title: 'The Power of White Space', link: '#' },
    { category: 'Development', title: 'Why We Choose Next.js', link: '#' },
    { category: 'Branding', title: 'Crafting a Brand Identity', link: '#' },
];

// Varian animasi
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

// Komponen tautan yang dapat digunakan kembali dengan efek hover "jendela geser"
const SlidingLink = ({ href, label, className }: { href: string; label: string; className?: string }) => {
    return (
      <Link href={href} className={`relative block overflow-hidden ${className}`}>
        <motion.div
          className="flex flex-col"
          whileHover={{ y: '-50%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <span className="flex items-center text-zinc-600">{label}</span>
          <span className="flex items-center font-semibold text-zinc-900">{label}</span>
        </motion.div>
      </Link>
    );
};

export default function CommunityBlogSection() {
  return (
    <section id="community-blog" className="w-full bg-white py-24 sm:py-32">
      <motion.div
        className="container mx-auto max-w-7xl px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Kolom Kiri: Artikel Unggulan */}
          <motion.div variants={itemVariants}>
            <p className="font-semibold uppercase tracking-wider text-zinc-500">From Our Journal</p>
            <div className="mt-8">
                <Link href={featuredPost.link} className="group block">
                    <div className="overflow-hidden rounded-2xl border border-zinc-200">
                        <Image
                        src={featuredPost.imageUrl}
                        alt={featuredPost.title}
                        width={800}
                        height={1000}
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div className="mt-6">
                        <h3 className="text-3xl font-bold text-zinc-900 transition-colors group-hover:text-zinc-600">
                        {featuredPost.title}
                        </h3>
                        <p className="mt-4 text-lg text-zinc-600">{featuredPost.excerpt}</p>
                        <p className="mt-4 text-sm font-medium text-zinc-800">by {featuredPost.author}</p>
                    </div>
                </Link>
            </div>
          </motion.div>

          {/* Kolom Kanan: Artikel Terbaru */}
          <motion.div className="flex flex-col" variants={itemVariants}>
            <div className="flex-grow rounded-2xl bg-zinc-50 p-12">
                <h3 className="text-2xl font-bold text-zinc-900">Recent Posts</h3>
                <div className="mt-8 space-y-8 border-t border-zinc-200 pt-8">
                {recentPosts.map(post => (
                    <div key={post.title}>
                        <p className="text-sm text-zinc-500">{post.category}</p>
                        <SlidingLink href={post.link} label={post.title} className="text-lg h-8 mt-1" />
                    </div>
                ))}
                 <div className="pt-4">
                    <SlidingLink href="#" label="View all posts →" className="text-base h-7" />
                 </div>
                </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}