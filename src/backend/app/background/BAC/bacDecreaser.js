import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import moment from 'moment';

const BACDecrease = ({ user, updateCount }) => {
  console.log("BACDecrease: Component Rendered");
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment()); // Start with the current date

  const BACDecreaseRatePerHour = 0.015; // Original decrease rate per hour
  const BACDecreaseRatePerSecond = BACDecreaseRatePerHour / 3600; // Convert to per second

  useEffect(() => {
    if (!user) return;

    const decreaseBAC = setInterval(async () => {
      const firestore = getFirestore();
      const userUid = user.uid;

      // Loop until a BAC level document is found
      let bacLevelDoc;
      while (!bacLevelDoc) {
        const selectedDateStr = selectedDate.format('YYYY-MM-DD');
        console.log("Selected Date 1: ", selectedDateStr);
        
        // Fetch the current BAC level from Firebase for the selected date
        const bacLevelRef = doc(firestore, userUid, "Daily Totals", "BAC Level", selectedDateStr);
        bacLevelDoc = await getDoc(bacLevelRef);
        console.log("BAC Level Document Found:", bacLevelDoc.data());
        
        if (bacLevelDoc.exists()) {
          console.log("BAC Level Document Found:", bacLevelDoc.data());
          break; // Exit the loop if a document is found
        }
        
        // If no document is found, decrement the date by one day
        setSelectedDate(prevDate => prevDate.clone().subtract(1, 'days')); // Use clone to avoid mutating the original moment object
        console.log("Selected Date 2: ", selectedDate.format('YYYY-MM-DD'));
      }      

      if (bacLevelDoc) {
        // Check if bacLevelDoc exists
        const currentBAC = bacLevelDoc.data()?.value;

        // Calculate the time difference since the last update
        const lastUpdateTime = moment(bacLevelDoc.data()?.lastUpdated, 'YYYY-MM-DD HH:mm:ss');
        const currentTime = moment();
        const timeDifferenceInSeconds = currentTime.diff(lastUpdateTime, 'seconds');

        // Calculate the new BAC based on the time difference
        const newBAC = Math.max(0, currentBAC - BACDecreaseRatePerSecond * timeDifferenceInSeconds);

        console.log('==============================');
        console.log("currentBAC:", currentBAC);
        console.log("lastUpdateTime:", lastUpdateTime.format('YYYY-MM-DD HH:mm:ss'));
        console.log("currentTime:", currentTime.format('YYYY-MM-DD HH:mm:ss'));
        console.log("timeDifferenceInSeconds:", timeDifferenceInSeconds);
        console.log("newBAC:", newBAC);
        console.log('==============================');

        // Update the BAC level in Firebase and the lastUpdated field
        await setDoc(doc(firestore, userUid, "Daily Totals", "BAC Level", moment().format("YYYY-MM-DD")), { value: newBAC, lastUpdated: moment().format('YYYY-MM-DD HH:mm:ss') });
        console.log("Daily Totals Updated");

        // Create a reference to the new collection and set the document with the same data
        const dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const bacUpdateStr = `BAC_AUTO_UPDATE_${dateTime}`;
        const newCollectionRef = doc(firestore, userUid, 'Alcohol Stuff', 'BAC Level', bacUpdateStr);
        await setDoc(newCollectionRef, { value: newBAC, lastUpdated: moment().format('YYYY-MM-DD HH:mm:ss') });

        // Update the last update timestamp
        setLastUpdateTimestamp(currentTime);
        console.log("BACDecrease: Updated lastUpdateTimestamp state");
      } else {
        console.log("BACDecrease: No BAC level document found for recent days");
      }
    }, 10000); 

    // Run the BAC decrease logic immediately when the component mounts
    return () => clearInterval(decreaseBAC);
  }, [user, selectedDate]); // Include selectedDate in the dependency array

  return null; // Assuming this component does not render anything
};

export default BACDecrease;
