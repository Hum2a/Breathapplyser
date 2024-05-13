import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { achievementStyles as styles } from '../../../styles/StatsStyles/achievementsStyles';
import { BackButton } from '../../../buttons/backButton';

const Achievements = () => {
  // Sample data for achievements
  const [achievements, setAchievements] = useState([
    { id: '1', title: 'NHS BFF', description: 'Pass Out' },
    { id: '2', title: 'Get help', description: 'Go out every day of the week' },
    { id: '3', title: 'Life of the party', description: 'Black out every day of the week'}
    
  ]);

  // Render an individual achievement item
  const renderAchievementItem = ({ item }) => (
    <View style={styles.achievementItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.header}>Achievements</Text>
      <FlatList
        data={achievements}
        renderItem={renderAchievementItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};


export default Achievements;
