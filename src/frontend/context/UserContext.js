import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Import signOut
import { getFirestore, doc, getDoc, setLogLevel, deleteDoc } from 'firebase/firestore'; // Ensure deleteDoc is imported if you're using it
import { app, auth } from '../../backend/firebase/database/firebase';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const firestore = getFirestore();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const docRef = doc(firestore, "profiles", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userProfile = docSnap.data();
          setUser({ ...firebaseUser, profile: userProfile }); // Combine auth and profile data
        } else {
          setUser(firebaseUser); // Only auth data, no profile
        }
      } else {
        setUser(null);
      }
    });

    const loadUserData = async () => {
      console.log('UserContext.js: Attempting to load user data...');
      if (user) {
        const docRef = doc(firestore, "profiles", user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userProfile = docSnap.data();
            setUser({ ...user, profile: userProfile }); // Update user with Firestore data
            console.log('UserContext.js: User data loaded from Firestore');
          }
        } catch (error) {
          console.error('UserContext.js: Error loading user data from Firestore:', error);
        }
      }
    };

    loadUserData();
    return unsubscribe; // Unsubscribe on unmount
  }, []);

  const logout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase Authentication
      setUser(null); // Set user state to null
      await AsyncStorage.removeItem('userData'); // Optionally clear stored user data if you are using AsyncStorage
      console.log('UserContext.js: User signed out successfully');
    } catch (error) {
      console.error('UserContext.js: Error signing out', error);
    }
  };

  const storeUserData = async (userData) => {
    console.log('UserContext.js: Attempting to store user data:', userData);
    if (user) {
      const docRef = doc(firestore, "profiles", user.uid);
      try {
        await setDoc(docRef, userData.profile); // Store profile data in Firestore
        setUser({ ...user, profile: userData.profile }); // Update local state
        console.log('UserContext.js: User data stored in Firestore');
      } catch (error) {
        console.error('UserContext.js: Error storing user data in Firestore', error);
      }
    }
  };

  const clearUserData = async () => {
    console.log('UserContext.js: Attempting to clear user data...');
    if (user) {
      const docRef = doc(firestore, "profiles", user.uid);
      try {
        await deleteDoc(docRef); // Remove profile data from Firestore
        console.log('UserContext.js: User data cleared from Firestore');
      } catch (error) {
        console.error('UserContext.js: Error clearing user data from Firestore', error);
      }
    }
  
    try {
      await AsyncStorage.removeItem('userData');
      console.log('UserContext.js: User data cleared from AsyncStorage');
      setUser(null);
    } catch (error) {
      console.error('UserContext.js: Error clearing user data from AsyncStorage', error);
    }
  };
  

  return (
    <UserContext.Provider value={{ user, setUser, storeUserData, clearUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);
