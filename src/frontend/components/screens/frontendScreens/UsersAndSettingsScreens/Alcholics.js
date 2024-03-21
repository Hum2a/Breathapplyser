import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import BACDecreaseRefreshPicker from './Alcoholics/BACDecreaseRefreshPicker';
import { AlcoholicsStyles as styles } from '../../../styles/SettingStyles/alcoholicsStyles';

const AlcoholicsVariables = ({user, navigation}) => {

  const navigateToBACRefreshRate = () => {
    navigation.navigate('BACRefreshRate');
  };
  
  const navigateToDrunkParemeters = () => {
    navigation.navigate('DrunkParams');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigateToBACRefreshRate} style={styles.button}>
        <Text style={styles.buttonText}> BAC Refresh Rate</Text>
        </TouchableOpacity>

      <TouchableOpacity onPress={navigateToDrunkParemeters} style={styles.button}>
        <Text style={styles.buttonText}> Drunkness Parameters</Text>
        </TouchableOpacity>
    </View>
  );
};

export default AlcoholicsVariables;
