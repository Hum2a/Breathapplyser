// dbAPI.js
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import getNetworkInfo from '../../../backend/utils/networkInfo';

const dbAPI = () => {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { ipv4Address } = await getNetworkInfo();

        // List of API URLs to try
        const apiUrls = [
          `http://${ipv4Address}:5432/api/users`,
          `http://${ipv4Address}:8081/api/users`,
          `http://10.0.2.2:8081/api/users`,
          `http://10.0.2.2:5432/api/users`,
          `http://192.168.43.112:5432/api/users`,
          `http://192.168.43.112:8081/api/users`
        ];

        let responseData = null;

        // Try each API URL until one succeeds
        for (const apiUrl of apiUrls) {
          const response = await fetch(apiUrl);

          if (response.ok) {
            responseData = await response.json();
            break; // Exit the loop if the request was successful
          }
        }

        if (!responseData) {
          throw new Error('All requests failed'); // Handle this case appropriately
        }

        setUsers(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'An error occurred');
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

export default dbAPI;
