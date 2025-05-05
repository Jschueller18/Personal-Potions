// Supabase client for better database connections
const { createClient } = require('@supabase/supabase-js');

// Load environment variables if needed
try {
  require('dotenv').config();
} catch (e) {
  console.warn('dotenv not available, continuing without it');
}

module.exports = async (req, res) => {
  // Allow cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the data from the request
    const customerData = req.body;
    
    // Add timestamp
    customerData.created_at = new Date().toISOString();
    
    // Log request data for debugging
    console.log('Received submission:', customerData);
    
    // Check if Supabase environment variables are defined
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not defined');
      return res.status(500).json({ 
        error: 'Database connection credentials are not configured',
        note: 'Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables'
      });
    }
    
    console.log('Connecting to Supabase...');
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Insert the customer data into the customers table
    const { data, error } = await supabase
      .from('customers')
      .insert(customerData)
      .select();
    
    if (error) {
      throw error;
    }
    
    console.log('Customer data inserted successfully:', data);
    
    // Return success with customer data
    return res.status(200).json({ 
      success: true, 
      customer: data[0]
    });
  } catch (error) {
    console.error('Error processing submission:', error);
    
    // Return detailed error for debugging
    return res.status(500).json({ 
      error: error.message, 
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      tip: 'Check your Supabase configuration and network access'
    });
  }
}; 