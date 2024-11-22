import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ProfileScreen = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError('');
      
      await api.put('/driver/profile', { name });
      
      // Update local user data
      const response = await api.get('/driver/profile');
      await AsyncStorage.setItem('@DriverApp:user', JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>Profile Information</Text>
      
      <TextInput
        mode="outlined"
        label="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        mode="outlined"
        label="Phone Number"
        value={user?.phone}
        disabled
        style={styles.input}
      />

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <Button
        mode="contained"
        onPress={handleUpdate}
        loading={loading}
        disabled={loading || !name}
        style={styles.button}
      >
        Update Profile
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});

export default ProfileScreen;