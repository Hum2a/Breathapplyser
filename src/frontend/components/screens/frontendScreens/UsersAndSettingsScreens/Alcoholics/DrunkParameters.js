import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { UserContext } from '../../../../../context/UserContext';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { BackButton } from '../../../../buttons/backButton';

const DrunkParametersScreen = () => {
    const { user } = useContext(UserContext);
    const firestore = getFirestore();
    const [isFormVisible, setFormVisible] = useState(false);
    const [levels, setLevels] = useState([
        { range: '0.00 - 0.01', simple: 'Sober', detailed: "You're completely unintoxicated... probably." },
        { range: '0.01 - 0.03', simple: 'Buzzed', detailed: 'Mild relaxation, slight body warmth, mood elevation.' },
        { range: '0.03 - 0.10', simple: 'Relaxed', detailed: 'Feelings of well-being, relaxation, lower inhibitions, sensation of warmth, minor impairment of reasoning and memory.' },
        { range: '0.10 - 0.15', simple: 'A Bit of a liability', detailed: 'Mild impairment of balance, speech, vision, reaction time, and hearing. Euphoria. Judgement and self-control reduced, and caution, reason, and memory impaired.' },
        { range: '0.15 - 0.20', simple: 'Visibly Drunk', detailed: 'Significant impairment of motor coordination and loss of good judgement. Speech may be slurred; balance, vision, reaction time, and hearing will be impaired.' },
        { range: '0.20 - 0.25', simple: 'Embarassing', detailed: 'Gross motor impairment and lack of physical control. Blurred vision and major loss of balance. Euphoria is reduced and dysphoria (anxiety, restlessness) begins to appear.' },
        { range: '0.25 - 0.30', simple: 'Sickly', detailed: 'Dysphoria predominates, nausea may appear. The drinker has the appearance of a "sloppy drunk."' },
        { range: '0.30 - 0.35', simple: 'Either pull or go home', detailed: 'Feeling dazed, confused, or otherwise disoriented. May need help to stand or walk. If injured, may not feel the pain. Nausea and vomiting are possible.' },
        { range: '0.35 - 0.40', simple: 'Find a friend', detailed: 'Severe intoxication, needs assistance in walking; total mental confusion. Dysphoria with nausea and some vomiting.' },
        { range: '0.40 - 0.45', simple: 'Gonna Pass out', detailed: 'Loss of consciousness. The risk of death due to respiratory arrest is possible.' },
        { range: '0.45 - 0.50', simple: 'Call an Ambulance', detailed: 'This BAC level is comparable to surgical anesthesia and is considered a very life-threatening level of alcohol intoxication.' },
        { range: '0.50 - 2.00', simple: 'Death is coming', detailed: 'Onset of coma, and likelihood of death due to respiratory arrest.' }
    ]);
    
    useEffect(() => {
        if (user) {
          const fetchLevels = async () => {
            try {
              const levelsRef = doc(firestore, user.uid, 'Drunk Parameters');
              const docSnap = await getDoc(levelsRef);
              if (docSnap.exists()) {
                setLevels(docSnap.data().levels);
              }
            } catch (error) {
              console.error('Error fetching levels:', error);
            }
          };
          fetchLevels();
        }
      }, [user]);
    
      const addLevel = () => {
        if (!newLevel.lowerBound || !newLevel.upperBound || !newLevel.simple || !newLevel.detailed) {
          Alert.alert('Error', 'Please fill out all fields.');
          return;
        }
        const newRange = `${newLevel.lowerBound} - ${newLevel.upperBound}`;
        const levelToAdd = {
          range: newRange,
          simple: newLevel.simple,
          detailed: newLevel.detailed
        };
        setLevels([...levels, levelToAdd]);
        setNewLevel({ lowerBound: '', upperBound: '', simple: '', detailed: '' });
        saveLevelsToFirebase([...levels, levelToAdd]); // Pass the updated levels array to be saved
      };
      
    
      const deleteLevel = async (index) => {
        Alert.alert(
          'Confirmation',
          'Are you sure you want to delete this drunkenness level?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', onPress: async () => {
              const newLevels = levels.filter((_, i) => i !== index);
              setLevels(newLevels); // Update state
              
              // Now, update Firebase
              try {
                const levelsRef = doc(firestore, user.uid, 'Drunk Parameters');
                await setDoc(levelsRef, { levels: newLevels });
                Alert.alert('Success', 'Drunkenness level deleted successfully.');
              } catch (error) {
                console.error('Error deleting level:', error);
                Alert.alert('Error', 'Failed to delete drunkenness level.');
              }
            } }
          ]
        );
      };
      

      const saveLevelsToFirebase = async (updatedLevels) => {
        try {
          if (user) {
            const levelsRef = doc(firestore, user.uid, 'Drunk Parameters');
            await setDoc(levelsRef, { levels: updatedLevels || levels });
            Alert.alert('Success', 'Drunkenness levels saved successfully.');
          }
        } catch (error) {
          console.error('Error saving levels:', error);
          Alert.alert('Error', 'Failed to save drunkenness levels.');
        }
      };
      
    
      const [newLevel, setNewLevel] = useState({
        lowerBound: '',
        upperBound: '',
        simple: '',
        detailed: ''
      });
      
      const toggleFormVisibility = () => {
        setFormVisible(!isFormVisible); // Toggle the visibility state
    };
    
      return (
        <View style={styles.container}>
          <BackButton />
          <ScrollView style={styles.scrollView}>
            {levels.map((level, index) => (
              <View key={index} style={styles.levelContainer}>
                <Text style={styles.levelTitle}>{level.simple}</Text>
                <Text style={styles.levelRange}>{level.range}</Text>
                <Text style={styles.levelDescription}>{level.detailed}</Text>
                <TouchableOpacity onPress={() => deleteLevel(index)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={toggleFormVisibility} style={styles.toggleButton}>
            <Text style={styles.toggleButtonText}>{isFormVisible ? 'Close Form' : 'Add New Level'}</Text>
          </TouchableOpacity>
          {isFormVisible && (
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Lower Bound"
                value={newLevel.lowerBound}
                keyboardType="numeric" // Ensure only numbers can be entered
                onChangeText={(text) => setNewLevel({ ...newLevel, lowerBound: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Upper Bound"
                value={newLevel.upperBound}
                keyboardType="numeric" // Ensure only numbers can be entered
                onChangeText={(text) => setNewLevel({ ...newLevel, upperBound: text })}
              />
                <TextInput
                  style={styles.input}
                  placeholder="Simple Description"
                  value={newLevel.simple}
                  onChangeText={(text) => setNewLevel({ ...newLevel, simple: text })}
                />
                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  placeholder="Detailed Description"
                  value={newLevel.detailed}
                  multiline
                  onChangeText={(text) => setNewLevel({ ...newLevel, detailed: text })}
                />
                <TouchableOpacity onPress={addLevel} style={styles.addButton}>
                  <Text style={styles.addButtonLabel}>Add Level</Text>
                </TouchableOpacity>
              </View>
              )}
            <TouchableOpacity onPress={() => saveLevelsToFirebase()} style={styles.saveAllButton}>
              <Text style={styles.saveAllButtonText}>Save All Levels</Text>
            </TouchableOpacity>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#fff',
      },
      scrollView: {
        marginBottom: 20,
        marginTop: 25,
      },
      levelContainer: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#00797B',
      },
      levelTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      levelRange: {
        fontSize: 16,
        marginBottom: 5,
      },
      levelDescription: {
        fontSize: 16,
        marginBottom: 10,
      },
      deleteButton: {
        alignSelf: 'flex-end',
      },
      deleteButtonText: {
        color: 'red',
      },
      formContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
      },
      descriptionInput: {
        height: 100,
        textAlignVertical: 'top',
      },
      addButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
      },
      addButtonLabel: {
        color: '#fff',
        fontWeight: 'bold',
      },
      toggleButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
      toggleButtonText: {
          color: '#fff',
          fontWeight: 'bold',
      },
      saveAllButton: {
        backgroundColor: '#4CAF50',  // A vibrant green color
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
      },
      saveAllButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
      },
      
    });
    
    export default DrunkParametersScreen;