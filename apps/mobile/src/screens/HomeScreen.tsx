import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.welcome}>
        Welcome, {user?.name || 'Driver'}
      </Text>

      <View style={styles.cardContainer}>
        <Card style={styles.card} onPress={() => navigation.navigate('Profile')}>
          <Card.Content>
            <Text variant="titleMedium">Profile</Text>
            <Text variant="bodyMedium">Update your profile information</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card} onPress={() => navigation.navigate('Documents')}>
          <Card.Content>
            <Text variant="titleMedium">Documents</Text>
            <Text variant="bodyMedium">Manage your documents</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card} onPress={() => navigation.navigate('Attendance')}>
          <Card.Content>
            <Text variant="titleMedium">Attendance</Text>
            <Text variant="bodyMedium">Check-in/out and view history</Text>
          </Card.Content>
        </Card>
      </View>

      <Button mode="outlined" onPress={signOut} style={styles.logoutButton}>
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  welcome: {
    marginBottom: 24,
  },
  cardContainer: {
    gap: 16,
  },
  card: {
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 'auto',
  },
});

export default HomeScreen;