import React, { useState, useEffect } from 'react';
import './src/backend/firebase/database/firebase';
import AppNavigation from './src/frontend/components/navigation/navigation';
import { UserProvider } from './src/frontend/context/UserContext';

const App = () => {

  // window.navigator.userAgent = "ReactNative";
 
  return (
    <UserProvider>
      <AppNavigation />
    </UserProvider>
  );
};

export default App;
