import React, { useEffect, useState, useContext } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { collection, getFirestore, query, getDocs, getDoc, setDoc, deleteDoc, doc } from 'firebase/firestore';
import { homeStyles } from '../../../styles/StartUpStyles/homeStyles';
import CombinedChart from '../../../charts/linecharts/CombinedChart';
import { UserContext } from '../../../../context/UserContext';

const HomeScreen = ({ navigation }) => {
  console.log('HomeScreen rendered');

  const { user } = useContext(UserContext); // Get the current user from context

  // useEffect(() => {
  //   const firestore = getFirestore();
  //   const userDocRef = doc(firestore, "BAC Level", "currentBAC"); // Replace with actual user ID
  
  //   getDoc(userDocRef)
  //     .then((docSnap) => {
  //       if (!docSnap.exists()) {
  //         // Document does not exist, so create it
  //         setDoc(userDocRef, { currentBAC: 0 })
  //           .then(() => {
  //             console.log("currentBAC set to 0 for the user");
  //           })
  //           .catch((error) => {
  //             console.error("Error setting currentBAC:", error);
  //           });
  //       } else {
  //         // Document already exists, do nothing
  //         console.log("currentBAC already exists for the user");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error checking currentBAC document:", error);
  //     });
  // }, []);
  


  const [chartData, setChartData] = useState([]);
  console.log('State initialized: chartData', chartData);
  
  const handleStartDrinking = () => {
    navigation.navigate('StartDrinking');
  };

  const handleAddEntry = () => {
    navigation.navigate('AddEntry');
  };

  const handleViewEntries = () => {
    navigation.navigate('ViewEntries');
  };

  const handleClearEntries = async () => {
    const firestore = getFirestore();
    const entriesRef = collection(firestore, 'entries');
    const q = query(entriesRef);
  
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(firestore, 'entries', document.id));
      });
      console.log('All entries cleared from Firestore');
    } catch (error) {
      console.error('Error clearing entries:', error);
    }
  };

  const handleClearBAC = async () => {
    const firestore = getFirestore();
    const bacRef = collection(firestore, 'BAC Level');
    const q = query(bacRef);
  
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(firestore, 'BAC Level', document.id));
      });
      console.log('All bac entries cleared from Firestore');
    } catch (error) {
      console.error('Error clearing entries:', error);
    }
  };

  const handleHistory = () => {
    navigation.navigate('History');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleDelete = () => {
    deleteAllData();
  };
  const handleViewCharts = () => {
    navigation.navigate('Charts');
  }
  const handleHome2 = () => {
    navigation.navigate('Home2');
  }

  console.log('Rendering UI components');

  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.title}>Breathapplyser</Text>

      <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleHome2}><Text>Home 2</Text></TouchableOpacity>

      {/* Chart */}
      {chartData.length > 1 ? (
        <CombinedChart style={homeStyles.chart} />
      ) : (
        <Text>No data</Text>
      )}

      {/* Buttons */}
      <View style={homeStyles.buttonRow}>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleStartDrinking}>
          <Text style={homeStyles.buttonText}>Start Drinking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleAddEntry}>
          <Text style={homeStyles.buttonText}>Add Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleViewEntries}>
          <Text style={homeStyles.buttonText}>View Entries</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleViewCharts}>
          <Text style={homeStyles.buttonText}>View Charts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleClearEntries}>
          <Text style={homeStyles.buttonText}>Clear Entries</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleClearBAC}>
          <Text style={homeStyles.buttonText}>Clear BAC</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleHistory}>
          <Text style={homeStyles.buttonText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleProfile}>
          <Text style={homeStyles.buttonText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeStyles.buttonContainer} onPress={handleSettings}>
          <Text style={homeStyles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
