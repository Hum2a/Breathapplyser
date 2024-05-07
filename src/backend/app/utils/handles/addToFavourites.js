import { getFirestore, addDoc, doc, setDoc, collection, getDocs } from 'firebase/firestore';
import moment from 'moment';

// Function to add a drink to favorites
export const addEntryToFavourites = async (user, drinkData) => {
  if (!user) {
    console.error("User data is not available");
    return;
  }

  const firestore = getFirestore();
  const favoritesCollectionRef = collection(firestore, user.uid, "Alcohol Stuff", "Favourites");

  try {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;
    const documentString = `Favourite ${formattedDate}`;
    

    // Add a new document to the "Favourites" collection with the custom document ID
    await setDoc(doc(favoritesCollectionRef, documentString), {
      Alcohol: drinkData.alcohol,
      Amount: drinkData.amount,
      Price: drinkData.price,
      Type: drinkData.type,
      Units: drinkData.units,
    });

    console.log('Drink added to favorites successfully');
  } catch (error) {
    console.error('Error adding drink to favorites:', error);
  }
};

export const addNewFavourite = async (user, favoriteData) => {
  if (!user) {
    console.error("User is not authenticated.");
    return;
  }

  // Ensure a venue is selected
  if (!favoriteData.VenueId) {
    console.error("No venue selected for the favorite.");
    return;
  }

  try {
    const firestore = getFirestore();
    // Update the path to include the VenueId
    const favoritesCollection = collection(firestore, user.uid, "Alcohol Stuff", "Venues", favoriteData.VenueId, "Favourites");

    // Generate a new document name following the desired structure
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;
    const documentString = `Favourite ${formattedDate}`;

    // Create a reference to the new document under the specified venue
    const newFavouriteDoc = doc(favoritesCollection, documentString);

    // Set the favorite data for the new document, excluding the VenueId from being saved in the document
    const { VenueId, ...restFavoriteData } = favoriteData;
    await setDoc(newFavouriteDoc, restFavoriteData);

    // Handle success or any other necessary actions
    console.log('New favorite added successfully.');
  } catch (error) {
    console.error('Error adding new favorite:', error);
  }
};


