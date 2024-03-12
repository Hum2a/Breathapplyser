import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SettingStyles as styles } from '../../../styles/SettingStyles/settingStyles';
import { homeStyles } from '../../../styles/StartUpStyles/homeStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileWaveAnimation from '../../../animations/profileWave';

const Settings = () => {
  const navigation = useNavigation();
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

  return (
    <SafeAreaView style={styles.fullscreen}>
      <View style={styles.container}>
        {/* <TouchableOpacity onPress={navigateToProfile} style={styles.row}>
          <Text style={styles.text}>Profile</Text>
          <Image
              source={require('../../../../assets/images/person.png')}
              style={homeStyles.smallIcon}
          />
        </TouchableOpacity> */}

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
      </View>
    </SafeAreaView>
  );
};


export default Settings;
