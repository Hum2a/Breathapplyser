import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { UserContext } from '../../../../../context/UserContext';

const emojiRepresentations = {
  Sober: '😐',
  Buzzed: '😉',
  Relaxed: '😊',
  'A Bit of a liability': '🫠',
  'Visibly Drunk': '🙃',
  Embarassing: '🫣',
  Sickly: '🥲',
  'Either pull or go home': '🫡',
  'Find a friend': '🤐',
  'Gonna Pass out': '🫨',
  'Call and Ambulance': '😷',
  'Death is coming': '🫥',
};

const EmojiSettingsScreen = () => {
  const { user } = useContext(UserContext);
  const [emojis, setEmojis] = useState({}); // Initially set to an empty object
  const firestore = getFirestore();

  useEffect(() => {
    const fetchUserEmojis = async () => {
      try {
        if (!user) return;

        const userDocRef = doc(firestore, user.uid, 'Emojis');
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setEmojis(docSnap.data()); // Set emojis if exist in Firebase
        } else {
          // Set default emojis if user emojis not found in Firebase
          setEmojis({
            sober: emojiRepresentations.Sober,
            buzzed: emojiRepresentations.Buzzed,
            relaxed: emojiRepresentations.Relaxed,
            liability: emojiRepresentations['A Bit of a liability'],
            drunk: emojiRepresentations['Visibly Drunk'],
            Embarassing: emojiRepresentations.Embarassing,
            sickly: emojiRepresentations.Sickly,
            goHome: emojiRepresentations['Either pull or go home'],
            friend: emojiRepresentations['Find a friend'],
            passout: emojiRepresentations['Gonna Pass out'],
            ambulance: emojiRepresentations['Call and Ambulance'],
            death: emojiRepresentations['Death is coming'],
          });
        }
      } catch (error) {
        console.error('Error fetching user emojis:', error);
      }
    };

    fetchUserEmojis(); // Fetch user emojis when component mounts
  }, [firestore, user]);

  const handleSave = async () => {
    try {
      if (user) {
        const userDocRef = doc(firestore, user.uid, 'Emojis');
        await setDoc(userDocRef, emojis, { merge: true });
        console.log('User emojis updated:', emojis);
      }
    } catch (error) {
      console.error('Error updating user emojis:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Emoji Settings</Text>

      <View style={styles.option}>
        <Text style={styles.label}>Sober Emoji:</Text>
        <TextInput
          style={styles.input}
          value={emojis.sober || ''}
          onChangeText={(text) => setEmojis({ ...emojis, sober: text })}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>Buzzed Emoji:</Text>
        <TextInput
          style={styles.input}
          value={emojis.buzzed || ''}
          onChangeText={(text) => setEmojis({ ...emojis, buzzed: text })}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>Relaxed Emoji:</Text>
        <TextInput
          style={styles.input}
          value={emojis.relaxed || ''}
          onChangeText={(text) => setEmojis({ ...emojis, relaxed: text })}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>A Bit of a liability Emoji:</Text>
        <TextInput
          style={styles.input}
          value={emojis.liability || ''}
          onChangeText={(text) => setEmojis({ ...emojis, liability: text })}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>Visibily Drunk Emoji:</Text>
        <TextInput
          style={styles.input}
          value={emojis.drunk || ''}
          onChangeText={(text) => setEmojis({ ...emojis, drunk: text })}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>Embarassing Emoji:</Text>
        <TextInput
          style={styles.input}
          value={emojis.Embarassing || ''}
          onChangeText={(text) => setEmojis({ ...emojis, Embarassing: text })}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>Sickly Emoji:</Text>
        <TextInput
          style={styles.input}
          value={emojis.sickly || ''}
          onChangeText={(text) => setEmojis({ ...emojis, sickly: text })}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>Pull or go home Emoji:</Text>
        <TextInput
          style={styles.input}
          value={emojis.goHome || ''}
          onChangeText={(text) => setEmojis({ ...emojis, goHome: text })}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>Find a Friend Emoji:</Text>
        <TextInput
          style={styles.input}
          value={emojis.friend || ''}
          onChangeText={(text) => setEmojis({ ...emojis, friend: text })}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>Pass Out Emoji:</Text>
        <TextInput
          style={styles.input}
          value={emojis.passout || ''}
          onChangeText={(text) => setEmojis({ ...emojis, passout: text })}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>Call an Ambulance Emoji:</Text>
        <TextInput
          style={styles.input}
          value={emojis.ambulance || ''}
          onChangeText={(text) => setEmojis({ ...emojis, ambulance: text })}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>Death Emoji:</Text>
        <TextInput
          style={styles.input}
          value={emojis.death || ''}
          onChangeText={(text) => setEmojis({ ...emojis, death: text })}
        />
      </View>

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
