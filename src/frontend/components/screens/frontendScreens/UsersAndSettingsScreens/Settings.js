import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Alert } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { SettingStyles as styles } from '../../../styles/SettingStyles/settingStyles';
import { homeStyles } from '../../../styles/StartUpStyles/homeStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileWaveAnimation from '../../../animations/profileWave';
import { useUser } from '../../../../context/UserContext';

const Settings = () => {
  const navigation = useNavigation();
  const { logout } = useUser(); // Use the logout function from UserContext
  const [ playProfileWaveAnimation, setPlayProfileWaveAnimation ] = useState(false); 

  const navigateToProfile = () => {
    navigation.navigate('Profile'); // Replace 'Profile' with your actual profile screen name
  };

  const navigateToLimits = () => {
    navigation.navigate('Limits'); // Replace 'Limits' with your actual limits screen name
  };

  const navigateToThemes = () => {
    navigation.navigate('Themes'); // Replace 'Themes' with your actual themes screen name
  };

  const navigateToNotifications = () => {
    navigation.navigate('NotificationManger'); // Replace 'Notifications' with your actual notifications screen name
  };

  const navigateToData = () => {
    navigation.navigate('DataManager');
  }

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout", onPress: () => {
            logout(); // Call your logout function from the UserContext
            // Use CommonActions.reset to clear the navigation stack and navigate to the initial screen
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Start' }], // Replace 'InitialScreenName' with the name of your initial screen
              })
            );
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.fullscreen}>
      <View style={styles.container}>

        <TouchableWithoutFeedback onPressIn={() => setPlayProfileWaveAnimation(true)} onPressOut={() => { setPlayProfileWaveAnimation(false); navigateToProfile(); } } style={styles.row}>
          <View style={styles.row}>
              <Text style={styles.text}>Profile</Text>
              <ProfileWaveAnimation play={playProfileWaveAnimation} frameRate={24} />
          </View>
        </TouchableWithoutFeedback>


        <TouchableOpacity onPress={navigateToLimits} style={styles.row}>
          <Text style={styles.text}>Limits</Text>
          <Image
              source={require('../../../../assets/images/goku_screaming.png')}
              style={homeStyles.smallIcon}
              />
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToThemes} style={styles.row}>
          <Text style={styles.text}>Themes</Text>
          <Image
              source={require('../../../../assets/images/themes.png')}
              style={homeStyles.smallIcon}
              />
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToNotifications} style={styles.row}>
          <Text style={styles.text}>Notifications</Text>
          <Image
              source={require('../../../../assets/images/notification.png')}
              style={homeStyles.smallIcon}
              />
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToData} style={styles.row}>
          <Text style={styles.text}>Data</Text>
          <Image
              source={require('../../../../assets/images/file.png')}
              style={homeStyles.smallIcon}
              />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.row}>
          <Text style={styles.text}>Logout</Text>
          <Image
            source={require('../../../../assets/images/logout.png')} // Update this path to your actual logout icon
            style={homeStyles.smallIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


export default Settings;
