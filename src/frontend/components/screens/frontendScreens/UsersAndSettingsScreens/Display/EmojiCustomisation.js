import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { UserContext } from '../../../../../context/UserContext';
import { BackButton } from '../../../../buttons/backButton';

const EmojiSettingsScreen = () => {
  const { user } = useContext(UserContext);
  const [emojis, setEmojis] = useState({}); // Initially set to an empty object
  const [drunkParameters, setDrunkParameters] = useState([]);
  const firestore = getFirestore();

  useEffect(() => {
    if (user) {
      // Fetch drunk parameters
      const parametersRef = doc(firestore, user.uid, 'Drunk Parameters');
      getDoc(parametersRef).then((docSnap) => {
        if (docSnap.exists()) {
          setDrunkParameters(docSnap.data().levels);
        }
      });

      // Fetch emojis
      const userDocRef = doc(firestore, user.uid, 'Emojis');
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          setEmojis(docSnap.data()); // Set emojis if exist in Firebase
        }
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (user) {
      const userDocRef = doc(firestore, user.uid, 'Emojis');
      try {
        await setDoc(userDocRef, emojis, { merge: true });
        alert('User emojis updated successfully.');
      } catch (error) {
        console.error('Error updating user emojis:', error);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <Text style={styles.header}>Emoji Settings</Text>
      {drunkParameters.map((param, index) => (
        <View key={index} style={styles.option}>
          <Text style={styles.label}>{param.simple} Emoji:</Text>
          <TextInput
            style={styles.input}
            value={emojis[param.simple] || ''}
            onChangeText={(text) => setEmojis({ ...emojis, [param.simple]: text })}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b6e6fd',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  option: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EmojiSettingsScreen;
