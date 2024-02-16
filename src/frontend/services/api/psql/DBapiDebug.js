import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const DbAPI = () => {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ipAddresses = ['http://10.0.2.2:5432', 'http://10.0.2.16:5432', /* other IPs */];
    const fetchData = async (url) => {
      try {
        console.log('Trying API URL:', url);
        const response = await fetch(`${url}/api/users`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (err) {
        console.log(`Error fetching from ${url}:`, err.message);
        return null;
      }
    };

    const attemptFetch = async () => {
      for (const url of ipAddresses) {
        const data = await fetchData(url);
        if (data) {
          setUsers(data);
          console.log('Users state updated:', data);
          return; // Stop once a successful fetch is made
        }
      }
      setError('Failed to fetch from all IP addresses');
      console.log('Error state updated: Failed to fetch from all IP addresses');
    };

    attemptFetch();
  }, []);

  return (
    <View>
      {error ? (
        <>
          <Text>Error: {error}</Text>
          {console.log('Rendering error:', error)}
        </>
      ) : (
        <>
          <Text>Users:</Text>
          {console.log('Rendering users...')}
          {users ? (
            users.map(user => {
              console.log('Rendering user:', user);
              return <Text key={user.id}>{user.username}</Text>;
            })
          ) : (
            <Text>Loading...</Text>
          )}
        </>
      )}
    </View>
  );
};

export default DbAPI;
