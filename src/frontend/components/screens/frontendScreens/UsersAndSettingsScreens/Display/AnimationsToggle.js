import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { UserContext } from '../../../../../context/UserContext';
import { DisplayStyles as styles } from '../../../../styles/SettingStyles/displayStyles';
import BeerAnimation from '../../../../animations/beerjug';
import BloodAnimation from '../../../../animations/blood';
import DiscoBallAnimation from '../../../../animations/discoBall';
import FatManAnimation from '../../../../animations/fatman';
import StarAnimation from '../../../../animations/favouriteStar';
import MedalShimmerAnimation from '../../../../animations/medalShimmer';
import MuscleManAnimation from '../../../../animations/muscleman';
import PaintRollerAnimation from '../../../../animations/paintRoller';
import PenWritingAnimation from '../../../../animations/penWriting';
import ProfileWaveAnimation from '../../../../animations/profileWave';
import SettingsCogAnimation from '../../../../animations/settingsCog';
import WalletAnimation from '../../../../animations/wallet';
import ScrollAnimation from '../../../../animations/scroll';
import BottleAnimation from '../../../../animations/bottle';
import ChartAnimation from '../../../../animations/chart';

const animationComponents = {
  'Star Animation': StarAnimation,
  'Beer Animation': BeerAnimation,
  'Medal Animation': MedalShimmerAnimation,
  'Disco Ball Animation': DiscoBallAnimation,
  'Scroll Animation': ScrollAnimation,
  'Settings Animation': SettingsCogAnimation,
  'Paint Roller Animation': PaintRollerAnimation,
  'Blood Animation': BloodAnimation,
  'Fat Man Animation': FatManAnimation,
  'Muscle Man Animation': MuscleManAnimation,
  'Pen Writing Animation': PenWritingAnimation,
  'Profile Wave Animation': ProfileWaveAnimation,
  'Wallet Animation': WalletAnimation,
  'Bottle Animation': BottleAnimation,
  'Chart Animation': ChartAnimation
};

const AnimationsToggle = () => {
  const { user } = useContext(UserContext);
  const firestore = getFirestore();
  const [animationSettings, setAnimationSettings] = useState(Object.keys(animationComponents).reduce((acc, anim) => ({ ...acc, [anim]: true }), {}));

  useEffect(() => {
    const fetchAnimationsSetting = async () => {
      if (!user) return;

      const userDocRef = doc(firestore, user.uid, 'Animations');
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setAnimationSettings(prevSettings => ({ ...prevSettings, ...docSnap.data() }));
        }
      } catch (error) {
        console.error('Error fetching animations setting:', error);
      }
    };

    fetchAnimationsSetting();
  }, [user]);

  const handleToggle = async (animName, enabled) => {
    setAnimationSettings(prev => ({ ...prev, [animName]: enabled }));
    if (user) {
      const userDocRef = doc(firestore, user.uid, 'Animations');
      await setDoc(userDocRef, { [animName]: enabled }, { merge: true });
      console.log(`Animation ${animName} setting updated to ${enabled}`);
    }
  };

  const toggleAllAnimations = async (enable) => {
    const newSettings = Object.keys(animationSettings).reduce((acc, anim) => {
      acc[anim] = enable;
      return acc;
    }, {});
  
    setAnimationSettings(newSettings);
  
    if (user) {
      const userDocRef = doc(firestore, user.uid, 'Animations');
      await setDoc(userDocRef, newSettings, { merge: true });
      console.log(`All animations settings updated to ${enable}`);
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Animations:</Text>
      <Text style={styles.warning}>Device may lag if all are turned on</Text>
      <View style={styles.toggleAllContainer}>
        <TouchableOpacity
          style={styles.toggleAllButton}
          onPress={() => toggleAllAnimations(true)}
        >
          <Text style={styles.toggleAllButtonText}>Enable All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toggleAllButton}
          onPress={() => toggleAllAnimations(false)}
        >
          <Text style={styles.toggleAllButtonText}>Disable All</Text>
        </TouchableOpacity>
      </View>
      {Object.keys(animationComponents).map(anim => {
        const AnimationComponent = animationComponents[anim];
        return (
          <View key={anim} style={styles.option}>
            <Text style={styles.label}>{anim}:</Text>
            <AnimationComponent play={animationSettings[anim]} frameRate={30} />
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, animationSettings[anim] && styles.selectedButton]}
                onPress={() => handleToggle(anim, true)}
              >
                <Text style={styles.toggleButtonText}>Infinitely</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, !animationSettings[anim] && styles.selectedButton]}
                onPress={() => handleToggle(anim, false)}
              >
                <Text style={styles.toggleButtonText}>Only When Pressed</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
  
};

export default AnimationsToggle;
