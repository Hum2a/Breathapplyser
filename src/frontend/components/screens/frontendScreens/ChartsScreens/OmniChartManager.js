import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { omniStyles as styles } from '../../../styles/ChartStyles/omniStyles';
import FatManAnimation from '../../../animations/fatman';

const ChartsScreen = ({ navigation }) => {
  const [playFatManAnimation, setPlayFatManAnimation] = useState(false);

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
      <TouchableWithoutFeedback style={styles.button} onPressIn={() => setPlayFatManAnimation(true)} onPressOut={() => { setPlayFatManAnimation(false); navigateToChart('UnitsCharts'); }}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Units Charts</Text>
          <FatManAnimation play={playFatManAnimation} frameRate={24} />
        </View>
      </TouchableWithoutFeedback>

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
