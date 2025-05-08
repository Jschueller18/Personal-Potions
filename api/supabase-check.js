// Detailed Supabase connection checker
const { createClient } = require('@supabase/supabase-js');

try {
  require('dotenv').config();
} catch (e) {
  console.warn('dotenv not available, continuing without it');
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'not set',
    environmentVars: {
      SUPABASE_URL: process.env.SUPABASE_URL ? 'defined (length: ' + process.env.SUPABASE_URL.length + ')' : 'undefined',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'defined (length: ' + process.env.SUPABASE_ANON_KEY.length + ')' : 'undefined',
      // Add other relevant env vars here
      NODE_ENV: process.env.NODE_ENV || 'not set',
      PORT: process.env.PORT || 'not set'
    },
    connection: {
      status: 'unknown',
      error: null
    },
    dbAccess: {
      status: 'unknown',
      customers: {
        read: { status: 'unknown', error: null },
        write: { status: 'unknown', error: null }
      }
    }
  };

  try {
    // Check if Supabase environment variables are defined
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      diagnostics.connection.status = 'failed';
      diagnostics.connection.error = 'Missing credentials';
      return res.status(200).json(diagnostics);
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    diagnostics.connection.status = 'initialized';
    
    // Test read access
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id')
        .limit(1);
      
      if (error) {
        diagnostics.dbAccess.customers.read.status = 'error';
        diagnostics.dbAccess.customers.read.error = {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        };
      } else {
        diagnostics.dbAccess.customers.read.status = 'success';
        diagnostics.dbAccess.customers.read.count = data ? data.length : 0;
      }
    } catch (error) {
      diagnostics.dbAccess.customers.read.status = 'exception';
      diagnostics.dbAccess.customers.read.error = { message: error.message };
    }
    
    // Test write access with a test record
    try {
      const testData = {
        firstName: 'ConnectionTest',
        lastName: 'User',
        email: `test-${Date.now()}@example.com`,
        usage: ['test'],
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('customers')
        .insert(testData)
        .select();
      
      if (error) {
        diagnostics.dbAccess.customers.write.status = 'error';
        diagnostics.dbAccess.customers.write.error = {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        };
      } else {
        diagnostics.dbAccess.customers.write.status = 'success';
        diagnostics.dbAccess.customers.write.insertedId = data[0].id;
        diagnostics.dbAccess.status = 'working';
      }
    } catch (error) {
      diagnostics.dbAccess.customers.write.status = 'exception';
      diagnostics.dbAccess.customers.write.error = { message: error.message };
    }
    
    // Overall status
    if (diagnostics.dbAccess.customers.read.status === 'success' && 
        diagnostics.dbAccess.customers.write.status === 'success') {
      diagnostics.dbAccess.status = 'fully operational';
      diagnostics.connection.status = 'connected';
    } else if (diagnostics.dbAccess.customers.read.status === 'success' || 
               diagnostics.dbAccess.customers.write.status === 'success') {
      diagnostics.dbAccess.status = 'partially working';
      diagnostics.connection.status = 'connected with issues';
    } else {
      diagnostics.dbAccess.status = 'not working';
      diagnostics.connection.status = 'connected but unable to access database';
    }
    
    return res.status(200).json(diagnostics);
  } catch (error) {
    diagnostics.connection.status = 'exception';
    diagnostics.connection.error = error.message;
    return res.status(500).json(diagnostics);
  }
}; 