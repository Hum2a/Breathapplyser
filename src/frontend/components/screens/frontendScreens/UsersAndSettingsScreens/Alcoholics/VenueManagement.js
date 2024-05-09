import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { UserContext } from '../../../../../context/UserContext';

const VenueManagement = () => {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const renderFavourite = ({ item }) => (
        <View style={styles.favouriteItem}>
            <Text style={styles.favouriteText}>Favourite: {item.Alcohol} - {item.Amount} units</Text>
        </View>
    );

    const renderVenue = ({ item }) => (
        <View style={styles.venueItem}>
            <Text style={styles.venueHeader}>{item.name}</Text>
            <FlatList
                data={item.favourites}
                renderItem={renderFavourite}
                keyExtractor={fav => fav.id}
                style={styles.favouritesList}
            />
        </View>
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
        fontWeight: 'bold',
        color: '#333',
    },
    favouriteItem: {
        paddingLeft: 20,
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
