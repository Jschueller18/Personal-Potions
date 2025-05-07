// Supabase client for connecting to PostgreSQL
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Check if environment variables are loaded
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const envSource = process.env.NODE_ENV || 'development';
    
    // Return early if no Supabase credentials are configured
    if (!supabaseUrl || !supabaseKey) {
      console.log('No Supabase credentials found');
      return res.status(200).json({
        status: 'error',
        connected: false,
        error: 'Supabase credentials are not configured',
        env: {
          nodeEnv: envSource,
          hasCredentials: !!(supabaseUrl && supabaseKey)
        }
      });
    }
    
    console.log('Attempting Supabase connection...');
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test the connection by getting a count of customers
    const { count, error: countError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      throw countError;
    }
    
    // Get the database table schema information
    const { data: tableInfo, error: tableError } = await supabase
      .from('customers')
      .select('*')
      .limit(1);
      
    // Get table columns
    let schema = {};
    if (tableInfo && tableInfo.length > 0) {
      const sampleRow = tableInfo[0];
      // Extract column names and types
      schema = Object.keys(sampleRow).reduce((acc, key) => {
        const value = sampleRow[key];
        acc[key] = {
          type: Array.isArray(value) ? 'array' : typeof value,
          isJsonb: typeof value === 'object' && value !== null && !Array.isArray(value)
        };
        return acc;
      }, {});
    }
    
    // Return connection status and schema info
    return res.status(200).json({
      status: 'success',
      connected: true,
      database: 'PostgreSQL via Supabase',
      tables: ['customers'],
      customerCount: count,
      schema: schema,
      tableInfo: tableError ? tableError.message : 'Schema info available',
      env: {
        nodeEnv: envSource
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    // Return error details
    return res.status(500).json({
      status: 'error',
      connected: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      env: {
        nodeEnv: process.env.NODE_ENV || 'development'
      }
    });
  }
}; 