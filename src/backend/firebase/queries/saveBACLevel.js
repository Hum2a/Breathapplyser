import { getFirestore, doc, setDoc, query, orderBy, limit, getDocs, collection } from 'firebase/firestore';
import moment from 'moment';
import calculateBACIncrease from '../../../frontend/utils/calculations/calculateBAC';

const firestore = getFirestore();

export const saveBACLevel = async (user, units, userProfile, details) => {
    if (!user) {
      console.error("User data is not available");
      return;
    }
  
    const BACIncrease = calculateBACIncrease(units, userProfile);
    const dateTimeString = moment().format('YYYYMMDD_HHmmss');
    const BACLevelDocId = `BAC_${dateTimeString}`;
  
    try {
      // Fetch the most recent BAC document from 'BAC Level' collection
      const latestBACQuery = query(collection(firestore, user.uid, "Alcohol Stuff", "BAC Level"), orderBy("date", "desc"), limit(1));
      const querySnapshot = await getDocs(latestBACQuery);
      let latestBAC = 0;
  
      if (!querySnapshot.empty) {
        latestBAC = querySnapshot.docs[0].data().currentBAC;
      }
  
      // Calculate updated BAC based on the latest BAC
      const updatedBAC = latestBAC + BACIncrease;

      const combinedDateTime = moment(details.selectedDate).set({
        hour: moment(details.selectedEndTime, 'HH:mm').hour(),
        minute: moment(details.selectedEndTime, 'HH:mm').minute()
    }).toDate();
  
      // Create a new document in 'BAC Level' collection with updated BAC value
      await setDoc(doc(firestore, user.uid, "Alcohol Stuff", "BAC Level", BACLevelDocId), {
        currentBAC: updatedBAC,
        timestamp: new Date(),
        start_time: moment(details.selectedStartTime, 'HH:mm').toISOString(),
        end_time: moment(details.selectedEndTime, 'HH:mm').toISOString(),
        date: combinedDateTime // Updated date field
    });
  
      console.log('New BAC Level document added successfully');
    } catch (error) {
      console.error('Error saving BAC Level:', error);
    }
  };
  
