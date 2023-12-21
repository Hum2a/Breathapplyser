import firestore from '@react-native-firebase/firestore';

// Example: Adding data to Firestore
const addDataToFirestore = async (data) => {
  try {
    const documentRef = await firestore().collection('myCollection').add(data);
    console.log('Document ID:', documentRef.id);
  } catch (error) {
    console.error('Error adding data to Firestore:', error);
  }
};
