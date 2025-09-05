'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// Types for our work items based on your schema
interface WorkItem {
  id: number;
  created_at: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  pdf_url: string;
  clientName: string;
  clientLogoUrl: string;
  imageList: string[];
  team: {
    webDeveloper: string;
    uiUxDesigner: string;
    photographer: string;
    illustrator: string;
  };
}

export default function WorkDetailPage() {
  const params = useParams();
  const workId = params.id;
  
  const [work, setWork] = useState<WorkItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedWorks, setRelatedWorks] = useState<WorkItem[]>([]);

  // Fetch specific work item from Supabase
  useEffect(() => {
    const fetchWork = async () => {
      try {
        const { data, error } = await supabase
          .from('works')
          .select('*')
          .eq('id', workId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setWork(data);
          
          // Fetch related works (same category)
          const { data: relatedData } = await supabase
            .from('works')
            .select('*')
            .eq('category', data.category)
            .neq('id', workId)
            .limit(3)
            .order('created_at', { ascending: false });
            
          if (relatedData) {
            setRelatedWorks(relatedData);
          }
        }
      } catch (error) {
        console.error('Error fetching work:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (workId) {
      fetchWork();
    }
  }, [workId]);

  if (isLoading) {
    return (
      <>
        <Navbar isLoaded={true} />
        <div className="min-h-screen bg-white dark:bg-black flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!work) {
    return (
      <>
        <Navbar isLoaded={true} />
        <div className="min-h-screen bg-white dark:bg-black py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-2">Project not found</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              The project you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/work" className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-medium hover:opacity-90 transition-opacity">
              Back to Projects
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar isLoaded={true} />
      <div className="min-h-screen bg-white dark:bg-black pt-20">
        {/* Navigation */}
        <nav className="py-6 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <Link 
              href="/work" 
              className="inline-flex items-center text-black dark:text-white group font-medium"
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </Link>
          </div>
        </nav>

        {/* Project Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-12 px-4 md:px-8"
        >
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full mb-6">
              {work.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-light text-black dark:text-white mb-6">
              {work.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-3xl">
              {work.description}
            </p>
          </div>
        </motion.div>

        {/* Project Image */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden relative w-full aspect-[16/9]">
              <Image
                src={work.imageUrl}
                alt={work.title}
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Project Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="py-12 px-4 md:px-8 bg-gray-50 dark:bg-gray-900"
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Category</h3>
                <p className="text-black dark:text-white">{work.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Date</h3>
                <p className="text-black dark:text-white">
                  {new Date(work.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Project</h3>
                {work.pdf_url ? (
                  <a
                    href={work.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    View PDF
                  </a>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No file available</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-20 px-4 md:px-8 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-light text-black dark:text-white mb-6">
              Ready to create something similar?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Let&apos;s collaborate to bring your vision to life with our expertise and creativity.
            </p>
            <Link 
              href="/contact" 
              className="px-8 py-4 bg-black text-white dark:bg-white dark:text-black rounded-full font-medium text-lg hover:opacity-90 transition-opacity inline-block"
            >
              Start Your Project
            </Link>
          </div>
        </motion.div>

        {/* Related Projects */}
        {relatedWorks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="py-16 px-4 md:px-8 bg-gray-50 dark:bg-gray-900"
          >
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-light text-black dark:text-white mb-12 text-center">
                Related Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedWorks.map((relatedWork) => (
                  <Link key={relatedWork.id} href={`/work/${relatedWork.id}`}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="group cursor-pointer bg-white dark:bg-black rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-video relative">
                        <Image
                          src={relatedWork.imageUrl}
                          alt={relatedWork.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-medium text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                          {relatedWork.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                          {relatedWork.description}
                        </p>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(relatedWork.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </>
  );
}