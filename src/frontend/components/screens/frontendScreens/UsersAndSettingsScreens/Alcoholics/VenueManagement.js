import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { UserContext } from '../../../../../context/UserContext';
import Dialog from 'react-native-dialog';

const VenueManagement = () => {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedVenueId, setSelectedVenueId] = useState(null);
    const { user } = useContext(UserContext);
    const firestore = getFirestore();

    useEffect(() => {
        fetchVenues();
    }, [user.uid]);

    const fetchVenues = async () => {
        setLoading(true);
        try {
            const venueSnapshot = await getDocs(collection(firestore, `${user.uid}/Alcohol Stuff/Venues`));
            const venuesData = await Promise.all(venueSnapshot.docs.map(async doc => {
                const venueData = {
                    id: doc.id,
                    name: doc.id,
                    favourites: []
                };
                const favouritesSnapshot = await getDocs(collection(firestore, `${user.uid}/Alcohol Stuff/Venues/${doc.id}/Favourites`));
                venueData.favourites = favouritesSnapshot.docs.map(favDoc => ({
                    id: favDoc.id,
                    ...favDoc.data()
                }));
                return venueData;
            }));
            setVenues(venuesData);
        } catch (error) {
            console.error("Error fetching venues and favourites: ", error);
        }
        setLoading(false);
    };

    const handleLongPress = (venueId) => {
        setSelectedVenueId(venueId);
        setDialogVisible(true);
    };

    const handleDelete = async () => {
        if (selectedVenueId) {
            const venueRef = doc(firestore, `${user.uid}/Alcohol Stuff/Venues`, selectedVenueId);
            const favouritesRef = collection(firestore, `${user.uid}/Alcohol Stuff/Venues/${selectedVenueId}/Favourites`);
    
            setLoading(true);
            try {
                // First, fetch all favourites for the venue
                const snapshot = await getDocs(favouritesRef);
                // Then, delete all favourites documents
                const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
                // Await all deletions to complete
                await Promise.all(deletePromises);
                // Finally, delete the venue document
                await deleteDoc(venueRef);
                // Update UI
                setVenues(prevVenues => prevVenues.filter(venue => venue.id !== selectedVenueId));
                setDialogVisible(false);
            } catch (error) {
                console.error('Error deleting venue and its favourites:', error);
            }
            setLoading(false);
        }
    };
    

    const closeDialog = () => {
        setDialogVisible(false);
    };

    const renderFavourite = ({ item }) => (
        <View style={styles.favouriteItem}>
            <Text style={styles.favouriteText}>Favourite: {item.Alcohol} - {item.Amount} units</Text>
        </View>
    );

    const renderVenue = ({ item }) => (
        <TouchableOpacity
            style={styles.venueItem}
            onLongPress={() => handleLongPress(item.id)}
        >
            <Text style={styles.venueHeader}>{item.name}</Text>
            <FlatList
                data={item.favourites}
                renderItem={renderFavourite}
                keyExtractor={fav => fav.id}
                style={styles.favouritesList}
            />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>Loading venues...</Text>
            ) : (
                <FlatList
                    data={venues}
                    renderItem={renderVenue}
                    keyExtractor={item => item.id}
                />
            )}
            <Dialog.Container visible={dialogVisible}>
                <Dialog.Title>Delete Venue</Dialog.Title>
                <Dialog.Description>
                    Are you sure you want to delete this venue? This will remove all associated favourites.
                </Dialog.Description>
                <Dialog.Button label="Cancel" onPress={closeDialog} />
                <Dialog.Button label="Delete" onPress={handleDelete} />
            </Dialog.Container>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f4f8',
    },
    venueItem: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    venueHeader: {
        fontSize: 18,
        fontFamily: 'heyam',
        color: '#333',
        textAlign: 'center',
    },
    favouriteItem: {
        alignItems: 'center'
    },
    favouriteText: {
        fontSize: 16,
        color: '#666',
    },
    favouritesList: {
        marginTop: 5,
    }
});

export default VenueManagement;
