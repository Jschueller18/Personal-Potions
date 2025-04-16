# Personal Potions Site

Custom electrolyte mix creation website with MongoDB integration.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Configure MongoDB:
   - Update the `.env` file with your MongoDB connection string
   - For local MongoDB: `MONGODB_URI=mongodb://localhost:27017/personalpotions`
   - For MongoDB Atlas: `MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/personalpotions?retryWrites=true&w=majority`

4. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Database Structure

The survey data is stored in a `surveys` collection in MongoDB with the following structure:

- **usage**: Array of selected use cases
- **usageOther**: Custom usage option if "Other" was selected
- **hydrationChallenges**: Array of hydration challenges
- **healthConditions**: Array of health conditions
- **flavorPreference**: Preferred flavor
- **age**: User's age
- **sex**: User's biological sex
- **height**: User's height in inches
- **weight**: User's weight in lbs
- **email**: User's email address
- **formData**: Complete JSON object containing all form data
- **createdAt**: Timestamp when the survey was submitted

## Troubleshooting

- If you encounter CORS issues, check the CORS configuration in `server.js`
- For database connection issues, verify your MongoDB URI and connection settings
- Check browser console for JavaScript errors and network tab for API request issues 