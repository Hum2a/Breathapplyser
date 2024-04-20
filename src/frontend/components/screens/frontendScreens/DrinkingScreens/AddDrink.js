import React, { useState } from "react";
import { View, Switch, Text, TouchableOpacity, Image } from "react-native";
import ManualEntryScreen from "./ManualDrink";
import AutoEntryScreen from "./AutoDrink";
import { drinkStyles as styles } from "../../../styles/DrinkingStyles/addStyles";

const AddEntryScreen = ({ navigation }) => {
  const [isAuto, setIsAuto] = useState(true);

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
      {isAuto ? <AutoEntryScreen navigation={navigation} /> : <ManualEntryScreen navigation={navigation} />}
    </View>
  );
};

export default AddEntryScreen;
