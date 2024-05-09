import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { getFirestore, doc, updateDoc } from '@firebase/firestore';
import { UserContext } from '../../../../../../context/UserContext';

const FavouritesEdit = ({ route, navigation }) => {
    const { favourite } = route.params;
    const [alcohol, setAlcohol] = useState(favourite.Alcohol);
    const [amount, setAmount] = useState(favourite.Amount.toString());
    const [calories, setCalories] = useState(favourite.Calories.toString());
    const [price, setPrice] = useState(favourite.Price.toString());
    const [type, setType] = useState(favourite.Type);
    const [units, setUnits] = useState(favourite.Units);

    const { user } = useContext(UserContext);
    const firestore = getFirestore();

    const handleSave = async () => {
        const favouriteDocRef = doc(firestore, `${user.uid}/Alcohol Stuff/Venues/${favourite.venueId}/Favourites`, favourite.id);
        try {
            await updateDoc(favouriteDocRef, {
                Alcohol: alcohol,
                Amount: parseFloat(amount),
                Calories: parseInt(calories),
                Price: parseFloat(price),
                Type: type,
                Units: units
            });
            navigation.goBack();
        } catch (error) {
            console.error("Error updating favorite:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Alcohol:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setAlcohol}
                value={alcohol}
            />
            <Text style={styles.label}>Amount:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setAmount}
                value={amount}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Calories:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setCalories}
                value={calories}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Price:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setPrice}
                value={price}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Type:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setType}
                value={type}
            />
            <Text style={styles.label}>Units:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setUnits}
                value={units}
            />
            <Button
                title="Save Changes"
                onPress={handleSave}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: 'crimson',
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        color: 'black',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    }
});

export default FavouritesEdit;
