import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc, deleteField, updateDoc } from 'firebase/firestore';
import Dialog from 'react-native-dialog';
import { UserContext } from '../../../../../context/UserContext';
import { feedbackStyles as styles } from '../../../../styles/SettingStyles/feedbackStyles';

const BACFeedbackScreen = () => {
    const { user } = useContext(UserContext);
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
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

    const handleItemPress = (item) => {
        setSelectedFeedback(item);
        setDialogVisible(true);
    };

    const handleEdit = () => {
        setDialogVisible(false);
        // Logic to edit feedback can be added here
        alert('Edit feedback functionality to be implemented');
    };

    const handleDelete = async () => {
        if (!selectedFeedback) return;
        const feedbackRef = doc(firestore, user.uid, 'BAC Feedback');

        try {
            await updateDoc(feedbackRef, {
                [selectedFeedback.BACLevel]: deleteField()
            });
            setFeedbackList(prevFeedbackList => prevFeedbackList.filter(item => item.BACLevel !== selectedFeedback.BACLevel));
            setDialogVisible(false);
            alert('Feedback deleted successfully');
        } catch (error) {
            console.error('Error deleting feedback:', error);
            alert('Failed to delete feedback. Please try again.');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>BAC Feedback Hub</Text>
            <FlatList
                data={feedbackList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.itemContainer} onPress={() => handleItemPress(item)}>
                        <Text style={styles.bacText}>BAC Level: {item.BACLevel}</Text>
                        <Text style={styles.feedbackText}>Feedback: {item.feedback}</Text>
                        <Text style={styles.timestampText}>
                            Timestamp: {new Date(item.timestamp.seconds * 1000).toLocaleString()}
                        </Text>
                    </TouchableOpacity>
                )}
            />
            <Dialog.Container visible={dialogVisible} contentStyle={styles.dialogContainer}>
                <Dialog.Title style={styles.dialogTitle}>Feedback Options</Dialog.Title>
                <Dialog.Description style={styles.dialogDescription}>
                    Would you like to edit or delete this feedback?
                </Dialog.Description>
                <Dialog.Button label="Edit" onPress={handleEdit} style={styles.dialogButton} />
                <Dialog.Button label="Delete" onPress={handleDelete} style={styles.dialogButton} />
                <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} style={styles.dialogButton} />
            </Dialog.Container>
        </View>
    );
};

export default BACFeedbackScreen;
