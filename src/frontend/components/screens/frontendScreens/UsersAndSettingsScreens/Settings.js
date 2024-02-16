import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { homeStyles } from '../../../styles/StartUpStyles/homeStyles';

const Settings = () => {
  const navigation = useNavigation();

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
    <View style={styles.container}>
      <TouchableOpacity onPress={navigateToProfile} style={styles.row}>
        <Text style={styles.text}>Profile</Text>
        <Image
            source={require('../../../../assets/images/person.png')}
            style={homeStyles.smallIcon}
        />
      </TouchableOpacity>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 12,
  },
  text: {
    fontSize: 18,
  },
});

export default Settings;
