import React, { useState, useEffect } from 'react';
import './src/backend/firebase/database/firebase';
import AppNavigation from './src/frontend/components/navigation/navigation';
import { UserProvider } from './src/frontend/context/UserContext';
import createNotificationChannel from './src/backend/app/notifications/PNCC';

const App = () => {

  useEffect(() => {
    // Create the notification channel
    createNotificationChannel();
  }, []);
 
  return (
    <UserProvider>
      <AppNavigation />
    </UserProvider>
  );
};

export default App;
