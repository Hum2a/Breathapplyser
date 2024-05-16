import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import BACDecreaseRefreshPicker from './Alcoholics/BACDecreaseRefreshPicker';
import { AlcoholicsStyles as styles } from '../../../styles/SettingStyles/alcoholicsStyles';
import { BackButton } from '../../../buttons/backButton';

const AlcoholicsVariables = ({user, navigation}) => {

  const navigateToBACRefreshRate = () => {
    navigation.navigate('BACRefreshRate');
  };
  
  const navigateToDrunkParemeters = () => {
    navigation.navigate('DrunkParams');
  };

  const navigateToVenueManagement = () => {
    navigation.navigate('Venue Management');
  };
   const navigateToBACFeedback = () => {
    navigation.navigate('BAC Feedback');
   }

  return (
    <View style={styles.container}>
      <BackButton/>
      <Text style={styles.title}> Alcoholics Settings </Text>
      <TouchableOpacity onPress={navigateToBACRefreshRate} style={styles.button}>
        <Text style={styles.buttonText}>BAC Refresh Rate</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToDrunkParemeters} style={styles.button}>
        <Text style={styles.buttonText}>Drunkness Parameters</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToVenueManagement} style={styles.button}>
        <Text style={styles.buttonText}>Venue Management</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToBACFeedback} style={styles.button}>
        <Text style={styles.buttonText}>BAC Feedback</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AlcoholicsVariables;
