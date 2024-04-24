import React, { useContext, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { UserContext } from '../../../../frontend/context/UserContext';
import moment from 'moment';

const BacCleaner = () => {
    const { user } = useContext(UserContext);
    const firestore = getFirestore();

    const wipeExtraBACDocuments = async (userId) => {
        const bacLevelPath = `${userId}/Alcohol Stuff/BAC Level`;
        const bacRef = collection(firestore, bacLevelPath);

        try {
            const q = query(bacRef, orderBy("date"));
            const querySnapshot = await getDocs(q);
            const hourlyDocs = {};

            // Group docs by their nearest hour
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const hour = moment(data.date).startOf('hour').format();
                if (!hourlyDocs[hour]) {
                    hourlyDocs[hour] = [];
                }
                hourlyDocs[hour].push({ id: doc.id, timestamp: data.date });
            });

            // Keep only the closest document to the start of the hour and delete others
            for (const hour in hourlyDocs) {
                let closestDoc = hourlyDocs[hour].reduce((closest, current) => {
                    const currentDiff = Math.abs(moment(current.timestamp) - moment(hour));
                    const closestDiff = Math.abs(moment(closest.timestamp) - moment(hour));
                    return currentDiff < closestDiff ? current : closest;
                }, hourlyDocs[hour][0]);

                hourlyDocs[hour].forEach(async (doc) => {
                    if (doc.id !== closestDoc.id) {
                        const deleteRef = doc(firestore, bacLevelPath, doc.id);
                        await deleteDoc(deleteRef);
                        console.log(`Deleted BAC doc with ID: ${doc.id} which was not closest to the hour.`);
                    }
                });
            }
            
            console.log("Completed hourly cleanup of BAC documents.");

        } catch (error) {
            console.error("Error in hourly cleanup of BAC documents:", error);
        }
    };

    useEffect(() => {
        if (user && user.uid) {
            // Initialize cleanup once the user logs in or is determined
            wipeExtraBACDocuments(user.uid);

            // Optionally set up a routine to clean up BAC docs, for example, once a day
            const intervalId = setInterval(() => {
                wipeExtraBACDocuments(user.uid);
            }, 10000); // Run daily

            return () => clearInterval(intervalId);
        }
    }, [user?.uid]); // Depend on user.uid to rerun the effect if the user changes

    return null; // This component doesn't render anything
};

export default BacCleaner;
