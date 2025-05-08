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
    const rawData = req.body;
    
    // Log the raw data for debugging
    console.log('Received survey submission');
    
    // Format the data to match the Supabase schema
    const customerData = {
      // Basic fields that directly map to columns
      firstName: rawData.firstName,
      lastName: rawData.lastName,
      email: rawData.email,
      
      // Usage data goes into the usage JSONB column
      usage: rawData.usage || [],
      
      // Individual fields for Option 1 schema from SUPABASE_SETUP.md
      age: rawData.age,
      weight: rawData.weight,
      biologicalSex: rawData.biologicalSex,
      activityLevel: rawData.activityLevel,
      sweatLevel: rawData.sweatLevel,
      sweatRate: rawData.sweatRate,
      dietType: rawData.dietType,
      sodiumIntake: rawData.sodiumIntake,
      potassiumIntake: rawData.potassiumIntake,
      magnesiumIntake: rawData.magnesiumIntake,
      calciumIntake: rawData.calciumIntake,
      
      // JSONB arrays
      hydrationChallenges: rawData.hydrationChallenges || [],
      healthConditions: rawData.healthConditions || [],
      exerciseType: rawData.exerciseType || [],
      boneHealth: rawData.boneHealth || [],
      dailyGoals: rawData.dailyGoals || [],
      
      // Additional fields
      hangoverSymptoms: rawData.hangoverSymptoms,
      hangoverTiming: rawData.hangoverTiming,
      menstrualFlow: rawData.menstrualFlow,
      menstrualSymptoms: rawData.menstrualSymptoms || [],
      muscleTension: rawData.muscleTension,
      symptomSeverity: rawData.symptomSeverity,
      waterIntake: rawData.waterIntake,
      waterRetention: rawData.waterRetention,
      workoutDuration: rawData.workoutDuration,
      workoutIntensity: rawData.workoutIntensity,
      proteinIntake: rawData.proteinIntake,
      vitaminDStatus: rawData.vitaminDStatus,
      menstrualStatus: rawData.menstrualStatus,
      dairyIntake: rawData.dairyIntake,
      
      // Supplement values
      sodiumSupplement: rawData.sodiumSupplement,
      potassiumSupplement: rawData.potassiumSupplement,
      magnesiumSupplement: rawData.magnesiumSupplement,
      calciumSupplement: rawData.calciumSupplement,
      
      // Sleep goals
      sleepGoals: rawData.sleepGoals || [],
      
      // Flavor preferences
      flavor: rawData.flavor,
      flavorIntensity: rawData.flavorIntensity,
      sweetenerAmount: rawData.sweetenerAmount,
      sweetenerType: rawData.sweetenerType,
      feedback: rawData.feedback,
      
      // Also organize data into structured JSONB objects per Option 2 in SUPABASE_SETUP.md
      // for backward compatibility
      healthInfo: {
        age: rawData.age,
        weight: rawData.weight,
        biologicalSex: rawData.biologicalSex,
        activityLevel: rawData.activityLevel,
        sweatLevel: rawData.sweatLevel,
        healthConditions: rawData.healthConditions || []
      },
      
      dietaryInfo: {
        dietType: rawData.dietType,
        sodiumIntake: rawData.sodiumIntake,
        potassiumIntake: rawData.potassiumIntake,
        magnesiumIntake: rawData.magnesiumIntake,
        calciumIntake: rawData.calciumIntake,
        sodiumSupplement: rawData.sodiumSupplement,
        potassiumSupplement: rawData.potassiumSupplement,
        magnesiumSupplement: rawData.magnesiumSupplement,
        calciumSupplement: rawData.calciumSupplement,
        dairyIntake: rawData.dairyIntake,
        hydrationChallenges: rawData.hydrationChallenges || []
      },
      
      flavorPreferences: {
        flavor: rawData.flavor,
        flavorIntensity: rawData.flavorIntensity,
        sweetenerAmount: rawData.sweetenerAmount,
        sweetenerType: rawData.sweetenerType
      }
    };
    
    // Add timestamp
    customerData.created_at = new Date().toISOString();
    
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
    
    console.log('Inserting filtered customer data with service role key');
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Insert the customer data into the customers table
    const { data, error } = await supabase
      .from('customers')
      .insert(customerData)
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