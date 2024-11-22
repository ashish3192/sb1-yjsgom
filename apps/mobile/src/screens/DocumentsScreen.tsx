import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Text, ActivityIndicator } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import api from '../services/api';

const DocumentTypes = {
  PAN_CARD: 'PAN Card',
  AADHAR_CARD: 'Aadhar Card',
  DRIVING_LICENSE: 'Driving License',
  SCHOOL_CERTIFICATE: 'School Certificate',
  POLICE_VERIFICATION: 'Police Verification'
};

const DocumentsScreen = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/driver/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (documentType) => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets?.[0]) {
        setUploading(true);
        const formData = new FormData();
        formData.append('document', {
          uri: result.assets[0].uri,
          type: result.assets[0].type,
          name: result.assets[0].fileName,
        });
        formData.append('type', documentType);

        await api.post('/driver/documents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        fetchDocuments();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.container}>
      {Object.entries(DocumentTypes).map(([type, label]) => {
        const doc = documents.find(d => d.type === type);
        return (
          <Card key={type} style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">{label}</Text>
              <Text variant="bodyMedium" style={styles.status}>
                Status: {doc?.status || 'Not Uploaded'}
              </Text>
              {doc?.rejectionReason && (
                <Text variant="bodySmall" style={styles.rejection}>
                  Reason: {doc.rejectionReason}
                </Text>
              )}
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => handleUpload(type)}
                loading={uploading}
                disabled={uploading}
              >
                {doc ? 'Re-upload' : 'Upload'}
              </Button>
            </Card.Actions>
          </Card>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  status: {
    marginTop: 8,
    textTransform: 'capitalize',
  },
  rejection: {
    marginTop: 4,
    color: 'red',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DocumentsScreen;