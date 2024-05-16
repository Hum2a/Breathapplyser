import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Touchable, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { UserContext } from '../../../../../context/UserContext';
import { feedbackStyles as styles } from '../../../../styles/SettingStyles/feedbackStyles';

const BACFeedbackScreen = () => {
    const { user } = useContext(UserContext);
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const firestore = getFirestore();

    useEffect(() => {
        const fetchFeedback = async () => {
            if (!user) {
                alert('User not found');
                return;
            }
            setLoading(true);
            try {
                const feedbackRef = doc(firestore, user.uid, 'BAC Feedback');
                const docSnap = await getDoc(feedbackRef);
                if (docSnap.exists()) {
                    const feedbackData = [];
                    const data = docSnap.data();
                    // Loop through each feedback entry in the document
                    Object.keys(data).forEach(key => {
                        feedbackData.push({
                            BACLevel: key,
                            ...data[key]
                        });
                    });
                    setFeedbackList(feedbackData);
                } else {
                    alert('No feedback found');
                }
            } catch (error) {
                console.error('Error fetching feedback:', error);
                alert('Failed to fetch feedback.');
            }
            setLoading(false);
        };

        fetchFeedback();
    }, [user]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}> BAC Feedback Hub</Text>
            <FlatList
                data={feedbackList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.itemContainer}>
                        <Text style={styles.bacText}>BAC Level: {item.BACLevel}</Text>
                        <Text style={styles.feedbackText}>Feedback: {item.feedback}</Text>
                        <Text style={styles.timestampText}>
                            Timestamp: {new Date(item.timestamp.seconds * 1000).toLocaleString()}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};    

export default BACFeedbackScreen;
