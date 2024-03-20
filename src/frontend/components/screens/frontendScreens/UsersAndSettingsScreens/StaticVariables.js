import React from 'react';
import { View } from 'react-native';
import BACDecreaseRefreshPicker from './Statics/BACDecreaseRefreshPicker';
import { StaticVariablesStyles as styles } from '../../../styles/SettingStyles/staticStyles';

const StaticVariables = () => {
  return (
    <View style={styles.container}>
      <BACDecreaseRefreshPicker />
    </View>
  );
};

export default StaticVariables;
