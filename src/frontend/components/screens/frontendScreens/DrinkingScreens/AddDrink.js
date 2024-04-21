import React, { useState, useEffect, useContext } from "react";
import { View, Switch, Text, TouchableOpacity, Image } from "react-native";
import ManualEntryScreen from "./ManualDrink";
import AutoEntryScreen from "./AutoDrink";
import { drinkStyles as styles, manualStyles } from "../../../styles/DrinkingStyles/addStyles";
import moment from "moment";
import { UserContext } from "../../../../context/UserContext";
import { getFirestore, collection, getDoc, getDocs, doc } from "@firebase/firestore";

const AddEntryScreen = ({ navigation }) => {
  const [isAuto, setIsAuto] = useState(true);
  const [totalDrinks, setTotalDrinks] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { user } = useContext(UserContext);
  const firestore = getFirestore();

  useEffect(() => {
    const fetchTotals = async () => {
      const selectedDateStr = moment().format('YYYY-MM-DD');
      
      // Define references to the Firestore documents
      const drinksRef = collection(firestore, user.uid, "Alcohol Stuff", "Entries", selectedDateStr, "EntryDocs");
      const amountSpentRef = doc(firestore, user.uid, "Daily Totals", "Amount Spent", selectedDateStr);
      const unitsIntakeRef = doc(firestore, user.uid, "Daily Totals", "Unit Intake", selectedDateStr);

      try {
        // Fetch total drinks
        const drinksSnapshot = await getDocs(drinksRef);
        setTotalDrinks(drinksSnapshot.docs.length); // Assuming each document in EntryDocs represents a drink

        // Fetch total spending
        const amountSpentSnapshot = await getDoc(amountSpentRef);
        if (amountSpentSnapshot.exists()) {
          setTotalSpending(amountSpentSnapshot.data().value);
        } else {
          setTotalSpending(0);
        }

        // Fetch total units
        const unitsIntakeSnapshot = await getDoc(unitsIntakeRef);
        if (unitsIntakeSnapshot.exists()) {
          setTotalUnits(unitsIntakeSnapshot.data().value);
        } else {
          setTotalUnits(0);
        }
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    };

    if (user) {
      fetchTotals();
    }
  }, [selectedDate, user]);

  const toggleEntryMode = () => {
    setIsAuto(!isAuto);
  };

  const back = () => {
    navigation.pop(1);
  };

  return (
    <View style={{backgroundColor: '#FFFFFF'}}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <TouchableOpacity style={styles.iconContainer} onPress={back}>
          <Image source={require('../../../../assets/images/back_arrow.png')} style={styles.icon} />
        </TouchableOpacity>
        <Switch
          value={isAuto}
          onValueChange={toggleEntryMode}
          style={styles.switch}
        />
        <Text style={styles.text}>{isAuto ? 'Auto Entry' : 'Manual Entry'}</Text>
      </View>
        <View style={manualStyles.statsContainer}>
          <Text style={manualStyles.statText}>Total Drinks: {totalDrinks}</Text>
          <Text style={manualStyles.statText}>Units: {totalUnits}</Text>
          <Text style={manualStyles.statText}>Spending: £{totalSpending}</Text>
        </View>
      {isAuto ? <AutoEntryScreen navigation={navigation} /> : <ManualEntryScreen navigation={navigation} />}
    </View>
  );
};

export default AddEntryScreen;
