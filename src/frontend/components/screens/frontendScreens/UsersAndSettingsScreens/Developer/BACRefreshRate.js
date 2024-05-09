import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from '@firebase/firestore';
import { UserContext } from '../../../../../context/UserContext';

const BACRefreshRate = () => {
    const [refreshInterval, setRefreshInterval] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user } = useContext(UserContext);
    const firestore = getFirestore();

    useEffect(() => {
        fetchRefreshInterval();
    }, [user.uid]);

    const fetchRefreshInterval = async () => {
        try {
            const docRef = doc(firestore, `${user.uid}/BAC Refresh Rate`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setRefreshInterval(docSnap.data().refreshInterval.toString());  // Store interval as string for TextInput
            } else {
                console.log("No such document!");
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch refresh interval');
            console.error(err);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        const docRef = doc(firestore, `${user.uid}/BAC Refresh Rate`);
        try {
            await updateDoc(docRef, {
                refreshInterval: parseInt(refreshInterval, 10)  // Convert back to integer for storage
            });
            alert('Refresh interval updated successfully!');
        } catch (error) {
            console.error("Error updating refresh interval:", error);
        }
    };

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#00ADEF" /></View>;
    }

    if (error) {
        return <View style={styles.centered}><Text style={styles.error}>{error}</Text></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>BAC Refresh Rate</Text>
            <View style={styles.row}>
                <Text style={styles.label}>Refresh Interval (ms):</Text>
                <TextInput
                    style={styles.input}
                    keyboardType='numeric'
                    onChangeText={setRefreshInterval}
                    value={refreshInterval}
                />
            </View>
            <Text style={styles.label}>Converted: {Math.round(parseInt(refreshInterval, 10) / 1000)} seconds</Text>
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'black',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        color: 'black',
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        color: 'black',
    },
    error: {
        color: 'red',
        fontSize: 16,
    }
});

export default BACRefreshRate;
