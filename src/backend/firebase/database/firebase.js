import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, updateProfile, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  
};

  const app = initializeApp(firebaseConfig);

  // setLogLevel('debug');

  // const auth = getAuth(app);
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  const firestore = getFirestore(app);

  
  const registerUser = (username, email, password, confirmPassword, dateOfBirth, onSuccess, onFailure) => {
    if (password !== confirmPassword) {
      onFailure({ message: 'Passwords do not match' });
      return;
    }
  
    let userCred; // Declare a variable to hold the userCredential
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        userCred = userCredential; // Store the userCredential in userCred
        // Update the username
        return updateProfile(userCredential.user, { displayName: username }), userCredential.user.uid;
      })
      .then(() => {
        // Now use userCred to access the user's UID
        const userDoc = doc(firestore, userCred.user.uid, "Profile");
        return setDoc(userDoc, { dateOfBirth: dateOfBirth }, { merge: true });
      })
      .then((uid) => {
        onSuccess(uid);
      })
      .catch((error) => {
        onFailure(error);
      });
  };

  export { app, auth, firestore, registerUser };