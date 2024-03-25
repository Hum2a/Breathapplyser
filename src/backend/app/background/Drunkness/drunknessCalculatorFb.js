import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { UserContext } from '../../../../frontend/context/UserContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { DrunkCalcStyles as styles } from '../../../../frontend/components/styles/DrinkingStyles/drunkCalcStyles';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';

const refreshInterval = 10000; // Refresh interval in milliseconds

const getTextColor = (bac) => {
    if (isNaN(bac)) return 'black'
    if (bac <= 0.01) return '#14ABFF'; // Light Blue
    if (bac <= 0.10) return '#00c853'; // Greenish
    if (bac <= 0.15) return '#64dd17'; // Light green
    if (bac <= 0.20) return '#aeea00'; // Lime
    if (bac <= 0.25) return '#ffd600'; // Yellow
    if (bac <= 0.30) return '#ffab00'; // Amber
    if (bac <= 0.35) return '#ff6d00'; // Orange
    if (bac <= 0.40) return '#dd2c00'; // Deep orange
    if (bac <= 0.45) return '#d50000'; // Red
    if (bac <= 0.50) return '#c51162'; // Pink
    if (bac > 0.50) return '#b71c1c'; // Crimson
};


  const DrunkennessLevelFb = () => {
    console.log("Drunkenness Level is loading");
    const { user } = useContext(UserContext);
    const [currentBAC, setCurrentBAC] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [documentExists, setDocumentExists] = useState(false);
    const [displayPreference, setDisplayPreference] = useState(null); // Default to text
    const [drunkParameters, setDrunkParameters] = useState([]);
    const [emojis, setEmojis] = useState({});

  
    useEffect(() => {
        const firestore = getFirestore();
    
        if (user) {
          const fetchPreferencesAndData = async () => {
            const displayRef = doc(firestore, user.uid, 'Display');
            const emojiRef = doc(firestore, user.uid, 'Emojis');
            const parametersRef = doc(firestore, user.uid, 'Drunk Parameters');
    
            try {
              const [displaySnap, emojiSnap, parametersSnap] = await Promise.all([
                getDoc(displayRef),
                getDoc(emojiRef),
                getDoc(parametersRef)
              ]);
    
              if (displaySnap.exists()) {
                setDisplayPreference(displaySnap.data().DrunkennessDisplay);
              }
    
              if (emojiSnap.exists()) {
                setEmojis(emojiSnap.data());
              }
    
              if (parametersSnap.exists()) {
                setDrunkParameters(parametersSnap.data().levels);
              }
    
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
          };
    
          fetchPreferencesAndData();
        }
      }, [user]);    
  
    useEffect(() => {
        if (user) {
          const fetchCurrentBAC = async () => {
            const firestore = getFirestore();
            const todayStr = moment().format('YYYY-MM-DD');
            const bacLevelRef = doc(firestore, user.uid, "Daily Totals", "BAC Level", todayStr);
    
            try {
              const docSnap = await getDoc(bacLevelRef);
              if (docSnap.exists() && !isNaN(docSnap.data().value)) {
                setCurrentBAC(docSnap.data().value);
              } else {
                setCurrentBAC(0); // Treat as 0 if NaN or document doesn't exist
              }
            } catch (error) {
              console.error("Error getting document:", error);
              setCurrentBAC(0); // Treat as 0 if error occurs
            }
          };
    
          fetchCurrentBAC();
          const intervalId = setInterval(fetchCurrentBAC, refreshInterval); // Refresh every 10 seconds
    
          return () => clearInterval(intervalId); // Cleanup on unmount
        }
      }, [user?.uid]);

  
    useEffect(() => {
      if (documentExists) {
        const level = getDrunkennessLevel(currentBAC);
        console.log("Triggering notification with level:", level);
  
        PushNotification.localNotification({
          channelId: "drunkenness-level-channel",
          title: "Drunkenness Level Update",
          message: `You are currently: ${level.simple}`,
          bigText: level.detailed,
          color: getTextColor(currentBAC),
        });
      }
    }, [currentBAC, documentExists]);

    const getDrunkennessLevel = (bac) => {
        const level = drunkParameters.find(param => {
          const [min, max] = param.range.split('-').map(Number);
          return bac >= min && bac <= max;
        });
    
        return level || { simple: "Unknown", detailed: "No data available." };
      };
    
      const level = getDrunkennessLevel(currentBAC);
    
      const emoji = emojis[level.simple]; // Fetch emoji by simple description
      const displayValue = displayPreference === 'emojis' ? emoji : 
                           displayPreference === 'both' ? `${level.simple} ${emoji}` : 
                           level.simple;

    return (
        <View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.textStyle}>
              You are currently: <Text style={[{ color: getTextColor(currentBAC) }, styles.boldText]}>{displayValue}</Text>
            </Text>
            <Text style={styles.bacLevelText}>
              Current BAC: <Text style={styles.bacLevelNumber}>{currentBAC.toFixed(4)}</Text>
            </Text>
          </TouchableOpacity>
    
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <Text style={styles.modalText}>{level.detailed}</Text>
            <TouchableOpacity
              style={styles.hideButton}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Hide Detail</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

  export default DrunkennessLevelFb;