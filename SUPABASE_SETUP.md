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