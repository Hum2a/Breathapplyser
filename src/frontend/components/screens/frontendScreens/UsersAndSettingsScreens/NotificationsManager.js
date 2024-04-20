import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firebase Firestore functions
import { notificationCategories } from '../../../../assets/lists/dropdownData';
import { notifStyles as styles } from '../../../styles/SettingStyles/notifStyles';
import { UserContext } from '../../../../context/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appStyles } from '../../../styles/AppStyles/appStyles';
import { BackButton } from '../../../buttons/backButton';

const NotificationManager = () => {
  const [notificationSettings, setNotificationSettings] = useState({});
  const [openCategories, setOpenCategories] = useState({});

  const firestore = getFirestore(); // Initialize Firestore
  const { user } = useContext(UserContext);

  // Function to save notification settings to Firestore
  const saveNotificationSettings = async () => {
    try {
      console.log('Saving notification settings to Firestore');
      // Save to Firestore (adjust the document path as needed)
      const userDocRef = doc(firestore, user.uid, "Notification Preferences");
      await setDoc(userDocRef, { ...notificationSettings }, { merge: true }); // Use spread to remove "notificationSettings" category
      console.log('Notification settings saved to Firestore');
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  // Function to load notification settings from Firestore
  const loadNotificationSettings = async () => {
    try {
      console.log('Loading notification settings from Firestore');
      // Load from Firestore (adjust the document path as needed)
      const userDocRef = doc(firestore, user.uid, "Notification Preferences");
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const firestoreSettings = docSnapshot.data();
        if (firestoreSettings) {
          setNotificationSettings(firestoreSettings);
          console.log('Notification settings loaded from Firestore');
        }
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  // Load notification settings when the component mounts
  useEffect(() => {
    loadNotificationSettings();
  }, []);

  // Toggle category open/close state
  const toggleCategory = (category) => {
    setOpenCategories((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const toggleNotification = async (category, type) => {
    try {
      console.log(`Toggling notification: ${category} - ${type}`);
      const updatedSettings = { ...notificationSettings };
      if (!updatedSettings[category]) {
        updatedSettings[category] = {};
      }
      updatedSettings[category][type] = !updatedSettings[category]?.[type];
      setNotificationSettings(updatedSettings);
      await saveNotificationSettings(); // Save the updated settings to Firestore
      console.log(`Notification toggled: ${category} - ${type}`);
    } catch (error) {
      console.error('Error toggling notification:', error);
    }
  };

  return (
    <SafeAreaView style={appStyles.fullScreen}>
      <ScrollView style={styles.container}>
        {notificationCategories.map((categoryObj) => (
          <View key={categoryObj.category}>
            <TouchableOpacity
              onPress={() => toggleCategory(categoryObj.category)}
            >
              <Text style={styles.categoryHeader}>{categoryObj.category}</Text>
            </TouchableOpacity>
            {openCategories[categoryObj.category] && categoryObj.types.map((type) => (
              <View key={type} style={styles.notificationItem}>
                <Text style={styles.notificationText}>{type}</Text>
                <Switch 
                  value={notificationSettings[categoryObj.category]?.[type] || false}
                  onValueChange={() => toggleNotification(categoryObj.category, type)}
                  style={styles.switchContainer}
                />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationManager;
