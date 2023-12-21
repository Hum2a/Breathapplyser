import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      console.log('UserContext.js: Attempting to load user data...');
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        console.log('UserContext.js: User data fetched:', userDataString);
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          console.log('UserContext.js: User data parsed:', userData);
          setUser(userData);
        }
      } catch (error) {
        console.error('UserContext.js: Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const storeUserData = async (userData) => {
    console.log('UserContext.js: Attempting to store user data:', userData);
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('UserContext.js: User data stored successfully');
      setUser(userData);
    } catch (error) {
      console.error('UserContext.js: Error saving user data', error);
    }
  };

  const clearUserData = async () => {
    console.log('UserContext.js: Attempting to clear user data...');
    try {
      await AsyncStorage.removeItem('userData');
      console.log('UserContext.js: User data cleared successfully');
      setUser(null);
    } catch (error) {
      console.error('UserContext.js: Error clearing user data', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, storeUserData, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
