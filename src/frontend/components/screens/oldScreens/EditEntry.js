import React from 'react';
import { View, Text } from 'react-native';
import EntriesScreen from '../backendScreens/Entries';
import { editStyles } from '../../styles/styles';
import { globalData } from '../../../utils/database';

const EditEntriesScreen = () => {
  return (
    <View style={editStyles.container}>
      <Text style={editStyles.title}>Edit Entries</Text>
      <EntriesScreen title="Entries" data={globalData.entries} />
    </View>
  );
};

export default EditEntriesScreen;
