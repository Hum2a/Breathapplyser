import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { getFirestore, doc, onSnapshot, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from 'react-native-dialog';
import { UserContext } from '../../../../frontend/context/UserContext';

const DrunkennessFeedback = () => {
    const { user } = useContext(UserContext);
    const [currentBAC, setCurrentBAC] = useState(0);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [drunkennessLevel, setDrunkennessLevel] = useState('');
    const [bacFeedbackData, setBacFeedbackData] = useState({});

    useEffect(() => {
        const firestore = getFirestore();
        if (user) {
            const bacLevelRef = doc(firestore, user.uid, 'Daily Totals', 'BAC Level', new Date().toISOString().split('T')[0]);
            console.log(new Date().toISOString().split('T')[0])
            const unsubscribe = onSnapshot(bacLevelRef, (doc) => {
                if (doc.exists()) {
                    const newBAC = doc.data().value;
                    setCurrentBAC(newBAC);
                    checkBACLevel(newBAC);
                }
            });

            const fetchFeedbackData = async () => {
                try {
                    const feedbackRef = doc(firestore, user.uid, 'BAC Feedback');
                    const docSnap = await getDoc(feedbackRef);
                    if (docSnap.exists()) {
                        setBacFeedbackData(docSnap.data());
                    } else {
                        console.log('No feedback found');
                    }
                } catch (error) {
                    console.error('Error fetching feedback data:', error);
                }
            };

            fetchFeedbackData();

            // Clean up the subscription when the component unmounts
            return () => unsubscribe();
        }
    }, [user]);

    const checkBACLevel = async (bac) => {
        const todayDate = new Date().toISOString().split('T')[0];
        const lastWarningDate = await AsyncStorage.getItem('lastWarningDate');

        if (lastWarningDate === todayDate) {
            // Warning already shown today
            return;
        }

        // Find the highest BAC level in feedback data that is less than or equal to the current BAC
        let feedbackMessage = '';
        let highestBACLevel = 0;

        Object.keys(bacFeedbackData).forEach((key) => {
            const feedbackEntry = bacFeedbackData[key];
            if (bac >= feedbackEntry.BACLevel && feedbackEntry.BACLevel > highestBACLevel) {
                feedbackMessage = feedbackEntry.feedback;
                highestBACLevel = feedbackEntry.BACLevel;
            }
        });

        if (feedbackMessage) {
            setDrunkennessLevel(feedbackMessage);
            setDialogVisible(true);
            await AsyncStorage.setItem('lastWarningDate', todayDate);
        }
    };

    return (
        <View>
            <Dialog.Container visible={dialogVisible} contentStyle={styles.dialogContainer}>
                <Dialog.Title style={styles.dialogTitle}>Warning</Dialog.Title>
                <Dialog.Description style={styles.dialogDescription}>
                    {drunkennessLevel}
                </Dialog.Description>
                <Dialog.Button label="OK" onPress={() => setDialogVisible(false)} style={styles.dialogButton} />
            </Dialog.Container>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#BAEAFF',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 20,
    },
    bacText: {
        fontSize: 22,
        color: '#003366',
    },
    dialogContainer: {
        borderRadius: 15,
        padding: 20,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dialogTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF6347',
        textAlign: 'center',
        marginBottom: 10,
    },
    dialogDescription: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    dialogButton: {
        backgroundColor: '#FF6347',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        elevation: 2,
    },
    dialogButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default DrunkennessFeedback;
