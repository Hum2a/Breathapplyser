const API_KEY = '7c1fa9807ccaedf7e0df883d63cf23f7';
const API_URL = 'https://trackapi.nutritionix.com/v2/';

// Function to make a GET request to the Nutritionix API
export const fetchNutritionData = async (query) => {
  try {
    const response = await fetch(`${API_URL}search/instant?query=${query}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': API_KEY,
        'x-app-key': API_KEY,
        'Authorization': `Bearer ${API_KEY}`, // Add this line to include the API key as a bearer token
      },
    });

    // Rest of the code...
  } catch (error) {
    console.log('Error making API request:', error);
    return null;
  }
};
