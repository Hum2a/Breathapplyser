import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { auth, firestore } from '../../../../../backend/firebase/database/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useUser } from '../../../../context/UserContext';
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';

const DataManagerScreen = ({ navigation }) => {
  const { logout } = useUser();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserData({
        email: user.email,
        name: user.displayName,
        createdAt: user.metadata.creationTime ? moment(user.metadata.creationTime).format('MMMM Do YYYY, h:mm:ss a') : 'N/A',
      });
    }
  }, []);

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteAccount(), style: "destructive" }
      ]
    );
  };

  const deleteAccount = async () => {
    const user = auth.currentUser;
    const userProfileRef = doc(firestore, "Profile", user.uid);
    await deleteDoc(userProfileRef);

    user.delete().then(() => {
      Alert.alert("Account Deleted", "Your account has been successfully deleted.");
      logout();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Start' }],
        })
      );
    }).catch((error) => {
      Alert.alert("Error", "Failed to delete account: " + error.message);
    });
  };

  return (
    <View style={styles.container}>
      {userData ? (
        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{userData.name || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userData.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Account Created:</Text>
            <Text style={styles.value}>{userData.createdAt}</Text>
          </View>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteButtonText}>Delete Account</Text>
            <Image
              source={require('../../../../assets/images/bin.png')}
              style={styles.binIcon}
              />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.noDataText}>No user data available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0faff',
  },
  infoContainer: {
    backgroundColor: 'white',
    width: '90%',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: '#0277bd',
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    color: '#0277bd',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 20,
    elevation: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  noDataText: {
    color: '#0277bd',
    fontSize: 18,
  },
  binIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    margin: 5,
  }
});

export default DataManagerScreen;
