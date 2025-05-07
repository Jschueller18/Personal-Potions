# Setting Up Supabase for Personal Potions

This guide will help you set up a Supabase project to store survey data for Personal Potions.

## Step 1: Create a Supabase Account

1. Go to [Supabase.com](https://supabase.com/)
2. Sign up for a free account (you can use GitHub or email)

## Step 2: Create a New Project

1. After logging in, click **New Project**
2. Choose a name (e.g., "personal-potions")
3. Create a secure password
4. Choose the free tier and a region closest to your users
5. Click **Create new project**

## Step 3: Create Database Tables

Once your project is created, you'll need to create a table for customer data:

1. Go to the **Table Editor** in the left sidebar
2. Click **New Table**
3. Set the table name to `customers`
4. Add the following columns:

| Name | Type | Default | Primary | 
|------|------|---------|---------|
| id | uuid | gen_random_uuid() | Yes (PK) |
| created_at | timestamptz | now() | No |
| firstName | text | NULL | No |
| lastName | text | NULL | No |
| email | text | NULL | No |
| usage | jsonb | NULL | No |
| dietaryInfo | jsonb | NULL | No |
| healthInfo | jsonb | NULL | No |
| flavorPreferences | jsonb | NULL | No |

5. Click **Save** to create the table

### Additional Fields (Option 1)

If you're directly inserting survey data without grouping into jsonb objects, add these additional columns:

| Name | Type | Default | Primary | 
|------|------|---------|---------|
| age | integer | NULL | No |
| weight | integer | NULL | No |
| biologicalSex | text | NULL | No |
| activityLevel | text | NULL | No |
| sweatLevel | text | NULL | No |
| sweatRate | text | NULL | No |
| dietType | text | NULL | No |
| sodiumIntake | text | NULL | No |
| potassiumIntake | text | NULL | No |
| magnesiumIntake | text | NULL | No |
| calciumIntake | text | NULL | No |
| hydrationChallenges | jsonb | NULL | No |
| healthConditions | jsonb | NULL | No |
| exerciseType | jsonb | NULL | No |
| boneHealth | jsonb | NULL | No |
| dailyGoals | jsonb | NULL | No |
| hangoverSymptoms | text | NULL | No |
| hangoverTiming | text | NULL | No |
| menstrualFlow | text | NULL | No |
| menstrualSymptoms | jsonb | NULL | No |
| muscleTension | text | NULL | No |
| symptomSeverity | text | NULL | No |
| waterIntake | text | NULL | No |
| waterRetention | text | NULL | No |
| workoutDuration | text | NULL | No |
| workoutIntensity | text | NULL | No |
| proteinIntake | text | NULL | No |
| vitaminDStatus | text | NULL | No |
| menstrualStatus | text | NULL | No |
| dairyIntake | numeric | NULL | No |
| sodiumSupplement | integer | NULL | No |
| potassiumSupplement | integer | NULL | No |
| magnesiumSupplement | integer | NULL | No |
| calciumSupplement | integer | NULL | No |
| sleepGoals | jsonb | NULL | No |
| flavor | text | NULL | No |
| flavorIntensity | text | NULL | No |
| sweetenerAmount | text | NULL | No |
| sweetenerType | text | NULL | No |
| feedback | text | NULL | No |

### Alternative Option (Option 2)

Instead of adding more columns, modify your API code to properly group fields into the jsonb columns according to this structure:

```javascript
const customerData = {
  firstName: rawData.firstName,
  lastName: rawData.lastName,
  email: rawData.email,
  usage: rawData.usage || [],
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
    hydrationChallenges: rawData.hydrationChallenges || []
  },
  flavorPreferences: {}
};
```

## Step 4: Get Your API Keys

1. Go to **Project Settings** (gear icon) in the left sidebar  
2. Click on **API** in the settings menu
3. You'll see your project's URL and API keys
4. Copy the following values:
   - **URL**: `https://[your-project-ref].supabase.co`
   - **anon public** key (this is the SUPABASE_ANON_KEY)

## Step 5: Update Environment Variables

1. Update the `.env.local` file with your Supabase URL and anon key:

```
SUPABASE_URL=https://[your-project-ref].supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

2. If deploying to Vercel, add these environment variables in the Vercel project settings

## Step 6: Deploy Your Application

1. Push the updated code to your repository
2. Deploy your application on Vercel or your hosting provider

## Testing the Connection

After deployment, you can test if the connection is working by:

1. Visiting `/api/check-db` endpoint
2. Filling out and submitting the survey form
3. Checking the Supabase dashboard to see if data appears in the `customers` table

## Troubleshooting

If you encounter issues:

- Check the browser console for error messages
- Verify that your environment variables are set correctly
- Make sure the 'customers' table exists with the correct columns
- Check that your Supabase project is on the active free tier 
- Verify that your API is correctly formatting data to match your database schema 