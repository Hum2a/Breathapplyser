import React, { useEffect } from 'react';
import './src/backend/firebase/database/firebase';
import { UserProvider } from './src/frontend/context/UserContext';
import createNotificationChannel from './src/backend/app/notifications/PNCC';
import AuthChecker from './src/backend/firebase/auth/AuthChecker'; // Import the new AuthChecker component

const App = () => {

  useEffect(() => {
    // Create the notification channel
    createNotificationChannel();
  }, []);

  return (
    <UserProvider>
      <AuthChecker />
    </UserProvider>
  );
};

export default App;
