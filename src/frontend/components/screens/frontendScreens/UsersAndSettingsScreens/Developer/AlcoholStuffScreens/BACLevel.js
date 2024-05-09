import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Button, RefreshControl } from 'react-native';
import { getFirestore, collection, getDocs, deleteDoc, doc } from '@firebase/firestore';
import { UserContext } from '../../../../../../context/UserContext';
import moment from 'moment';

const BACLevel = () => {
    const [BACLevel, setBACLevel] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const { user } = useContext(UserContext);
    const firestore = getFirestore();

    useEffect(() => {
        fetchBACLevel();
    }, [user.uid]);

    const fetchBACLevel = async () => {
        try {
            const BACLevelCollectionRef = collection(firestore, `${user.uid}/Alcohol Stuff/BAC Level`);
            const querySnapshot = await getDocs(BACLevelCollectionRef);
            const BACLevelList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const dateValue = data.date ? (data.date.toDate ? moment(data.date.toDate()).format('YYYY-MM-DD HH:mm:ss') : moment(data.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')) : 'No Date';
                const BACValue = data.currentBAC || data.value || 'No BAC data';  // Handle currentBAC or value
                return {
                    id: doc.id,
                    date: dateValue,
                    BAC: BACValue,
                };
            });
            setBACLevel(BACLevelList);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch BACLevel');
            setLoading(false);
            console.error(err);
        }
    };

    const handleSelectItem = (id) => {
        const newSelectedIds = selectedIds.includes(id)
            ? selectedIds.filter(sid => sid !== id)
            : [...selectedIds, id];
        setSelectedIds(newSelectedIds);
    };

    const handleDeleteSelected = async () => {
        try {
            await Promise.all(selectedIds.map(id => {
                const docRef = doc(firestore, `${user.uid}/Alcohol Stuff/BAC Level`, id);
                return deleteDoc(docRef);
            }));
            setSelectedIds([]); // Reset selection
            fetchBACLevel(); // Refresh the list
        } catch (err) {
            console.error("Error deleting documents: ", err);
        }
    };

    const handleDeleteNoBACData = async () => {
        const docsToDelete = BACLevel.filter(doc => doc.BAC === 'No BAC data').map(doc => doc.id);
        try {
            await Promise.all(docsToDelete.map(id => {
                const docRef = doc(firestore, `${user.uid}/Alcohol Stuff/BAC Level`, id);
                return deleteDoc(docRef);
            }));
            fetchBACLevel(); // Refresh the list after deletion
        } catch (err) {
            console.error("Error deleting documents with no BAC data: ", err);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchBACLevel().then(() => setRefreshing(false));
    };

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#00ADEF" /></View>;
    }

    if (error) {
        return <View style={styles.centered}><Text style={styles.error}>{error}</Text></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>BAC Level</Text>
            <Button title="Delete Docs with No BAC Data" onPress={handleDeleteNoBACData} color="red" />
            {selectedIds.length > 0 && (
                <Button title="Delete Selected" onPress={handleDeleteSelected} color="red" />
            )}
            <FlatList
                data={BACLevel}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.card, selectedIds.includes(item.id) ? styles.selected : null]}
                        onPress={() => handleSelectItem(item.id)}
                        onLongPress={() => handleSelectItem(item.id)}>
                        <Text style={styles.itemText}>{item.date}</Text>
                        <Text style={styles.itemText}>BAC: {item.BAC}</Text>
                    </TouchableOpacity>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#00ADEF"]} // Android
                        tintColor="#00ADEF" // iOS
                    />
                }
            />
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
    selected: {
        backgroundColor: '#AED581', // Light green background for selected items
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    error: {
        color: 'red',
        fontSize: 16,
    }
});

export default BACLevel;
