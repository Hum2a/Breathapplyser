import React from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
const DeveloperSettings = ({ navigation }) => {

    const navigateToSetting = (settingLabel) => {
        navigation.navigate(settingLabel);
    };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Developer Settings</Text>

        <TouchableOpacity style={styles.setting} onPress={() => navigateToSetting('Developer Alcohol Stuff')}>
            <Text style={styles.label}>Alcohol Stuff</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.setting} onPress={() => navigateToSetting('Developer Animations')}>
            <Text style={styles.label}>Animations</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.setting} onPress={() => navigateToSetting('Developer BAC Refresh Rate')}>
            <Text style={styles.label}>BAC Refresh Rate</Text>
        </TouchableOpacity>
{/* 
      <TouchableOpacity style={styles.setting} onPress={() => navigateToSetting('Developer Common Drinks Controls')}>
        <Text style={styles.label}>Common Drinks Controls</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.setting} onPress={() => navigateToSetting('Developer Daily Totals')}>
            <Text style={styles.label}>Daily Totals</Text>
        </TouchableOpacity>

      {/* <TouchableOpacity style={styles.setting} onPress={() => navigateToSetting('Developer Display')}>
        <Text style={styles.label}>Display</Text>
      </TouchableOpacity> */}

      {/* <TouchableOpacity style={styles.setting} onPress={() => navigateToSetting('Developer Drunk Parameters')}>
        <Text style={styles.label}>Drunk Parameters</Text>
      </TouchableOpacity> */}

      {/* <TouchableOpacity style={styles.setting} onPress={() => navigateToSetting('Developer Emojis')}>
        <Text style={styles.label}>Emojis</Text>
      </TouchableOpacity> */}

      {/* <TouchableOpacity style={styles.setting} onPress={() => navigateToSetting('Developer Limits')}>
        <Text style={styles.label}>Limits</Text>
      </TouchableOpacity> */}

      {/* <TouchableOpacity style={styles.setting} onPress={() => navigateToSetting('Developer Notification Preferences')}>
        <Text style={styles.label}>Notification Preferences</Text>
      </TouchableOpacity> */}

      {/* <TouchableOpacity style={styles.setting} onPress={() => navigateToSetting('Developer Recent Drinks Controls ')}>
        <Text style={styles.label}>Recent Drinks Controls</Text>
      </TouchableOpacity> */}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      backgroundColor: '#F0F4F8',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
      textAlign: 'center',
    },
    setting: {
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginBottom: 10,
    },
    label: {
      fontSize: 18,
      color: '#666',
    },
    text: {
        fontSize: 16,
        color: '#000',
    }
  });
  

export default DeveloperSettings;
