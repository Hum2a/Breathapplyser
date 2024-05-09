import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView } from 'react-native';
import { getFirestore, doc, updateDoc } from '@firebase/firestore';
import { UserContext } from '../../../../../../context/UserContext';
import moment from 'moment';

const EntriesEdit = ({ route, navigation }) => {
    const { entry } = route.params;
    const [formData, setFormData] = useState({
        alcohol: entry.alcohol,
        amount: entry.amount.toString(),
        units: entry.units,
        price: entry.price.toString(),
        type: entry.type,
        calories: entry.calories.toString(),
        selectedStartTime: moment(entry.selectedStartTime).format('HH:mm'),
        selectedEndTime: moment(entry.selectedEndTime).format('HH:mm'),
        selectedDate: entry.selectedDate,
        selectedCurrency: entry.selectedCurrency
    });

    const { user } = useContext(UserContext);
    const firestore = getFirestore();

    const handleInputChange = (name, value) => {
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const saveChanges = async () => {
        const entryDocRef = doc(firestore, `${user.uid}/Alcohol Stuff/Entries/${entry.selectedDate}/EntryDocs`, entry.id);
        try {
            await updateDoc(entryDocRef, {
                ...formData,
                amount: parseInt(formData.amount, 10),
                price: parseFloat(formData.price),
                calories: parseInt(formData.calories, 10),
            });
            navigation.goBack();  // Navigate back after saving
        } catch (error) {
            console.error("Failed to update entry:", error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Edit Entry</Text>
            <View style={styles.inputContainer}>
                {Object.entries(formData).map(([key, value]) => (
                    <TextInput
                        key={key}
                        style={styles.input}
                        onChangeText={(text) => handleInputChange(key, text)}
                        value={value}
                        placeholder={key}
                        placeholderTextColor={'navy'}
                    />
                ))}
                <Button title="Save Changes" onPress={saveChanges} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'navy',
    },
    inputContainer: {
        marginBottom: 10
    },
    input: {
        height: 40,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10,
        color: 'crimson',
        borderColor: '#000',
        borderRadius: 5
    }
});

export default EntriesEdit;
