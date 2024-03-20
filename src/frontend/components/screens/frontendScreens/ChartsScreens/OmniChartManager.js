import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { omniStyles as styles } from '../../../styles/ChartStyles/omniStyles';
import { homeStyles } from '../../../styles/StartUpStyles/homeStyles';

const ChartsScreen = ({ navigation }) => {
  const navigateToChart = (chartType) => {
    navigation.navigate(chartType);
  };

  return (
    <View style={styles.container}>
        <Text style={styles.graphTitle}> All Charts </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigateToChart('BACCharts')}>
        <Text style={styles.buttonText}>BAC Charts</Text>
        <Image
              source={require('../../../../assets/images/blood.png')}
              style={styles.smallIcon}
            />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigateToChart('DrunkCharts')}>
        <Text style={styles.buttonText}>Drunkenness Charts</Text>
        <Image
              source={require('../../../../assets/images/puke.png')}
              style={styles.smallIcon}
            />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigateToChart('UnitsCharts')}>
        <Text style={styles.buttonText}>Units Charts</Text>
        <Image
          source={require('../../../../assets/images/units.png')}
          style={styles.smallIcon}
          />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigateToChart('AmountSpentCharts')}>
        <Text style={styles.buttonText}>Amount Spent Charts</Text>
        <Image
              source={require('../../../../assets/images/wallet.png')}
              style={styles.smallIcon}
            />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigateToChart('TypesCharts')}>
        <Text style={styles.buttonText}>Types Charts</Text>
        <Image
              source={require('../../../../assets/images/bottle.png')}
              style={styles.smallIcon}
            />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigateToChart('NamesCharts')}>
        <Text style={styles.buttonText}>Names Charts</Text>
        <Image
              source={require('../../../../assets/images/writing.png')}
              style={styles.smallIcon}
            />
      </TouchableOpacity>
    </View>
  );
};

export default ChartsScreen;
