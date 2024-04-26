import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { omniStyles as styles } from '../../../styles/ChartStyles/omniStyles';
import FatManAnimation from '../../../animations/fatman';
import WalletAnimation from '../../../animations/wallet';
import { BackButton } from '../../../buttons/backButton';

const ChartsScreen = ({ navigation }) => {
  const [playFatManAnimation, setPlayFatManAnimation] = useState(false);
  const [playWalletAnimation, setPlayWalletAnimation] = useState(false);

  const navigateToChart = (chartType) => {
    navigation.navigate(chartType);
  };

  return (
    <View style={styles.container}>
      <BackButton />
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
      <TouchableOpacity onPressIn={() => setPlayFatManAnimation(true)} onPressOut={() => { setPlayFatManAnimation(false); navigateToChart('UnitsCharts'); }}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Units Charts</Text>
          <FatManAnimation play={playFatManAnimation} frameRate={30} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPressIn={() => setPlayWalletAnimation(true)} onPressOut={() => { setPlayWalletAnimation(false); navigateToChart('AmountSpentCharts'); }}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Amount Spent Charts</Text>
          <WalletAnimation play={playWalletAnimation} frameRate={41} />
        </View>
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
