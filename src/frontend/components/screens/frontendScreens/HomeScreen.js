import React, { useContext, useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { homeStyles } from '../../styles/StartUpStyles/homeStyles';
import StatsScreen from './StatsScreens/TodaysStats';
import BACDecrease from '../../../../backend/app/background/BAC/bacDecreaser';
import { getFirestore, deleteDoc, doc, collection, query, getDocs } from 'firebase/firestore';
import { UserContext } from '../../../context/UserContext';
import RecentDrinks from './DrinkingScreens/RecentDrinks';
import CommonDrinks from './DrinkingScreens/CommonDrinks';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [statUpdateCount, setStatUpdateCount] = useState(0);
  const [bacUpdateCount, setBACUpdateCount] = useState(0);

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

  const NavigateToOnlineRankings = () => {
    navigation.navigate('Rankings');
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
    // Set up an interval to update the component every 1 minute (adjust the interval as needed)
    const interval = setInterval(() => {
      // Increment the update count to trigger a re-render of StatsScreen
      setStatUpdateCount(prevCount => prevCount + 1);
      setBACUpdateCount(prevBacCount => prevBacCount + 1);
    }, 60000); // 1 minute interval

    return () => clearInterval(interval); // Clean up the interval when the component unmounts
  }, []);

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.statsAndAchievementsContainer}>
        {/* <StatsScreen key={statUpdateCount} /> */}
        <BACDecrease user={user} key={bacUpdateCount} />
      </View>

    <View style={homeStyles.drinksWidgetContainer}>
      <CommonDrinks />
      <RecentDrinks navigation={navigation} />
    </View>
    <TouchableOpacity onPress={NavigateToDrinking} style={homeStyles.beerContainer}>
      <Image
        source={require('../../../assets/images/Beer_Jug.png')}
        style={homeStyles.beer}
      />
      <Text style={homeStyles.buttonText}>Tap to Start Drinking</Text>
    </TouchableOpacity>

      <View style={homeStyles.bottomContainer}>
        <View style={homeStyles.buttonRow}>
          <TouchableOpacity style={homeStyles.buttonContainer} onPress={NavigateToHistory}>
            <Image
              source={require('../../../assets/images/Scroll.png')}
              style={homeStyles.smallIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.buttonContainer} onPress={NavigateToSettings}>
            <Image
              source={require('../../../assets/images/gear.png')}
              style={homeStyles.smallIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.buttonContainer} onPress={NavigateToCharts}>
            <Image
              source={require('../../../assets/images/chart.png')}
              style={homeStyles.smallIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.buttonContainer} onPress={NavigateToFavourites}>
            <Image
              source={require('../../../assets/images/heart.png')}
              style={homeStyles.smallIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.buttonContainer} onPress={NavigateToAllStats}>
            <Image
              source={require('../../../assets/images/stats.png')}
              style={homeStyles.smallIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.buttonContainer} onPress={NavigateToCurrentNight}>
            <Image
              source={require('../../../assets/images/discoball.png')}
              style={homeStyles.smallIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={homeStyles.buttonRow}>
          <TouchableOpacity onPress={NavigateToAchievements} style={homeStyles.smallCircularButton}>
            <Image
              source={require('../../../assets/images/medal.png')}
              style={homeStyles.smallIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={NavigateToOnlineRankings} style={homeStyles.smallCircularButton}>
            <Image
              source={require('../../../assets/images/world.png')}
              style={homeStyles.smallIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleClearBAC}>
          <Text style={homeStyles.buttonText}>Clear BAC</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
