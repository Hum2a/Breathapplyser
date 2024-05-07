import React, { useContext, useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import { homeStyles } from '../../styles/StartUpStyles/homeStyles';
import { appStyles } from '../../styles/AppStyles/appStyles';
import StatsScreen from './StatsScreens/TodaysStats';
import BACDecrease from '../../../../backend/app/background/BAC/bacDecreaser';
import BACDecreaseFB from '../../../../backend/app/background/BAC/bacDecreaserFB';
import DrunkennessLevelFb from '../../../../backend/app/background/Drunkness/drunknessCalculatorFb';
import BacWiper from '../../../../backend/app/background/BAC/bacWiper';
import BacCleaner from '../../../../backend/app/background/BAC/bacCleaner';
import { getFirestore, deleteDoc, doc, collection, query, getDocs, getDoc, onSnapshot } from 'firebase/firestore';
import { UserContext } from '../../../context/UserContext';
import RecentDrinks from './DrinkingScreens/RecentDrinks';
import CommonDrinks from './DrinkingScreens/CommonDrinks';
import UnitTrack from './StatsScreens/UnitTrack';
import SpendingTrack from './StatsScreens/SpendTrack';
import StarAnimation from '../../animations/favouriteStar';
import BeerAnimation from '../../animations/beerjug';
import SpinningCog from '../../animations/settingsCog';
import MedalShimmerAnimation from '../../animations/medalShimmer';
import DiscoBallAnimation from '../../animations/discoBall';
import ScrollAnimation from '../../animations/scroll';
import ChartAnimation from '../../animations/chart';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [statUpdateCount, setStatUpdateCount] = useState(0);
  const [bacUpdateCount, setBACUpdateCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [playStarAnimation, setPlayStarAnimation] = useState(true);
  const [playBeerAnimation, setPlayBeerAnimation] = useState(true);
  const [playMedalAnimation, setPlayMedalAnimation] = useState(true);
  const [playDiscoBallAnimation, setPlayDiscoBallAnimation ] = useState(true);
  const [playScrollAnimation, setPlayScrollAnimation ] = useState(true);
  const [playSettingsAnimation, setPlaySettingsAnimation ] = useState(true);
  const [playChartAnimation, setPlayChartAnimation ] = useState(true);
  const firestore = getFirestore();

  useEffect(() => {
    if (user) {
      const settingsRef = doc(firestore, user.uid, "Animations");
      const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
        if (docSnap.exists()) {
          const settingsData = docSnap.data();
          // Check if the data contains specific animation settings and update state
          setPlayStarAnimation(settingsData['Star Animation'] ?? false);
          setPlayBeerAnimation(settingsData['Beer Animation'] ?? false);
          setPlayMedalAnimation(settingsData['Medal Animation'] ?? false);
          setPlayDiscoBallAnimation(settingsData['Disco Ball Animation'] ?? false);
          setPlayScrollAnimation(settingsData['Scroll Animation'] ?? false);
          setPlaySettingsAnimation(settingsData['Settings Animation'] ?? false);
          setPlayChartAnimation(settingsData['Chart Animation'] ?? false);
        }
      }, (error) => {
        console.error("Failed to listen to animation settings:", error);
      });
  
      return () => unsubscribe(); // Cleanup listener when the component unmounts or user changes
    }
  }, [user, firestore]); // Dependencies array includes Firestore instance and user state
  

  const NavigateToDrinking = () => {
    navigation.navigate('AddEntry');
  };

  const NavigateToHistory = () => {
    navigation.navigate('History'); 
  };

  const NavigateToSettings = () => {
    navigation.navigate("Settings");
  };

  const NavigateToCharts = () => {
    navigation.navigate("Charts");
  };

  const NavigateToFavourites = () => {
    navigation.navigate("Favourites")
  }

  const NavigateToTodaysStats = () => {
    navigation.navigate("TodaysStats")
  }

  const NavigateToAllStats = () => {
    navigation.navigate("AllStats")
  }

  const NavigateToCurrentNight = () => {
    navigation.navigate("CurrentNight")
  }
  const NavigateToAchievements = () => {
    navigation.navigate('Achievements');
  };

  const NavigateToLifeTimeStats = () => {
    navigation.navigate('LifeTimeStats');
  };

  const NavigateToOnlineRankings = async () => {
    const userDocRef = doc(firestore, 'Users', user.uid);
  
    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        // Document exists, navigate to the rankings screen
        navigation.navigate('Rankings');
      } else {
        // No document found, navigate to AcceptOnlineRankings screen
        navigation.navigate('AcceptRankings');
      }
    } catch (error) {
      console.error('Error checking user document:', error);
      // Handle any errors, such as showing an error message or defaulting to a specific screen
    }
  }  

  const handleClearBAC = async () => {
    const firestore = getFirestore();
    const bacRef = collection(firestore, user.uid, 'Alcohol Stuff', 'BAC Level');
    const q = query(bacRef);
  
    try {
      const querySnapshot = await getDocs(q);
      const numEntriesCleared = querySnapshot.size; // Get the number of entries cleared
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(firestore, user.uid, 'Alcohol Stuff', 'BAC Level', document.id));
      });
      console.log(`Cleared ${numEntriesCleared} bac entries from Firestore`);
    } catch (error) {
      console.error('Error clearing entries:', error);
    }
  };

  useEffect(() => {
    // Set up an interval to update the component every 5 seconds
    const interval = setInterval(() => {
      setStatUpdateCount(prevCount => prevCount + 1);
      setBACUpdateCount(prevBacCount => prevBacCount + 1);
      setRefreshKey(prevKey => prevKey + 1);
      console.log('HomeScreen refreshed at:', new Date().toLocaleTimeString());
    }, 60000); // 5000 milliseconds = 5 seconds

    return () => clearInterval(interval); // Clean up the interval when the component unmounts
  }, []);  

  return (
    <SafeAreaView style={appStyles.fullScreen}>
      <View style={homeStyles.container}>
        <BACDecreaseFB user={user} key={refreshKey} />
        {/* <BacCleaner /> */}

        <View style={homeStyles.trackContainer}>
          <UnitTrack />
          <SpendingTrack />
        </View>

                {/* Drunkenness Level Display */}
        <View style={homeStyles.drunkennessContainer}>
          <DrunkennessLevelFb />
        </View>

        <View style={homeStyles.topLeftContainer}>
          
        <TouchableOpacity onPress={NavigateToOnlineRankings} style={homeStyles.settingsIcon}>
          <Image
            source={require('../../../assets/images/world.png')}
            style={homeStyles.medalIcon}
          />
        </TouchableOpacity>
      
          <TouchableOpacity onPressIn={() => setPlayMedalAnimation(true)} onPressOut={() => { setPlayMedalAnimation(false); NavigateToAchievements(); }}>
            <View style={homeStyles.settingsIcon}>
              <MedalShimmerAnimation play={playMedalAnimation} frameRate={60}/>
            </View>
          </TouchableOpacity>

        </View>

        <View style={homeStyles.topRightContainer}>

          <TouchableOpacity onPress={NavigateToLifeTimeStats} style={homeStyles.settingsIcon}>
          <Image
            source={require('../../../assets/images/lifetime_stats.png')}
            style={homeStyles.medalIcon}
          />
        </TouchableOpacity>
      
          
          <TouchableOpacity style={homeStyles.settingsIcon} onPress={NavigateToSettings}>
            <SpinningCog play={playSettingsAnimation} />
          </TouchableOpacity>

        </View>

      <View style={homeStyles.middleContainer}>

      <TouchableOpacity onPressIn={() => setPlayScrollAnimation(true)} onPressOut={() => { setPlayScrollAnimation(false); NavigateToHistory(); }}>
            <View style={homeStyles.scrollContainer}>
                <ScrollAnimation play={playScrollAnimation} frameRate={24} />
            </View>
        </TouchableOpacity>
        

        <TouchableOpacity onPressIn={() => setPlayStarAnimation(true)} onPressOut={() => { setPlayStarAnimation(false); NavigateToFavourites(); }}>
            <View style={homeStyles.starContainer}>
                <StarAnimation play={playStarAnimation} frameRate={24} />
            </View>
        </TouchableOpacity>

        
        <TouchableOpacity onPressIn={() => setPlayBeerAnimation(true)} onPressOut={() => { setPlayBeerAnimation(false); NavigateToDrinking(); }} style={homeStyles.beerContainer}>
          <Text style={homeStyles.buttonText}>Tap to Start Drinking</Text>
          <BeerAnimation frameRate={24} play={playBeerAnimation} />
          <BacWiper />
        </TouchableOpacity>

        <TouchableOpacity onPressIn={() => setPlayChartAnimation(true)} onPressOut={() => { setPlayChartAnimation(false); NavigateToCharts(); }}>
          <View style={homeStyles.chartContainer}>
            <ChartAnimation play={playChartAnimation} frameRate={24} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPressIn={() => setPlayDiscoBallAnimation(true)} onPressOut={() => { setPlayDiscoBallAnimation(false); NavigateToCurrentNight(); }}>
            <View style={homeStyles.nightoutContainer}>
                <DiscoBallAnimation play={playDiscoBallAnimation} frameRate={24} />
            </View>
        </TouchableOpacity>
        

      </View>

      <View style={homeStyles.drinksWidgetContainer}>
          <CommonDrinks />
          <RecentDrinks navigation={navigation} />
        </View>

        {/* <View style={homeStyles.bottomContainer}>

          <TouchableOpacity style={homeStyles.buttonContainer} onPress={NavigateToAllStats}>
              <Image
                source={require('../../../assets/images/stats.png')}
                style={homeStyles.smallIcon}
              />
             </TouchableOpacity>
            

            <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleClearBAC}>
            <Text style={homeStyles.buttonText}>Clear BAC</Text>
          </TouchableOpacity>
          </View> */}
        </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
