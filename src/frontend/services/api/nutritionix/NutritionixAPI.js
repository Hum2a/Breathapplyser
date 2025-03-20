import { NUTRITIONIX_API_KEY, NUTRITIONIX_API_URL } from '@env';

// Function to make a GET request to the Nutritionix API
export const fetchNutritionData = async (query) => {
  try {
    const response = await fetch(`${NUTRITIONIX_API_URL}search/instant?query=${query}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': NUTRITIONIX_API_KEY,
        'x-app-key': NUTRITIONIX_API_KEY,
        'Authorization': `Bearer ${NUTRITIONIX_API_KEY}`, // Add this line to include the API key as a bearer token
      },
    });

    // Rest of the code...
  } catch (error) {
    console.log('Error making API request:', error);
    return null;
  }
};
