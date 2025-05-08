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
    
    // Log the received data for debugging
    console.log('Received survey submission');
    
    // Ensure all expected fields are present in the data (using defaults if missing)
    const formattedData = {
      // Personal information
      firstName: customerData.firstName || '',
      lastName: customerData.lastName || '',
      email: customerData.email || '',
      
      // Personal metrics
      age: typeof customerData.age === 'number' ? customerData.age : 0,
      weight: typeof customerData.weight === 'number' ? customerData.weight : 0,
      
      // Profile fields
      biologicalSex: customerData.biologicalSex || '',
      activityLevel: customerData.activityLevel || 'moderately-active',
      sweatLevel: customerData.sweatLevel || 'moderate',
      dietType: customerData.dietType || 'omnivore',
      
      // Intake levels
      sodiumIntake: customerData.sodiumIntake || 'moderate',
      potassiumIntake: customerData.potassiumIntake || 'moderate',
      magnesiumIntake: customerData.magnesiumIntake || 'moderate',
      calciumIntake: customerData.calciumIntake || 'moderate',
      proteinIntake: customerData.proteinIntake || 'moderate',
      
      // Arrays - ensure they are always arrays
      usage: Array.isArray(customerData.usage) ? customerData.usage : [],
      hydrationChallenges: Array.isArray(customerData.hydrationChallenges) ? customerData.hydrationChallenges : [],
      healthConditions: Array.isArray(customerData.healthConditions) ? customerData.healthConditions : [],
      exerciseType: Array.isArray(customerData.exerciseType) ? customerData.exerciseType : [],
      boneHealth: Array.isArray(customerData.boneHealth) ? customerData.boneHealth : [],
      dailyGoals: Array.isArray(customerData.dailyGoals) ? customerData.dailyGoals : [],
      menstrualSymptoms: Array.isArray(customerData.menstrualSymptoms) ? customerData.menstrualSymptoms : [],
      sleepGoals: Array.isArray(customerData.sleepGoals) ? customerData.sleepGoals : [],
      
      // Single select fields
      workoutDuration: customerData.workoutDuration || '',
      workoutIntensity: customerData.workoutIntensity || '',
      menstrualFlow: customerData.menstrualFlow || '',
      symptomSeverity: customerData.symptomSeverity || '',
      waterIntake: customerData.waterIntake || '',
      waterRetention: customerData.waterRetention || '',
      muscleTension: customerData.muscleTension || '',
      vitaminDStatus: customerData.vitaminDStatus || '',
      menstrualStatus: customerData.menstrualStatus || '',
      hangoverSymptoms: customerData.hangoverSymptoms || '',
      hangoverTiming: customerData.hangoverTiming || '',
      
      // Numeric supplement values
      sodiumSupplement: customerData.sodiumSupplement !== null ? customerData.sodiumSupplement : null,
      potassiumSupplement: customerData.potassiumSupplement !== null ? customerData.potassiumSupplement : null,
      magnesiumSupplement: customerData.magnesiumSupplement !== null ? customerData.magnesiumSupplement : null,
      calciumSupplement: customerData.calciumSupplement !== null ? customerData.calciumSupplement : null,
      dairyIntake: customerData.dairyIntake !== null ? customerData.dairyIntake : null,
      
      // Flavor preferences
      flavor: customerData.flavor || '',
      flavorIntensity: customerData.flavorIntensity || '',
      sweetenerAmount: customerData.sweetenerAmount || '',
      sweetenerType: customerData.sweetenerType || '',
      
      // Additional info
      feedback: customerData.feedback || '',
      
      // Also create the JSON objects for backward compatibility
      healthInfo: {
        age: customerData.age || 0,
        weight: customerData.weight || 0,
        biologicalSex: customerData.biologicalSex || '',
        activityLevel: customerData.activityLevel || 'moderately-active',
        sweatLevel: customerData.sweatLevel || 'moderate',
        healthConditions: Array.isArray(customerData.healthConditions) ? customerData.healthConditions : []
      },
      
      dietaryInfo: {
        dietType: customerData.dietType || 'omnivore',
        sodiumIntake: customerData.sodiumIntake || 'moderate',
        potassiumIntake: customerData.potassiumIntake || 'moderate',
        magnesiumIntake: customerData.magnesiumIntake || 'moderate',
        calciumIntake: customerData.calciumIntake || 'moderate',
        dairyIntake: customerData.dairyIntake,
        hydrationChallenges: Array.isArray(customerData.hydrationChallenges) ? customerData.hydrationChallenges : []
      },
      
      flavorPreferences: {
        flavor: customerData.flavor || '',
        flavorIntensity: customerData.flavorIntensity || '',
        sweetenerAmount: customerData.sweetenerAmount || '',
        sweetenerType: customerData.sweetenerType || ''
      }
    };
    
    // Add timestamp
    formattedData.created_at = new Date().toISOString();
    
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
    
    console.log('Inserting customer data with service role key');
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Insert the customer data into the customers table
    const { data, error } = await supabase
      .from('customers')
      .insert(formattedData)
      .select();
    
    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
    
    console.log('Successfully created customer from survey, ID:', data[0].id);
    
    // Return success with customer data - ensure ID is properly returned
    return res.status(200).json({ 
      success: true, 
      customer: {
        ...data[0],
        // For MongoDB compatibility with frontend code
        _id: data[0].id
      }
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