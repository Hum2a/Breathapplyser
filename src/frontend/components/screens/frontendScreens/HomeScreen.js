import React, { useContext, useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
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
import { getFirestore, deleteDoc, doc, collection, query, getDocs, getDoc } from 'firebase/firestore';
import { UserContext } from '../../../context/UserContext';
import RecentDrinks from './DrinkingScreens/RecentDrinks';
import CommonDrinks from './DrinkingScreens/CommonDrinks';
import UnitTrack from './StatsScreens/UnitTrack';
import SpendingTrack from './StatsScreens/SpendTrack';
import StarAnimation from '../../animations/favouriteStar';
import BeerAnimation from '../../animations/beerjug';
import SpinningCog from '../../animations/settingsCog';
import MedalShimmerAnimation from '../../animations/medalShimmer';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [statUpdateCount, setStatUpdateCount] = useState(0);
  const [bacUpdateCount, setBACUpdateCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [playStarAnimation, setPlayStarAnimation] = useState(false);
  const [playBeerAnimation, setPlayBeerAnimation] = useState(false);
  const [playMedalAnimation, setPlayMedalAnimation] = useState(false);
  const firestore = getFirestore();

  const toggleBeerAnimation = () => {
    setPlayBeerAnimation(!playBeerAnimation);
  };

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
      
          <TouchableWithoutFeedback onPressIn={() => setPlayMedalAnimation(true)} onPressOut={() => { setPlayMedalAnimation(false); NavigateToAchievements(); }}>
            {/* <Image
              source={require('../../../assets/images/medal.png')}
              style={homeStyles.medalIcon}
            /> */}
            <View style={homeStyles.settingsIcon}>
              <MedalShimmerAnimation play={playMedalAnimation} frameRate={24}/>
            </View>
          </TouchableWithoutFeedback>

        </View>

        <View style={homeStyles.topRightContainer}>

          <TouchableOpacity onPress={NavigateToLifeTimeStats} style={homeStyles.settingsIcon}>
          <Image
            source={require('../../../assets/images/lifetime_stats.png')}
            style={homeStyles.medalIcon}
          />
        </TouchableOpacity>
      
          
          <TouchableOpacity style={homeStyles.settingsIcon} onPress={NavigateToSettings}>
            <SpinningCog />
          </TouchableOpacity>

        </View>

      <View style={homeStyles.middleContainer}>

      <TouchableOpacity style={homeStyles.scrollContainer} onPress={NavigateToHistory}>
          <Image
            source={require('../../../assets/images/Scroll.png')}
            style={homeStyles.smallIcon}
          />
        </TouchableOpacity>
        

        <TouchableWithoutFeedback onPressIn={() => setPlayStarAnimation(true)} onPressOut={() => { setPlayStarAnimation(false); NavigateToFavourites(); }}>
            <View style={homeStyles.starContainer}>
                <StarAnimation play={playStarAnimation} frameRate={24} />
            </View>
        </TouchableWithoutFeedback>

        
        <TouchableOpacity onPress={() => { toggleBeerAnimation(); NavigateToDrinking(); }} style={homeStyles.beerContainer}>
          <Text style={homeStyles.buttonText}>Tap to Start Drinking</Text>
          <BeerAnimation frameRate={24} play={playBeerAnimation} />
          <BacWiper />
        </TouchableOpacity>

        <TouchableOpacity style={homeStyles.chartContainer} onPress={NavigateToCharts}>
          <Image
            source={require('../../../assets/images/chart.png')}
            style={homeStyles.smallIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={homeStyles.nightoutContainer} onPress={NavigateToCurrentNight}>
          <Image
            source={require('../../../assets/images/discoball.png')}
            style={homeStyles.smallIcon}
          />
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
