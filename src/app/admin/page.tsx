'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import Image from 'next/image';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// Categories for dropdown
const categories = [
  'Web Design',
  'Web Development',
  'E-commerce',
  'Branding',
  'Mobile App',
  'UI/UX Design'
];

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    pdf_url: '',
    clientName: '',
    webDeveloper: '',
    uiUxDesigner: '',
    photographer: '',
    illustrator: '',
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [clientLogo, setClientLogo] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);

  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isMounted, setIsMounted] = useState(false);
  
  const mainImageRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const additionalImagesRef = useRef<HTMLInputElement>(null);

  // Fix hydration issue
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'main' | 'logo' | 'additional') => {
    const files = e.target.files;
    if (!files) return;

    if (fileType === 'main') {
      const file = files[0];
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    } else if (fileType === 'logo') {
      const file = files[0];
      setClientLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    } else if (fileType === 'additional') {
      const fileArray = Array.from(files);
      setAdditionalImages(fileArray);
      const previewUrls = fileArray.map(file => URL.createObjectURL(file));
      setAdditionalImagesPreview(previewUrls);
    }
    setMessage({ type: '', text: '' });
  };
  
  const uploadImageToSupabase = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    if (!data || !data.publicUrl) {
      throw new Error("Failed to retrieve public URL after upload.");
    }
    
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (!mainImage || !formData.title || !formData.category) {
        throw new Error('Please fill all required fields, including the main image.');
      }

      const teamData = {
        webDeveloper: formData.webDeveloper || null,
        uiUxDesigner: formData.uiUxDesigner || null,
        photographer: formData.photographer || null,
        illustrator: formData.illustrator || null,
      };

      // Upload all files concurrently
      const [mainImageUrl, clientLogoUrl, additionalImageUrls] = await Promise.all([
        uploadImageToSupabase(mainImage, 'works'),
        clientLogo ? uploadImageToSupabase(clientLogo, 'logos') : Promise.resolve(null),
        Promise.all(additionalImages.map(file => uploadImageToSupabase(file, 'additional')))
      ]);
      
      const { data, error } = await supabase
        .from('works')
        .insert([{
          title: formData.title,
          category: formData.category,
          description: formData.description || null,
          pdf_url: formData.pdf_url || null,
          imageUrl: mainImageUrl,
          clientName: formData.clientName || null,
          clientLogoUrl: clientLogoUrl,
          imageList: additionalImageUrls,
          team: teamData,
        }])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setMessage({ type: 'success', text: 'Work added successfully!' });
        setFormData({
          title: '',
          category: '',
          description: '',
          pdf_url: '',
          clientName: '',
          webDeveloper: '',
          uiUxDesigner: '',
          photographer: '',
          illustrator: '',
        });
        setMainImage(null);
        setClientLogo(null);
        setAdditionalImages([]);
        setMainImagePreview(null);
        setLogoPreview(null);
        setAdditionalImagesPreview([]);

        // Reset file inputs
        if (mainImageRef.current) mainImageRef.current.value = '';
        if (logoRef.current) logoRef.current.value = '';
        if (additionalImagesRef.current) additionalImagesRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Error adding work:', error);
      let errorMessage = 'Failed to add work';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === '23505') {
        errorMessage = 'A project with this title already exists';
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <>
        <Navbar isLoaded={true} />
        <div className="min-h-screen bg-white dark:bg-black pt-20 pb-20 px-4 md:px-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar isLoaded={true} />
      <div className="min-h-screen bg-white dark:bg-black pt-20 pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-light text-black dark:text-white mb-4">
              Admin Panel
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Add new work to your portfolio
            </p>
          </motion.div>

          {/* Message Alert */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg mb-8 ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 md:p-8"
          >
            <div className="space-y-6">
              {/* Project Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter project title"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Main Image Upload */}
              <div>
                <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Main Project Image *
                </label>
                <input
                  id="mainImage"
                  type="file"
                  ref={mainImageRef}
                  onChange={(e) => handleFileChange(e, 'main')}
                  accept="image/*"
                  required
                  className="w-full text-black dark:text-white"
                />
                {mainImagePreview && (
                  <div className="mt-4 w-48 h-auto">
                    <Image src={mainImagePreview} alt="Main Image Preview" width={300} height={200} className="rounded-lg object-contain" />
                  </div>
                )}
              </div>

              {/* Client Name & Logo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <label htmlFor="clientLogo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Client Logo
                  </label>
                  <input
                    id="clientLogo"
                    type="file"
                    ref={logoRef}
                    onChange={(e) => handleFileChange(e, 'logo')}
                    accept="image/*"
                    className="w-full text-black dark:text-white"
                  />
                  {logoPreview && (
                    <div className="mt-4 w-16 h-16">
                      <Image src={logoPreview} alt="Logo Preview" width={64} height={64} className="rounded-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              {/* Team Members */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Team Members
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="webDeveloper" value={formData.webDeveloper} onChange={handleInputChange} placeholder="Web Developer" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white" />
                  <input type="text" name="uiUxDesigner" value={formData.uiUxDesigner} onChange={handleInputChange} placeholder="UI/UX Designer" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white" />
                  <input type="text" name="photographer" value={formData.photographer} onChange={handleInputChange} placeholder="Photographer" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white" />
                  <input type="text" name="illustrator" value={formData.illustrator} onChange={handleInputChange} placeholder="Illustrator" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white" />
                </div>
              </div>

              {/* Additional Images Upload */}
              <div>
                <label htmlFor="additionalImages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Images (Optional)
                </label>
                <input
                  id="additionalImages"
                  type="file"
                  ref={additionalImagesRef}
                  onChange={(e) => handleFileChange(e, 'additional')}
                  accept="image/*"
                  multiple
                  className="w-full text-black dark:text-white"
                />
                {additionalImagesPreview.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {additionalImagesPreview.map((url, index) => (
                      <div key={index} className="w-full h-auto">
                        <Image src={url} alt={`Preview ${index + 1}`} width={200} height={150} className="rounded-lg object-contain" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter project description"
                />
              </div>

              {/* PDF URL */}
              <div>
                <label htmlFor="pdf_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PDF URL
                </label>
                <input
                  type="url"
                  id="pdf_url"
                  name="pdf_url"
                  value={formData.pdf_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/project.pdf"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-black text-white dark:bg-white dark:text-black rounded-lg font-medium text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white dark:border-black mr-2"></div>
                      Adding Work...
                    </div>
                  ) : (
                    'Add Work'
                  )}
                </button>
              </div>
            </div>
          </motion.form>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl"
          >
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-4">
              📝 Instructions
            </h3>
            <ul className="space-y-2 text-blue-700 dark:text-blue-400 text-sm">
              <li>• Project Title, Category, and Main Image are required.</li>
              <li>• Uploaded images are stored securely on Supabase.</li>
              <li>• Supported image formats: PNG, JPG, JPEG.</li>
              <li>• Fill in other fields as needed. They are optional.</li>
            </ul>
          </motion.div>

          {/* Quick Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="/work"
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
            >
              View Work Page
            </a>
            <a
              href="/"
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
            >
              Go to Home
            </a>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}