import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const dbAPI = () => {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      for (let i = 1; i <= 255; i++) {
        for (let j = 1; j <= 255; j++) {
            for (let k = 1; k <= 255; k++) {
                for (let l = 1; l <= 255; l++) {
                    const apiUrl = `http://${l}.${k}.${j}.${i}:5432/api/users`;
                    console.log(`Insane Api Attempt: ${i + j + k + l}`)
                    try {
                    const response = await fetch(apiUrl);
                    if (response.ok) {
                        const responseData = await response.json();
                        setUsers(responseData);
                        console.log(`Successful fetch from: ${apiUrl}`);
                        return; // Exit the loop if successful
                    }
                    } catch (error) {
                    console.log(`Failed to fetch from ${apiUrl}:`, error.message);
                    }
                }
            }
        }
      }

      // If none of the IPs worked
      setError('Unable to connect to any API endpoint.');
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
          {users && users.map(user => (
            <Text key={user.id}>{user.username}</Text>
          ))}
        </>
      )}
    </View>
  );
};

export default dbAPI;
