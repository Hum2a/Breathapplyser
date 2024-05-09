import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs } from '@firebase/firestore';
import { UserContext } from '../../../../../../context/UserContext';

const Entries = ({ navigation }) => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState({});  // Track expanded entries

    const { user } = useContext(UserContext);
    const firestore = getFirestore();

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const entriesCollectionRef = collection(firestore, `${user.uid}/Alcohol Stuff/Entries`);
                const querySnapshot = await getDocs(entriesCollectionRef);
                const entriesList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                    entryDocs: []  // Prepare to hold subcollection docs
                }));
                setEntries(entriesList);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch entries');
                setLoading(false);
                console.error(err);
            }
        };

        fetchEntries();
    }, [user.uid]);

    const toggleEntry = async (entryId) => {
        const entryIndex = entries.findIndex(entry => entry.id === entryId);
        if (entryIndex !== -1) {
            let newEntries = [...entries];
            if (!expanded[entryId]) {
                const entryDocsRef = collection(firestore, `${user.uid}/Alcohol Stuff/Entries/${entryId}/EntryDocs`);
                const entryDocsSnapshot = await getDocs(entryDocsRef);
                newEntries[entryIndex].entryDocs = entryDocsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            }
            setExpanded(prevState => ({ ...prevState, [entryId]: !prevState[entryId] }));
            setEntries(newEntries);
        }
    };

    const navigateToEntriesEdit = (doc) => {
        navigation.navigate('Developer Entries Edit', { entry: doc });
    }

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#00ADEF" /></View>;
    }

    if (error) {
        return <View style={styles.centered}><Text style={styles.error}>{error}</Text></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Entries</Text>
            <FlatList
                data={entries}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => toggleEntry(item.id)}>
                        <Text style={styles.itemText}>{item.id} - Tap for details</Text>
                        {expanded[item.id] && (
                            item.entryDocs.length > 0 ? item.entryDocs.map(doc => (
                                <View key={doc.id} style={styles.subItem}>
                                    <TouchableOpacity onPress={() => navigateToEntriesEdit(doc)}>
                                        <Text style={styles.subItemText}>{doc.id}</Text>
                                    </TouchableOpacity>
                                </View>
                            )) : <Text style={styles.subItemText}>No entries found.</Text>
                        )}
                    </TouchableOpacity>
                )}
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
        elevation: 4, // for Android shadow effect
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    subItem: {
        marginTop: 5,
    },
    subItemText: {
        fontSize: 14,
        color: '#666',
    },
    error: {
        color: 'red',
        fontSize: 16,
    }
});

export default Entries;
