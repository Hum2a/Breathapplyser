import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { auth, firestore } from '../../../../../backend/firebase/database/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useUser } from '../../../../context/UserContext';
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import { BackButton } from '../../../buttons/backButton';
import Dialog from 'react-native-dialog';

const DataManagerScreen = ({ navigation }) => {
  const { logout } = useUser();
  const [userData, setUserData] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

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
    setDialogVisible(true);
  };

  const confirmDeleteAccount = async () => {
    const user = auth.currentUser;
    const userProfileRef = doc(firestore, "Profile", user.uid);
    await deleteDoc(userProfileRef);

    user.delete().then(() => {
      logout();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Start' }],
        })
      );
    }).catch((error) => {
      console.error("Failed to delete account: " + error.message);
    });
    setDialogVisible(false);
  };

  const cancelDeleteAccount = () => {
    setDialogVisible(false);
  };

  return (
    <View style={styles.container}>
      <BackButton/>
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
      <Dialog.Container 
        visible={dialogVisible}
        contentStyle={dialogStyles.container}
      >
        <Dialog.Title style={dialogStyles.title}>Delete Account</Dialog.Title>
        <Dialog.Description style={dialogStyles.description}>
          Are you sure you want to delete your account? This cannot be undone.
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={cancelDeleteAccount} style={dialogStyles.cancelButton} />
        <Dialog.Button label="Delete" onPress={confirmDeleteAccount} style={dialogStyles.deleteButton} />
      </Dialog.Container>

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

export const dialogStyles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0277BD', // Light blue
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#004C8C', // Slightly darker blue for contrast
    marginBottom: 20,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  cancelButton: {
    color: '#CDDC39', // Yellowish-green for the cancel button
  },
  deleteButton: {
    color: '#F44336', // Red for the delete button
  },
  container: {
    backgroundColor: 'white', // White background for the dialog
    borderRadius: 8, // Rounded corners
    padding: 20, // Padding inside the dialog
    shadowColor: '#000', // Shadow for elevation effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10, // Android elevation
    borderWidth: 1, // Optional: if you want a border
    borderColor: '#DDDDDD', // Light gray border
  },
  input: {
    borderColor: '#CCCCCC', // Light gray border for input fields
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10, // Space between input field and next element
    color: '#333333', // Dark gray color for text input
    backgroundColor: '#F7F7F7', // Very light gray background for input
  }
});


export default DataManagerScreen;
