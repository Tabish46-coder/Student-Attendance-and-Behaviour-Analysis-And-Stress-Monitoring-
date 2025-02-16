import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { callurl } from '../apifile';

const EMOTIONS = ['ANGRY', 'HAPPY', 'NEUTRAL', 'SAD', 'SURPRISE'];
const SORT_OPTIONS = ['Sort by CGPA ASC', 'Sort by CGPA DESC'];

const StudentEmotionAnalysis = ({ route }) => {
  const [minute, setMinute] = useState(22);
  const [selectedEmotion, setSelectedEmotion] = useState('SAD');
  const [sortOrder, setSortOrder] = useState('Sort by CGPA ASC');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { heldid } = route.params;

  useEffect(() => {
    fetchStudentData();
  }, [minute, selectedEmotion, heldid]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${callurl}emotions/cgpa?held_id=${heldid}&minute_mark=${minute}&emotion=${selectedEmotion.toLowerCase()}`
      );
      const result = await response.json();
      
      if (result.status === 'success') {
        // Convert string values to numbers
        const processedData = result.data.map(student => ({
          ...student,
          cgpa: parseFloat(student.cgpa),
          confidence: parseFloat(student.confidence)
        }));
        
        let sortedData = [...processedData];
        if (sortOrder === 'Sort by CGPA ASC') {
          sortedData.sort((a, b) => a.cgpa - b.cgpa);
        } else {
          sortedData.sort((a, b) => b.cgpa - a.cgpa);
        }
        setStudents(sortedData);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (students.length > 0) {
      const sortedData = [...students];
      if (sortOrder === 'Sort by CGPA ASC') {
        sortedData.sort((a, b) => a.cgpa - b.cgpa);
      } else {
        sortedData.sort((a, b) => b.cgpa - a.cgpa);
      }
      setStudents(sortedData);
    }
  }, [sortOrder]);

  const getEmotionIcon = (emotion) => {
    switch (emotion.toLowerCase()) {
      case 'sad': return '😢';
      case 'happy': return '😊';
      case 'angry': return '😠';
      case 'neutral': return '😐';
      case 'surprise': return '😮';
      default: return '😐';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Emotion Analysis</Text>
      
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Minute Slider:</Text>
        <Text style={styles.minuteText}>{minute} min</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={30}
          value={minute}
          onValueChange={setMinute}
          step={1}
          minimumTrackTintColor="#4CAF50"
          maximumTrackTintColor="#E0E0E0"
          thumbTintColor="#4CAF50"
        />
      </View>

      <View style={styles.dropdownsContainer}>
        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={selectedEmotion}
            onValueChange={setSelectedEmotion}
            style={styles.picker}
          >
            {EMOTIONS.map((emotion) => (
              <Picker.Item key={emotion} label={emotion} value={emotion} />
            ))}
          </Picker>
        </View>

        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={sortOrder}
            onValueChange={setSortOrder}
            style={styles.picker}
          >
            {SORT_OPTIONS.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.tableContainer}>
        <Text style={styles.tableHeader}>Student Details:</Text>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.regNoCell]}>Reg No</Text>
          <Text style={[styles.headerCell, styles.emotionCell]}>Emotion</Text>
          <Text style={[styles.headerCell, styles.confidenceCell]}>Confidence</Text>
          <Text style={[styles.headerCell, styles.cgpaCell]}>CGPA</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
        ) : (
          students.map((student) => (
            <View key={student.student_id} style={styles.dataRow}>
              <Text style={[styles.cell, styles.regNoCell]}>{student.student_id}</Text>
              <View style={[styles.cell, styles.emotionCell, styles.emotionContainer]}>
                <Text style={styles.emotionIcon}>{getEmotionIcon(student.emotion)}</Text>
                <Text style={styles.emotionText}>{student.emotion}</Text>
              </View>
              <Text style={[styles.cell, styles.confidenceCell]}>
                {student.confidence.toFixed(2)}%
              </Text>
              <Text style={[styles.cell, styles.cgpaCell]}>{student.cgpa.toFixed(2)}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  minuteText: {
    fontSize: 16,
    color: '#4CAF50',
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  dropdownsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dropdownWrapper: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  tableContainer: {
    flex: 1,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  dataRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  cell: {
    fontSize: 14,
  },
  regNoCell: {
    flex: 2,
  },
  emotionCell: {
    flex: 1,
  },
  confidenceCell: {
    flex: 1,
    textAlign: 'center',
  },
  cgpaCell: {
    flex: 1,
    textAlign: 'center',
  },
  emotionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emotionIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  emotionText: {
    fontSize: 14,
  },
  loader: {
    marginTop: 20,
  },
});

export default StudentEmotionAnalysis;