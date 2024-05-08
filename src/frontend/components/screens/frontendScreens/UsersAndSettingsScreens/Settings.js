import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Dialog from 'react-native-dialog';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { SettingStyles as styles } from '../../../styles/SettingStyles/settingStyles';
import { dialogStyles } from '../../../styles/AppStyles/dialogueStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileWaveAnimation from '../../../animations/profileWave';
import MuscleManAnimation from '../../../animations/muscleman';
import PaintRollerAnimation from '../../../animations/paintRoller';
import { UserContext, useUser } from '../../../../context/UserContext';
import { BackButton } from '../../../buttons/backButton';
import { getFirestore, doc, onSnapshot } from '@firebase/firestore';

const Settings = () => {
  const navigation = useNavigation();
  const { logout } = useUser(); // Use the logout function from UserContext
  const [ playProfileWaveAnimation, setPlayProfileWaveAnimation ] = useState(false); 
  const [ playMuscleManAnimation, setPlayMuscleManAnimation] = useState(false);
  const [ playPaintRollerAnimation, setPlayPaintRollerAnimation ] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  const { user } = useContext(UserContext);
  const firestore = getFirestore()
  useEffect(() => {
    if (user) {
      const settingsRef = doc(firestore, user.uid, "Animations");
      const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
        if (docSnap.exists()) {
          const settingsData = docSnap.data();
          // Check if the data contains specific animation settings and update state
          setPlayProfileWaveAnimation(settingsData['Profile Wave Animation'] ?? false);
          setPlayMuscleManAnimation(settingsData['Muscle Man Animation'] ?? false);
          setPlayPaintRollerAnimation(settingsData['Paint Roller Animation'] ?? false);
        }
      }, (error) => {
        console.error("Failed to listen to animation settings:", error);
      });
  
      return () => unsubscribe(); // Cleanup listener when the component unmounts or user changes
    }
  }, [user, firestore]); // Dependencies array includes Firestore instance and user state
  
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

  const navigateToOnlineSettings = () => {
    navigation.navigate('AcceptRankings');
  };

  const showLogoutDialog = () => {
    setLogoutDialogVisible(true);
  };
  
  const handleConfirmLogout = () => {
    logout(); // Call your logout function from UserContext
    // Use CommonActions.reset to clear the navigation stack and navigate to the initial screen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Start' }], // Replace 'Start' with the name of your initial screen
      })
    );
    setLogoutDialogVisible(false);
  };
  
  const handleCancelLogout = () => {
    setLogoutDialogVisible(false);
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
              <MuscleManAnimation play={playMuscleManAnimation} frameRate={30} />
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

      <TouchableOpacity onPress={showLogoutDialog} style={styles.item}>
        <Text style={styles.text}>Logout</Text>
        <Image source={require('../../../../assets/images/logout.png')} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToOnlineSettings} style={styles.item}>
        <Text style={styles.text}>Online</Text>
        <Image source={require('../../../../assets/images/world.png')} style={styles.icon} />
      </TouchableOpacity>

      <Dialog.Container visible={logoutDialogVisible} contentStyle={dialogStyles.container}>
        <Dialog.Title style={dialogStyles.title}>Logout</Dialog.Title>
        <Dialog.Description style={dialogStyles.description}>
          Are you sure you want to log out?
        </Dialog.Description>
        <Dialog.Button label="Cancel" style={dialogStyles.cancelButton} onPress={handleCancelLogout} />
        <Dialog.Button label="Logout" style={dialogStyles.logoutButton} onPress={handleConfirmLogout} />
      </Dialog.Container>

    </SafeAreaView>
  );
};


export default Settings;
