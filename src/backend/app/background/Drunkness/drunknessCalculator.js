import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { UserContext } from '../../../../frontend/context/UserContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { DrunkCalcStyles as styles } from '../../../../frontend/components/styles/DrinkingStyles/drunkCalcStyles';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';

const refreshInterval = 10000; // Refresh interval in milliseconds

export const getDrunkennessLevel = (bac) => {
    let adjustedBac = isNaN(bac) ? 0 : bac;
    if (adjustedBac <= 0.01) return { simple: "Sober", detailed: "You're completely unintoxicated... probably." };
    if (bac <= 0.03) return { simple: "Buzzed", detailed: 'Mild relaxation, slight body warmth, mood elevation.' };
    if (bac <= 0.10) return { simple: "Relaxed", detailed: 'Feelings of well-being, relaxation, lower inhibitions, sensation of warmth, minor impairment of reasoning and memory.' };
    if (bac <= 0.15) return { simple: "A Bit of a liability", detailed: 'Mild impairment of balance, speech, vision, reaction time, and hearing. Euphoria. Judgement and self-control reduced, and caution, reason, and memory impaired.' };
    if (bac <= 0.20) return { simple: "Visibly Drunk", detailed: 'Significant impairment of motor coordination and loss of good judgement. Speech may be slurred; balance, vision, reaction time, and hearing will be impaired.' };
    if (bac <= 0.25) return { simple: "Embarassing", detailed: 'Gross motor impairment and lack of physical control. Blurred vision and major loss of balance. Euphoria is reduced and dysphoria (anxiety, restlessness) begins to appear.' };
    if (bac <= 0.30) return { simple: "Sickly", detailed: 'Dysphoria predominates, nausea may appear. The drinker has the appearance of a "sloppy drunk."' };
    if (bac <= 0.35) return { simple: "Either pull or go home", detailed: 'Feeling dazed, confused, or otherwise disoriented. May need help to stand or walk. If injured, may not feel the pain. Nausea and vomiting are possible.' };
    if (bac <= 0.40) return { simple: "Find a friend", detailed: 'Severe intoxication, needs assistance in walking; total mental confusion. Dysphoria with nausea and some vomiting.' };
    if (bac <= 0.45) return { simple: "Gonna Pass out", detailed: 'Loss of consciousness. The risk of death due to respiratory arrest is possible.' };
    if (bac <= 0.50) return { simple: "Call and Ambulance", detailed: 'This BAC level is comparable to surgical anesthesia and is considered a very life-threatening level of alcohol intoxication.' }
    if (bac > 0.50) return { simple: "Death is coming", detailed: "Onset of coma, and likelihood of death due to respiratory arrest." };
};

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

const emojiRepresentations = {
    Sober: '😐',
    Buzzed: '😉',
    Relaxed: '😊',
    'A Bit of a liability': '🫠',
    'Visibly Drunk': '🙃',
    Embarassing: '🫣',
    Sickly: '🥲',
    'Either pull or go home': '🫡',
    'Find a friend': '🤐',
    'Gonna Pass out': '🫨',
    'Call and Ambulance': '😷',
    'Death is coming': '🫥',
  };
  
  // Define the text representations for each BAC level
  const textRepresentations = {
    Sober: 'Sober',
    Buzzed: 'Buzzed',
    Relaxed: 'Relaxed',
    'A Bit of a liability': 'A Bit of a liability',
    'Visibly Drunk': 'Visibly Drunk',
    Embarassing: 'Embarassing',
    Sickly: 'Sickly',
    'Either pull or go home': 'Either pull or go home',
    'Find a friend': 'Find a friend',
    'Gonna Pass out': 'Gonna Pass out',
    'Call and Ambulance': 'Call and Ambulance',
    'Death is coming': 'Death is coming',
  };

  const DrunkennessLevel = () => {
    console.log("Drunkenness Level is loading");
    const { user } = useContext(UserContext);
    const [currentBAC, setCurrentBAC] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [documentExists, setDocumentExists] = useState(false);
    const [displayPreference, setDisplayPreference] = useState(null); // Default to text
    const [emojis, setEmojis] = useState({});

  
    useEffect(() => {
      if (user) {
        const fetchDisplayPreference = async () => {
          const firestore = getFirestore();
          const userDocRef = doc(firestore, user.uid, "Display");
  
          try {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
              setDisplayPreference(docSnap.data().DrunkennessDisplay);
            }
          } catch (error) {
            console.error("Error getting display preference:", error);
          }
        };
  
        fetchDisplayPreference();
      }
    }, [user]);

    useEffect(() => {
      if (user) {
        const fetchEmojis = async () => {
          try {
            const firestore = getFirestore();
            const userDocRef = doc(firestore, user.uid, 'Emojis');
            const docSnap = await getDoc(userDocRef);
            
            if (docSnap.exists()) {
              const emojisData = docSnap.data();
              console.log('Emojis data:', emojisData);
              setEmojis(emojisData);
            }
            
          } catch (error) {
            console.error('Error fetching emojis:', error);
          }
        };
    
        fetchEmojis();
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
            setDocumentExists(docSnap.exists());
          } catch (error) {
            console.error("Error getting document:", error);
            setCurrentBAC(0); // Treat as 0 if error occurs
            setDocumentExists(false);
          }
        };
  
        fetchCurrentBAC();
        const intervalId = setInterval(fetchCurrentBAC, refreshInterval); // Refresh every 10 seconds
  
        return () => clearInterval(intervalId); // Cleanup on unmount
      } else {
        setCurrentBAC(0);
        setDocumentExists(false);
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
  
    const level = getDrunkennessLevel(currentBAC);
    const displayValue = displayPreference === 'emojis' ? emojiRepresentations[level.simple] : displayPreference === 'both' ? ` ${textRepresentations[level.simple]} ${emojiRepresentations[level.simple]} ` : textRepresentations[level.simple];
    // const emojiKey = Object.keys(emojis).find(key => key.toLowerCase() === level.simple.toLowerCase());
    // const displayValue = displayPreference === 'emojis' ? (emojiKey ? emojis[emojiKey] : '') : 
    //                     displayPreference === 'both' ? `${textRepresentations[level.simple]} ${emojis[emojiKey]}` : 
    //                     textRepresentations[level.simple];

    return (
      <View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text>
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
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{level.detailed}</Text>
              <Text style={styles.bacLevelText}>
                Current BAC: <Text style={styles.bacLevelNumber}>{currentBAC.toFixed(4)}</Text>
              </Text>
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

  export default DrunkennessLevel;