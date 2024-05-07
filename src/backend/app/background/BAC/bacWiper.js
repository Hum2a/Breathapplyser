import React, { useContext, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { UserContext } from '../../../../frontend/context/UserContext';

const BacWiper = () => {
    const { user } = useContext(UserContext);
    const firestore = getFirestore();

    const wipeInvalidValueBACDocuments = async (userId) => {
        const bacLevelPath = `${userId}/Alcohol Stuff/BAC Level`;

        // Function to delete documents based on a query
        const deleteDocuments = async (queryConstraint) => {
            const q = query(collection(firestore, bacLevelPath), queryConstraint);
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
                console.log(`Deleted doc with ID: ${doc.id}`);
            });
        };

        try {
            // Delete documents where value equals 0
            await deleteDocuments(where("value", "==", 0));
            console.log("Completed wiping documents with value 0");

            await deleteDocuments(where("currentBAC", "==", 0));
            console.log("Completed wiping documents with currentBAC 0");

            // If using a marker value for NaN, delete those documents as well
            await deleteDocuments(where("value", "==", "NaN"));
            console.log("Completed wiping documents with value 'NaN'");

            await deleteDocuments(where("currentBAC", "==", "NaN"));
            console.log("Completed wiping documents with currentBAC NaN");

        } catch (error) {
            console.error("Error wiping invalid documents:", error);
        }
    };

    useEffect(() => {
        if (user && user.uid) {
            wipeInvalidValueBACDocuments(user.uid);

            const intervalId = setInterval(() => {
                wipeInvalidValueBACDocuments(user.uid);
            }, 3600000); // 7200000 milliseconds = 2 hours

            return () => clearInterval(intervalId);
        }
    }, [user?.uid]); // Depend on user.uid to rerun the effect if the user changes

    return null; // Since this component doesn't render anything
};

export default BacWiper;
