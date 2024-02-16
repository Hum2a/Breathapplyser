// dbAPI.js
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';
import dbURL from '../../../utils/config/dbURL'

const DbAPI = () => {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${dbURL.serverBaseUrl}/api/users`; // Use the base URL from dbConfig
        const response = await axios.get(apiUrl);

        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An error occurred');
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      {error ? (
        <Text>Error: {error}</Text>
      ) : (
        <>
          <Text>Users:</Text>
          {users ? (
            users.map(user => (
              <Text key={user.id}>{user.username}</Text>
            ))
          ) : (
            <Text>Loading...</Text>
          )}
        </>
      )}
    </View>
  );
};

export default DbAPI;
