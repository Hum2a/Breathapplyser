import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { omniStyles as styles } from '../../../styles/ChartStyles/omniStyles';
import FatManAnimation from '../../../animations/fatman';
import WalletAnimation from '../../../animations/wallet';
import PenWritingAnimation from '../../../animations/penWriting';
import BloodAnimation from '../../../animations/blood';
import BottleAnimation from '../../../animations/bottle';
import { BackButton } from '../../../buttons/backButton';
import { UserContext } from '../../../../context/UserContext';
import { getFirestore, doc, onSnapshot } from '@firebase/firestore';

const ChartsScreen = ({ navigation }) => {
  const [playFatManAnimation, setPlayFatManAnimation] = useState(true);
  const [playWalletAnimation, setPlayWalletAnimation] = useState(true);
  const [playPenWritingAnimation, setPlayPenWritingAnimation] = useState(true);
  const [playBloodAnimation, setPlayBloodAnimation] = useState(true);
  const [playBottleAnimation, setPlayBottleAnimation] = useState(false);

  const { user } = useContext(UserContext);
  const firestore = getFirestore();

  useEffect(() => {
    if (user) {
      const settingsRef = doc(firestore, user.uid, "Animations");
      const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
        if (docSnap.exists()) {
          const settingsData = docSnap.data();
          // Check if the data contains specific animation settings and update state
          setPlayFatManAnimation(settingsData['Fat Man Animation'] ?? false);
          setPlayWalletAnimation(settingsData['Beer Animation'] ?? false);
          setPlayPenWritingAnimation(settingsData['Pen Writing Animation'] ?? false);
          setPlayBloodAnimation(settingsData['Blood Animation'] ?? false);
          setPlayBottleAnimation(settingsData['Bottle Animation'] ?? false);
        }
      }, (error) => {
        console.error("Failed to listen to animation settings:", error);
      });
  
      return () => unsubscribe(); // Cleanup listener when the component unmounts or user changes
    }
  }, [user, firestore]); // Dependencies array includes Firestore instance and user state
  

  const navigateToChart = (chartType) => {
    navigation.navigate(chartType);
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.graphTitle}> All Charts </Text>
      <TouchableOpacity onPressIn={() => setPlayBloodAnimation(true)} onPressOut={() => { setPlayBloodAnimation(true); navigateToChart('BACCharts'); }}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>BAC Charts</Text>
          <BloodAnimation play={playBloodAnimation} frameRate={45} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigateToChart('DrunkCharts')}>
        <Text style={styles.buttonText}>Drunkenness Charts</Text>
        <Image
          source={require('../../../../assets/images/puke.png')}
          style={styles.smallIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPressIn={() => setPlayFatManAnimation(true)} onPressOut={() => { setPlayFatManAnimation(false); navigateToChart('UnitsCharts'); }}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Units Charts</Text>
          <FatManAnimation play={playFatManAnimation} frameRate={24} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPressIn={() => setPlayWalletAnimation(true)} onPressOut={() => { setPlayWalletAnimation(false); navigateToChart('AmountSpentCharts'); }}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Amount Spent Charts</Text>
          <WalletAnimation play={playWalletAnimation} frameRate={24} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPressIn={() => setPlayBottleAnimation(true)} onPressOut={() => { setPlayBottleAnimation(false); navigateToChart('TypesCharts'); }}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Types Charts</Text>
          <BottleAnimation play={playBottleAnimation} frameRate={24} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPressIn={() => setPlayPenWritingAnimation(true)} onPressOut={() => { setPlayPenWritingAnimation(false); navigateToChart('NamesCharts'); }}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Names Charts</Text>
          <PenWritingAnimation play={playPenWritingAnimation} frameRate={24} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChartsScreen;
