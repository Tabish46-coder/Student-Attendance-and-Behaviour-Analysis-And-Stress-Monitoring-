import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { callurl } from '../apifile';

const CMM_Add_Violations = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [violationType, setViolationType] = useState('');
  const [reportedAt, setReportedAt] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState('date');
  const [date, setDate] = useState(new Date());

  const reportedByOptions = ['Teacher', 'Student', 'Guard','Other'];  // Example options
  const violationTypeOptions = ['Fighthing', 'Harassment', 'Disturbance'];
  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const submitViolation = async (description, reportedBy, violationType, reportedAt) => {
    const url = `${callurl}/violations`;
    const formData = new FormData();
    formData.append('description', description);
    formData.append('reported_by', reportedBy);
    formData.append('violation_type', violationType);
    if (reportedAt) {
      formData.append('reported_at', reportedAt);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert(result.message);
      } else {
        Alert.alert(result.error || 'Error occurred');
      }
    } catch (error) {
      Alert.alert('Failed to communicate with server: ' + error.message);
    }
  };

  const handleTodayDate = () => {
    const today = new Date();
    setDate(today);
    setReportedAt(formatDateTime(today));
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }

    if (selectedDate) {
      setDate(currentDate);
      if (mode === 'date') {
        setMode('time');
        if (Platform.OS === 'android') {
          setShowPicker(true);
        }
      } else {
        setMode('date');
        setShowPicker(false);
        setReportedAt(formatDateTime(currentDate));
      }
    }
  };

  const showDatepicker = () => {
    setShowPicker(true);
    setMode('date');
  };

  const handleSubmit = () => {
    submitViolation(description, reportedBy, violationType, reportedAt);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Picker
        selectedValue={reportedBy}
        style={styles.input}
        onValueChange={(itemValue) => setReportedBy(itemValue)}
      >
        <Picker.Item label="Select Reported By" value="" />
        {reportedByOptions.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
      <Picker
        selectedValue={violationType}
        style={styles.input}
        onValueChange={(itemValue) => setViolationType(itemValue)}
      >
        <Picker.Item label="Select Violation Type" value="" />
        {violationTypeOptions.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
      <View style={styles.dateContainer}>
        <Button mode="outlined" onPress={handleTodayDate} style={styles.button}>
          Use Today's Date
        </Button>
        <Button mode="outlined" onPress={showDatepicker} style={styles.button}>
          Select Date
        </Button>
      </View>
      <Text style={styles.dateText}>Selected Date: {reportedAt}</Text>
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
        Submit
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateText: {
    marginBottom: 10,
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20,
  },
});

export default CMM_Add_Violations;