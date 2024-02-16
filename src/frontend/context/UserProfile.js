import React from 'react';
import { View, Text, Button } from 'react-native';
import { useUser } from './UserContext';

const UserProfileComponent = () => {
  const { user, setUser } = useUser();

  const handleUpdateProfile = () => {
    if (user) {
      // Example action: Update the user's profile
      // This could involve making an API call to update user data
      // For demonstration, let's just update the user's name
      const updatedUser = { ...user, username: 'NewUsername' };
      setUser(updatedUser);

      // Here, you would typically make an API call to update the user's data
      // and then update the context with the new user data
    }
  };

  if (!user) {
    return <Text>Loading user data...</Text>;
  }

  return (
    <View>
      <Text>User ID: {user.id}</Text>
      <Text>Username: {user.username}</Text>
      <Text>Email: {user.email}</Text>
      {/* Add other user details you wish to display */}

      <Button title="Update Profile" onPress={handleUpdateProfile} />
    </View>
  );
};

export default UserProfileComponent;
