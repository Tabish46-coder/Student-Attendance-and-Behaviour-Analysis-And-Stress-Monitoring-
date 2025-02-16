import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native-paper';
import { callurl } from '../apifile';

const CMM_Violations = ({ navigation, route }) => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [violationType, setViolationType] = useState('');
  const [reportedBy, setReportedBy] = useState('');

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const queryParams = [];
      if (violationType) queryParams.push(`violation_type=${violationType}`);
      if (reportedBy) queryParams.push(`reported_by=${reportedBy}`);
      const url = `${callurl}/violations${queryParams.length > 0 ? '?' + queryParams.join('&') : ''}`;

      const response = await fetch(url, { method: 'GET' });
      const data = await response.json();
      if (response.ok) {
        setViolations(data.violations || []);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch violations');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, [violationType, reportedBy]);

  const manageViolations = (id, type, desc, dates, reportBy) => {
    navigation.navigate('CMM_Manage_Voilations', { voilationid: id, voilationtype: type, voilationdesc: desc, voilationdate: dates, voilationby: reportBy });
  };

  const modifyViolationStatus = async (violation_id, key) => {
    try {
      const response = await fetch(`${callurl}/violations?violation_id=${violation_id}&key=${key}`, { method: 'PATCH' });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', result.message);
        fetchViolations();
      } else {
        Alert.alert('Error', result.error || 'Failed to modify violation status.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred: ' + error.message);
    }
  };

  const renderViolation = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{item.reported_at}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => manageViolations(item.violation_id, item.violation_type, item.description, item.reported_at, item.reported_by)}>
            <Image source={require('../assets/pencil.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => modifyViolationStatus(item.violation_id, 'DELETE')}>
            <Image source={require('../assets/delete.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.violationType}>{item.violation_type}</Text>
        <Text style={styles.detailsLabel}>Details:</Text>
        <Text style={styles.details}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Picker selectedValue={violationType} style={styles.picker} onValueChange={(value) => setViolationType(value)}>
          <Picker.Item label="All Types" value="" />
          <Picker.Item label="Fighting" value="Fighting" />
          <Picker.Item label="Harassment" value="Harassment" />
          <Picker.Item label="Disturbance" value="Disturbance" />
        </Picker>
        <Picker selectedValue={reportedBy} style={styles.picker} onValueChange={(value) => setReportedBy(value)}>
          <Picker.Item label="All Reporters" value="" />
          <Picker.Item label="Director" value="Director" />
          <Picker.Item label="Guard" value="Guard" />
          <Picker.Item label="Student" value="Student" />
        </Picker>
      </View>
      <Button mode="contained" onPress={fetchViolations} style={styles.button}>Apply Filters</Button>
      {loading ? <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} /> : 
        <FlatList data={violations} keyExtractor={(item) => item.violation_id.toString()} renderItem={renderViolation} />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FD' },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  picker: { flex: 1, height: 50, marginHorizontal: 5, backgroundColor: '#FFF', borderRadius: 5 },
  button: { marginBottom: 10, backgroundColor: '#4CAF50' },
  card: { marginVertical: 8, backgroundColor: '#FFF', borderRadius: 10, elevation: 3, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#50C878' },
  date: { color: '#333', fontWeight: 'bold' },
  iconContainer: { flexDirection: 'row', gap: 15 },
  icon: { height: 20, width: 20, tintColor: '#333' },
  cardBody: { padding: 15, backgroundColor: '#F2FBF5' },
  violationType: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  detailsLabel: { fontSize: 14, fontWeight: 'bold', marginTop: 10, color: '#444' },
  details: { fontSize: 12, marginTop: 5, color: '#666' }
});

export default CMM_Violations;
