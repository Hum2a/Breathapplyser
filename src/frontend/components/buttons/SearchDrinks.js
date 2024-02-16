import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import axios from 'axios';
import { addStyles } from '../styles/styles';

export const SearchDrinks = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [drinkMenu, setDrinkMenu] = useState([]);

  const handleOpenDrinkMenu = async () => {
    try {
      const response = await axios.get('https://api.nutritionix.com/v1_1/search/drinks', {
        params: {
          appId: 'c9aa71dd',
          appKey: '7c1fa9807ccaedf7e0df883d63cf23f7',
          query: 'drinks',
        },
      });
      
      setDrinkMenu(response.data.hits);
      setModalVisible(true);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleCloseDrinkMenu = () => {
    setModalVisible(false);
  };

  const renderDrinkItem = ({ item }) => {
    return (
      <View>
        <Text>{item.fields.item_name}</Text>
      </View>
    );
  };
  
  return (
    <View>
      <TouchableOpacity 
      onPress={handleOpenDrinkMenu}
      style={addStyles.button}>
        <Text>Open Drink Menu</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <TouchableOpacity onPress={handleCloseDrinkMenu}>
          <Text>Close Drink Menu</Text>
        </TouchableOpacity>
        
        <FlatList
          data={drinkMenu}
          renderItem={renderDrinkItem}
          keyExtractor={(item) => item.fields.item_id}
        />
      </Modal>
    </View>
  );
};
