import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Text, ActivityIndicator } from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import api from '../services/api';

const AttendanceScreen = () => {
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const [historyResponse, currentResponse] = await Promise.all([
        api.get('/driver/attendance/history'),
        api.get('/driver/attendance/current')
      ]);
      
      setHistory(historyResponse.data);
      setCurrentAttendance(currentResponse.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInOut = async (type) => {
    try {
      setCheckingStatus(true);
      
      // Get current location
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: true }
        );
      });

      const { latitude, longitude } = position.coords;
      
      // Send check-in/out request
      const endpoint = type === 'in' ? '/checkin' : '/checkout';
      await api.post(`/driver/attendance${endpoint}`, {
        latitude,
        longitude
      });

      // Refresh attendance data
      fetchAttendanceData();
    } catch (error) {
      console.error(error);
    } finally {
      setCheckingStatus(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Card style={styles.statusCard}>
        <Card.Content>
          <Text variant="titleLarge">Current Status</Text>
          <Text variant="bodyLarge" style={styles.status}>
            {currentAttendance ? 'Checked In' : 'Not Checked In'}
          </Text>
          <Button
            mode="contained"
            onPress={() => handleCheckInOut(currentAttendance ? 'out' : 'in')}
            loading={checkingStatus}
            disabled={checkingStatus}
            style={styles.button}
          >
            {currentAttendance ? 'Check Out' : 'Check In'}
          </Button>
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={styles.historyTitle}>
        Attendance History
      </Text>

      <ScrollView>
        {history.map((record) => (
          <Card key={record.id} style={styles.historyCard}>
            <Card.Content>
              <Text variant="titleMedium">
                {new Date(record.checkIn).toLocaleDateString()}
              </Text>
              <Text variant="bodyMedium">
                Check In: {new Date(record.checkIn).toLocaleTimeString()}
              </Text>
              {record.checkOut && (
                <Text variant="bodyMedium">
                  Check Out: {new Date(record.checkOut).toLocaleTimeString()}
                </Text>
              )}
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    marginBottom: 24,
  },
  status: {
    marginVertical: 8,
  },
  button: {
    marginTop: 8,
  },
  historyTitle: {
    marginBottom: 16,
  },
  historyCard: {
    marginBottom: 12,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AttendanceScreen;