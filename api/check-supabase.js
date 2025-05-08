// Simple API endpoint to check Supabase connectivity
const { createClient } = require('@supabase/supabase-js');

try {
  require('dotenv').config();
} catch (e) {
  console.warn('dotenv not available, continuing without it');
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    // Check if Supabase environment variables are defined
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        status: 'error',
        message: 'Supabase credentials not configured', 
        env: {
          supabaseUrl: supabaseUrl ? 'defined' : 'undefined',
          supabaseKey: supabaseKey ? 'defined (length: ' + supabaseKey.length + ')' : 'undefined'
        }
      });
    }
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Try to connect by fetching a single row from customers table
    const { data, error } = await supabase
      .from('customers')
      .select('id')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    // Return success response
    return res.status(200).json({ 
      status: 'success',
      message: 'Successfully connected to Supabase',
      data: {
        tableAccess: true,
        rowCount: data ? data.length : 0,
        supabaseUrl: supabaseUrl
      }
    });
  } catch (error) {
    console.error('Supabase connection error:', error);
    
    return res.status(500).json({ 
      status: 'error',
      message: 'Error connecting to Supabase',
      error: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
  }
}; 