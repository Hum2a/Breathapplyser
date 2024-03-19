import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import moment from 'moment';

const BACDecrease = ({ user, updateCount }) => {
  console.log("BACDecrease: Component Rendered");
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment()); // Start with the current date

  const BACDecreaseRatePerHour = 0.015; // Original decrease rate per hour
  const BACDecreaseRatePerSecond = BACDecreaseRatePerHour / 3600; // Convert to per second
  const RefreshTimer = 600000

  useEffect(() => {
    if (!user) return;

    const decreaseBAC = setInterval(async () => {
      const firestore = getFirestore();
      const userUid = user.uid;

      let bacLevelDoc;
      while (!bacLevelDoc) {
        const selectedDateStr = selectedDate.format('YYYY-MM-DD');
        console.log("Selected Date 1: ", selectedDateStr);
        
        const bacLevelRef = doc(firestore, userUid, "Daily Totals", "BAC Level", selectedDateStr);
        bacLevelDoc = await getDoc(bacLevelRef);
        
        if (bacLevelDoc.exists()) {
          console.log("BAC Level Document Found:", bacLevelDoc.data());
          break;
        }
        
        setSelectedDate(prevDate => prevDate.clone().subtract(1, 'days'));
        console.log("Selected Date 2: ", selectedDate.format('YYYY-MM-DD'));
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
        await setDoc(newCollectionRef, { value: newBAC, lastUpdated: moment().format('YYYY-MM-DD HH:mm:ss') });

        setLastUpdateTimestamp(currentTime);
        console.log("BACDecrease: Updated lastUpdateTimestamp state");
      } else {
        console.log("BACDecrease: No BAC level document found for recent days");
      }
    }, RefreshTimer); 

    return () => clearInterval(decreaseBAC);
  }, [user, selectedDate]);

  return null; // Assuming this component does not render anything
};

export default BACDecrease;
