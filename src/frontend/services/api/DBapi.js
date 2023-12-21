import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getServerBaseUrl } from '../../utils/config/dbURL';


const DbAPI = () => {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        console.log('Imported getServerBaseUrl:', getServerBaseUrl);
        // const apiUrl = `${getServerBaseUrl()}/api/users`;
        const apiUrl = "http://10.0.2.2:5432/api/users";
        console.log(`API URL: ${apiUrl}`);

        const response = await fetch(apiUrl);
        console.log('Response received:', response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data parsed as JSON:', data);

        setUsers(data);
        console.log('Users state updated:', data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An error occurred');
        console.log('Error state updated:', err.message);
      }
    };

    fetchData();
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
