import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { omniStyles as styles } from '../../../styles/ChartStyles/omniStyles';
import FatManAnimation from '../../../animations/fatman';
import WalletAnimation from '../../../animations/wallet';
import PenWritingAnimation from '../../../animations/penWriting';
import BloodAnimation from '../../../animations/blood';
import { BackButton } from '../../../buttons/backButton';

const ChartsScreen = ({ navigation }) => {
  const [playFatManAnimation, setPlayFatManAnimation] = useState(true);
  const [playWalletAnimation, setPlayWalletAnimation] = useState(true);
  const [playPenWritingAnimation, setPlayPenWritingAnimation] = useState(true);
  const [playBloodAnimation, setPlayBloodAnimation] = useState(true);

  const navigateToChart = (chartType) => {
    navigation.navigate(chartType);
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.graphTitle}> All Charts </Text>
      <TouchableOpacity onPressIn={() => setPlayBloodAnimation(true)} onPressOut={() => { setPlayBloodAnimation(true); navigateToChart('BACCharts'); }}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>BAC Charts</Text>
          <BloodAnimation play={playBloodAnimation} frameRate={45} />
        </View>
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
          <FatManAnimation play={playFatManAnimation} frameRate={24} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPressIn={() => setPlayWalletAnimation(true)} onPressOut={() => { setPlayWalletAnimation(false); navigateToChart('AmountSpentCharts'); }}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Amount Spent Charts</Text>
          <WalletAnimation play={playWalletAnimation} frameRate={24} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigateToChart('TypesCharts')}>
        <Text style={styles.buttonText}>Types Charts</Text>
        <Image
          source={require('../../../../assets/images/bottle.png')}
          style={styles.smallIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPressIn={() => setPlayPenWritingAnimation(true)} onPressOut={() => { setPlayPenWritingAnimation(false); navigateToChart('NamesCharts'); }}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Names Charts</Text>
          <PenWritingAnimation play={playPenWritingAnimation} frameRate={24} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChartsScreen;
