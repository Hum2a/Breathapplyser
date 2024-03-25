import React, { useState } from "react";
import { View, Switch, Text } from "react-native";
import ManualEntryScreen from "./ManualDrink";
import AutoEntryScreen from "./AutoDrink";

const AddEntryScreen = ({ navigation }) => {
  const [isAuto, setIsAuto] = useState(true);

  const toggleEntryMode = () => {
    setIsAuto(!isAuto);
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Switch
          value={isAuto}
          onValueChange={toggleEntryMode}
        />
        <Text>{isAuto ? 'Auto Entry' : 'Manual Entry'}</Text>
      </View>
      {isAuto ? <AutoEntryScreen navigation={navigation} /> : <ManualEntryScreen navigation={navigation} />}
    </View>
  );
};

export default AddEntryScreen;
