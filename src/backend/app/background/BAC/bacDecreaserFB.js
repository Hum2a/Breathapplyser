import React, { useContext, useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import moment from 'moment';
import { UserContext } from '../../../../frontend/context/UserContext';

const BACDecreaseFB = ({ user }) => {
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment()); // Start with the current date
  const [refreshInterval, setRefreshInterval] = useState(10000); // Default value

  const BACDecreaseRatePerHour = 0.015; // Original decrease rate per hour
  const BACDecreaseRatePerSecond = BACDecreaseRatePerHour / 3600; // Convert to per second

  useEffect(() => {
    // Fetch the refresh interval from Firestore
    const fetchRefreshInterval = async () => {
      const firestore = getFirestore();
      const refreshRateRef = doc(firestore, user.uid, "BAC Refresh Rate");

      try {
        const docSnap = await getDoc(refreshRateRef);
        if (docSnap.exists()) {
          console.log("Refresh interval fetched:", docSnap.data().refreshInterval);
          setRefreshInterval(docSnap.data().refreshInterval);
        } else {
          console.log("No refresh interval found, using default.");
        }
      } catch (error) {
        console.error("Error fetching refresh interval:", error);
      }
    };

    if (user) {
      fetchRefreshInterval();
    }
  }, [user]);

  const decreaseBAC = async () => {
    if (!user) return;

    const firestore = getFirestore();
    const userUid = user.uid;  

    let bacLevelDoc;
    let currentDate = selectedDate;

    while (!bacLevelDoc) {
      const selectedDateStr = currentDate.format('YYYY-MM-DD');
      console.log("Selected Date: ", selectedDateStr);
      
      const bacLevelRef = doc(firestore, userUid, "Daily Totals", "BAC Level", selectedDateStr);
      bacLevelDoc = await getDoc(bacLevelRef);
      
      if (bacLevelDoc.exists()) {
        console.log("BAC Level Document Found:", bacLevelDoc.data());
        break;
      }

      // Move to the previous day
      currentDate = currentDate.clone().subtract(1, 'days');
    }      

    if (bacLevelDoc) {
      let currentBAC = bacLevelDoc.data()?.value;
      
      // Check if the current BAC is NaN, and if so, change it to 0
      currentBAC = isNaN(currentBAC) ? 0 : currentBAC;

      const lastUpdateTime = moment(bacLevelDoc.data()?.lastUpdated, 'YYYY-MM-DD HH:mm:ss');
      const currentTime = moment();
      const timeDifferenceInSeconds = currentTime.diff(lastUpdateTime, 'seconds');
      const newBAC = Math.max(0, currentBAC - BACDecreaseRatePerSecond * timeDifferenceInSeconds);

      console.log('==============================');
      console.log("currentBAC:", currentBAC);
      console.log("lastUpdateTime:", lastUpdateTime.format('YYYY-MM-DD HH:mm:ss'));
      console.log("currentTime:", currentTime.format('YYYY-MM-DD HH:mm:ss'));
      console.log("timeDifferenceInSeconds:", timeDifferenceInSeconds);
      console.log("newBAC:", newBAC);
      console.log('==============================');

      await setDoc(doc(firestore, userUid, "Daily Totals", "BAC Level", moment().format("YYYY-MM-DD")), { value: newBAC, lastUpdated: moment().format('YYYY-MM-DD HH:mm:ss') });
      console.log("Daily Totals Updated");

      const dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
      const bacUpdateStr = `BAC_AUTO_UPDATE_${dateTime}`;
      const newCollectionRef = doc(firestore, userUid, 'Alcohol Stuff', 'BAC Level', bacUpdateStr);
      await setDoc(newCollectionRef, { value: newBAC, date: moment().format('YYYY-MM-DD HH:mm:ss') });

      setLastUpdateTimestamp(currentTime);
      console.log("BACDecrease: Updated lastUpdateTimestamp state");
    } else {
      console.log("BACDecrease: No BAC level document found for recent days");
    }
  };

  useEffect(() => {
    if (!user) return;

    // Initial call to decreaseBAC
    decreaseBAC();

    // Set interval to call decreaseBAC based on the fetched refreshInterval
    const decreaseBACTimer = setInterval(decreaseBAC, refreshInterval);

    return () => clearInterval(decreaseBACTimer);
  }, [user, refreshInterval]); // Include refreshInterval in dependency array

  return null; // Assuming this component does not render anything
};

export default BACDecreaseFB;
