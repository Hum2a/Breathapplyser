import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, doc, updateDoc, collection, getDocs } from '@firebase/firestore';
import Dialog from 'react-native-dialog';
import { UserContext } from '../../../../../context/UserContext';

const DailyTotals = () => {
    const [dailyData, setDailyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [currentData, setCurrentData] = useState(null);

    const { user } = useContext(UserContext);
    const firestore = getFirestore();

    useEffect(() => {
        fetchDailyTotals();
    }, [user.uid]);

    const fetchDailyTotals = async () => {
        try {
            const dailyTotalsRef = doc(firestore, `${user.uid}/Daily Totals`);
            const collections = ['Amount Spent', 'BAC Level', 'Unit Intake'];
            let data = {};

            for (const collectionName of collections) {
                const collectionRef = collection(dailyTotalsRef, collectionName);
                const querySnapshot = await getDocs(collectionRef);
                querySnapshot.forEach(doc => {
                    const docData = doc.data();
                    const date = doc.id;
                    if (!data[date]) {
                        data[date] = { date };
                    }
                    data[date][collectionName] = docData.value || 'N/A'; // Assuming doc data has a value property
                });
            }

            const dataArray = Object.values(data);
            // Sort the array by date
            dataArray.sort((a, b) => new Date(a.date) - new Date(b.date));

            setDailyData(Object.values(dataArray));
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch daily totals');
            setLoading(false);
            console.error(err);
        }
    };

    const handleEditTotal = (item) => {
        setCurrentData({ ...item });
        setDialogVisible(true);
    };

    const handleSaveChanges = async () => {
        try {
            const promises = [];
            const date = currentData.date;
            promises.push(updateDoc(doc(firestore, `${user.uid}/Daily Totals/Amount Spent/${date}`), { value: currentData['Amount Spent'] }));
            promises.push(updateDoc(doc(firestore, `${user.uid}/Daily Totals/BAC Level/${date}`), { value: currentData['BAC Level'] }));
            promises.push(updateDoc(doc(firestore, `${user.uid}/Daily Totals/Unit Intake/${date}`), { value: currentData['Unit Intake'] }));
            await Promise.all(promises);
            fetchDailyTotals(); // Refresh the data
            setDialogVisible(false);
        } catch (error) {
            console.error("Error updating daily totals:", error);
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
            <Text style={styles.header}>Daily Totals</Text>
            <FlatList
                data={dailyData}
                keyExtractor={item => item.date}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onLongPress={() => handleEditTotal(item)}>
                        <Text style={styles.itemText}>Date: {item.date}</Text>
                        <Text style={styles.itemText}>Amount Spent: {item['Amount Spent']}</Text>
                        <Text style={styles.itemText}>BAC Level: {item['BAC Level']}</Text>
                        <Text style={styles.itemText}>Unit Intake: {item['Unit Intake']}</Text>
                    </TouchableOpacity>
                )}
            />
            {dialogVisible && (
                <Dialog.Container visible={true}>
                    <Dialog.Title>Edit Totals</Dialog.Title>
                    {Object.keys(currentData).map(key => key !== 'date' && (
                        <View key={key}>
                            <Dialog.Input label={key} value={currentData[key]} onChangeText={(text) => setCurrentData(prev => ({ ...prev, [key]: text }))}/>
                        </View>
                    ))}
                    <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
                    <Dialog.Button label="Save" onPress={handleSaveChanges} />
                </Dialog.Container>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
        marginBottom: 20,
        textAlign: 'center',
        color: 'navy',
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
        marginBottom: 5,
    },
    error: {
        color: 'red',
        fontSize: 16,
    }
});

export default DailyTotals;
