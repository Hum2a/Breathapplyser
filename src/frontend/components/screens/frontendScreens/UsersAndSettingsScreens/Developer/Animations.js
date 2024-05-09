import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Switch, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from '@firebase/firestore';
import { UserContext } from '../../../../../context/UserContext';

const Animations = () => {
    const [animations, setAnimations] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user } = useContext(UserContext);
    const firestore = getFirestore();

    useEffect(() => {
        const fetchAnimations = async () => {
            try {
                const docRef = doc(firestore, `${user.uid}/Animations`);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setAnimations(docSnap.data());
                } else {
                    console.log("No such document!");
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch animations');
                console.error(err);
                setLoading(false);
            }
        };

        fetchAnimations();
    }, [user.uid]);

    const handleToggle = async (field) => {
        const newValue = !animations[field];
        setAnimations(prev => ({ ...prev, [field]: newValue }));

        const docRef = doc(firestore, `${user.uid}/Animations`);
        try {
            await updateDoc(docRef, {
                [field]: newValue
            });
        } catch (error) {
            console.error("Error updating animations:", error);
        }
    };

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#00ADEF" /></View>;
    }

    if (error) {
        return <View style={styles.centered}><Text style={styles.error}>{error}</Text></View>;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Animations Settings</Text>
            {Object.entries(animations).map(([key, value]) => (
                <View key={key} style={styles.setting}>
                    <Text style={styles.label}>{key.replace(/([A-Z])/g, ' $1').trim()}</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={value ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => handleToggle(key)}
                        value={value}
                    />
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#F0F4F8',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    setting: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    label: {
        fontSize: 18,
        color: '#666',
    },
    error: {
        color: 'red',
        fontSize: 16,
    }
});

export default Animations;
