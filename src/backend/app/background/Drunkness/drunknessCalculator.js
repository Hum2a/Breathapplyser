// DrunkennessLevelDisplay.js
import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { UserContext } from '../../../../frontend/context/UserContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';

const getDrunkennessLevel = (bac) => {
    let adjustedBac = isNaN(bac) ? 0 : bac;
    if (adjustedBac <= 0.01) return { simple: "Sober", detailed: "You're completely unintoxicated... probably." };
    if (bac <= 0.03) return { simple: "Buzzed", detailed: 'Mild relaxation, slight body warmth, mood elevation.' };
    if (bac <= 0.10) return { simple: "Relaxed", detailed: 'Feelings of well-being, relaxation, lower inhibitions, sensation of warmth, minor impairment of reasoning and memory.' };
    if (bac <= 0.15) return { simple: "A Bit of a liability", detailed: 'Mild impairment of balance, speech, vision, reaction time, and hearing. Euphoria. Judgement and self-control reduced, and caution, reason, and memory impaired.' };
    if (bac <= 0.20) return { simple: "Visibly Drunk", detailed: 'Significant impairment of motor coordination and loss of good judgement. Speech may be slurred; balance, vision, reaction time, and hearing will be impaired.' };
    if (bac <= 0.25) return { simple: "Embarassing", detailed: 'Gross motor impairment and lack of physical control. Blurred vision and major loss of balance. Euphoria is reduced and dysphoria (anxiety, restlessness) begins to appear.' };
    if (bac <= 0.30) return { simple: "Sickly", detailed: 'Dysphoria predominates, nausea may appear. The drinker has the appearance of a "sloppy drunk."' };
    if (bac <= 0.35) return { simple: "Take a seat bro", detailed: 'Feeling dazed, confused, or otherwise disoriented. May need help to stand or walk. If injured, may not feel the pain. Nausea and vomiting are possible.' };
    if (bac <= 0.40) return { simple: "Find a friend", detailed: 'Severe intoxication, needs assistance in walking; total mental confusion. Dysphoria with nausea and some vomiting.' };
    if (bac <= 0.45) return { simple: "Gonna Pass out", detailed: 'Loss of consciousness. The risk of death due to respiratory arrest is possible.' };
    if (bac <= 0.50) return { simple: "Call and Ambulance", detailed: 'This BAC level is comparable to surgical anesthesia and is considered a very life-threatening level of alcohol intoxication.' }
    if (bac > 0.50) return { simple: "Critical", detailed: "Onset of coma, and likelihood of death due to respiratory arrest." };
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

const DrunkennessLevel = () => {
    const { user } = useContext(UserContext);
    const [currentBAC, setCurrentBAC] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [documentExists, setDocumentExists] = useState(false);

    useEffect(() => {
        if (user) { // Ensure there's a user before fetching BAC
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
            const intervalId = setInterval(fetchCurrentBAC, 10000); // Refresh every 10 seconds

            return () => clearInterval(intervalId); // Cleanup on unmount
        } else {
            // Handle case when there's no user
            setCurrentBAC(0);
            setDocumentExists(false);
        }
    }, [user?.uid]); // Now dependent on user existence and user.uid

    useEffect(() => {
        if (documentExists) {
            const level = getDrunkennessLevel(currentBAC);
            // Logging to see if we reach this point and what the level details are
            console.log("Triggering notification with level:", level);
    
            PushNotification.localNotification({
                channelId: "drunkenness-level-channel",
                title: "Drunkenness Level Update",
                message: `You are currently: ${level.simple}`,
                bigText: level.detailed,
                color: getTextColor(currentBAC),
            });
        }
    }, [currentBAC, documentExists]); // This useEffect depends on currentBAC and documentExists
    

    const level = getDrunkennessLevel(currentBAC);

    return (
        <View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text>
                    You are currently: <Text style={[{ color: getTextColor(currentBAC) }, styles.boldText]}>{level.simple}</Text>
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
    
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
        height: '25%',
    },
    hideButton: {
        backgroundColor: "#2196F3",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 15,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    boldText: {
        fontWeight: 'bold',
    },
    bacLevelText: {
        textAlign: 'center',
        marginTop: 5,
        fontSize: 14,
        color: '#666', // A neutral, readable color
    },
    bacLevelNumber: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#000', // Bold and standout color
    },
});

    
    export default DrunkennessLevel;
    