import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { SettingStyles as styles } from '../../../styles/SettingStyles/settingStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileWaveAnimation from '../../../animations/profileWave';
import MuscleManAnimation from '../../../animations/muscleman';
import PaintRollerAnimation from '../../../animations/paintRoller';
import { useUser } from '../../../../context/UserContext';
import { BackButton } from '../../../buttons/backButton';

const Settings = () => {
  const navigation = useNavigation();
  const { logout } = useUser(); // Use the logout function from UserContext
  const [ playProfileWaveAnimation, setPlayProfileWaveAnimation ] = useState(false); 
  const [ playMuscleManAnimation, setPlayMuscleManAnimation] = useState(false);
  const [ playPaintRollerAnimation, setPlayPaintRollerAnimation ] = useState(true);

  const navigateToProfile = () => {
    navigation.navigate('Profile'); // Replace 'Profile' with your actual profile screen name
  };

  const navigateToLimits = () => {
    navigation.navigate('Limits'); // Replace 'Limits' with your actual limits screen name
  };

  const navigateToNotifications = () => {
    navigation.navigate('NotificationManger'); // Replace 'Notifications' with your actual notifications screen name
  };

  const navigateToData = () => {
    navigation.navigate('DataManager');
  };

  const navigateToAlcoholics = () => {
    navigation.navigate('Alcoholics');
  };

  const navigateToDisplay = () => {
    navigation.navigate('Display');
  };

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
    <SafeAreaView style={styles.container}>
      <BackButton />
        <TouchableOpacity
         onPressIn={() => setPlayProfileWaveAnimation(true)}
         onPressOut={() => { setPlayProfileWaveAnimation(false); navigateToProfile(); } }>
          <View style={styles.item}>
              <Text style={styles.text}>Profile</Text>
              <ProfileWaveAnimation play={playProfileWaveAnimation} frameRate={30} />
          </View>
        </TouchableOpacity>

      <TouchableOpacity
         onPressIn={() => setPlayMuscleManAnimation(true)}
         onPressOut={() => { setPlayMuscleManAnimation(false); navigateToLimits(); } }>
          <View style={styles.item}>
              <Text style={styles.text}>Limits</Text>
              <MuscleManAnimation play={playMuscleManAnimation} frameRate={60} />
          </View>
        </TouchableOpacity>

      <TouchableOpacity onPress={navigateToAlcoholics} style={styles.item}>
        <Text style={styles.text}>Alcoholics</Text>
        <Image source={require('../../../../assets/images/timer.png')} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity
         onPressIn={() => setPlayPaintRollerAnimation(true)}
         onPressOut={() => { setPlayPaintRollerAnimation(false); navigateToDisplay(); } }>
          <View style={styles.item}>
              <Text style={styles.text}>Display</Text>
              <PaintRollerAnimation play={playPaintRollerAnimation} frameRate={60} />
          </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToNotifications} style={styles.item}>
        <Text style={styles.text}>Notifications</Text>
        <Image source={require('../../../../assets/images/notification.png')} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToData} style={styles.item}>
        <Text style={styles.text}>Data</Text>
        <Image source={require('../../../../assets/images/file.png')} style={styles.fileManagerIcon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.item}>
        <Text style={styles.text}>Logout</Text>
        <Image source={require('../../../../assets/images/logout.png')} style={styles.icon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};


export default Settings;
