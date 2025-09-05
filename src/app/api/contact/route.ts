import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Using our Supabase client

// This function handles POST requests to /api/contact
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Create a clean data object for database insertion
    const contactData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      country_code: formData.get('country-code') as string,
      message: formData.get('message') as string,
      // Ensure these match the new columns in your database
      preferred_date: formData.get('date') as string || null,
      preferred_time: formData.get('time') as string || null,
    };

    // Insert the data into the 'contacts' table in Supabase
    const { error } = await supabase
      .from('contacts')
      .insert([contactData]);

    if (error) {
      console.error('Supabase error:', error);
      // Send an error response if it fails
      return NextResponse.json({ message: 'Error submitting form data', error }, { status: 500 });
    }
    
    // (Additional logic for email notifications & PDF uploads would go here)

    // Send a success response
    return NextResponse.json({ message: 'Form submitted successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}