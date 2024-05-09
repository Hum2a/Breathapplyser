import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs } from '@firebase/firestore';
import { UserContext } from '../../../../../../context/UserContext';
import Dialog from 'react-native-dialog';

const Venues = ({ navigation }) => {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [newVenueName, setNewVenueName] = useState('');
    const [selectedVenue, setSelectedVenue] = useState(null);

    const { user } = useContext(UserContext);
    const firestore = getFirestore();

    useEffect(() => {
        fetchVenues();
    }, [user.uid]);

    const fetchVenues = async () => {
        try {
            const venuesCollectionRef = collection(firestore, `${user.uid}/Alcohol Stuff/Venues`);
            const querySnapshot = await getDocs(venuesCollectionRef);
            const venuesData = [];
            for (const doc of querySnapshot.docs) {
                const venue = {
                    id: doc.id,
                    ...doc.data(),
                    favourites: []
                };
                // Fetch favourites for each venue
                const favouritesCollectionRef = collection(firestore, `${user.uid}/Alcohol Stuff/Venues/${doc.id}/Favourites`);
                const favSnapshot = await getDocs(favouritesCollectionRef);
                venue.favourites = favSnapshot.docs.map(favDoc => ({
                    id: favDoc.id,
                    ...favDoc.data()
                }));
                venuesData.push(venue);
            }
            setVenues(venuesData);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch Venues');
            setLoading(false);
            console.error(err);
        }
    };

    const handleRenameVenue = async () => {
        if (!selectedVenue || !newVenueName.trim()) {
            setDialogVisible(false);
            return;
        }
        // Create a new document with the new name
        const newDocRef = doc(firestore, `${user.uid}/Alcohol Stuff/Venues`, newVenueName.trim());
        await setDoc(newDocRef, { ...selectedVenue }); // assuming venue details are stored in the document
        // Delete the old document
        await deleteDoc(doc(firestore, `${user.uid}/Alcohol Stuff/Venues`, selectedVenue.id));
        setDialogVisible(false);
        fetchVenues();  // Refresh the venue list
    };

    const showRenameDialog = (venue) => {
        setSelectedVenue(venue);
        setNewVenueName(venue.id);
        setDialogVisible(true);
    };

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#00ADEF" /></View>;
    }

    if (error) {
        return <View style={styles.centered}><Text style={styles.error}>{error}</Text></View>;
    }

    const navigateToFavouritesEdit = (fav) => {
        navigation.navigate('Developer Favourites Edit', { favourite: fav });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Venues</Text>
            <FlatList
                data={venues}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => showRenameDialog(item)}>
                        <Text style={styles.itemText}>{item.id} - Tap to Edit</Text>
                        {item.favourites.map(fav => (
                            <TouchableOpacity onPress={() => navigateToFavouritesEdit(fav)}>
                                <Text key={fav.id} style={styles.favText}>
                                    Favorite: {fav.id || fav.Alcohol}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </TouchableOpacity>
                )}
            />

            <Dialog.Container visible={dialogVisible}>
                <Dialog.Title>Rename Venue</Dialog.Title>
                <Dialog.Input label="New Venue Name" value={newVenueName} onChangeText={setNewVenueName} />
                <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
                <Dialog.Button label="Save" onPress={handleRenameVenue} />
            </Dialog.Container>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
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
        marginBottom: 16,
        textAlign: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    favText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 10,
    },
    error: {
        color: 'red',
        fontSize: 16,
    }
});

export default Venues;
