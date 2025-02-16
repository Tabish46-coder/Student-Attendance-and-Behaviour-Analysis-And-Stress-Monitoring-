import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { callurl } from '../apifile';

const AttendanceImageViewer = ({ navigation, route }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { student_id, held_id } = route.params;
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchAttendanceImages();
  }, []);

  const fetchAttendanceImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${callurl}claims/resolve/attendanceImages?student_id=${student_id}&held_id=${held_id}`
      );
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        setImages(data.data.map((item, index) => ({ 
          ...item, 
          key: String(index),
          status: item.attendanceStatus === 'A' ? 'Absent' : 'Present'
        })));
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to fetch attendance images');
    } finally {
      setLoading(false);
    }
  };

  const updateAttendanceStatus = async (attendanceChanges) => {
    try {
      setUpdatingStatus(true);
      const response = await fetch(`${callurl}teacher/attendance-update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attendance_changes: attendanceChanges
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Attendance updated successfully');
        return true;
      } else {
        Alert.alert('Error', data.error || 'Failed to update attendance');
        return false;
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update attendance');
      return false;
    } finally {
      setUpdatingStatus(false);
    }
  };

  const toggleSingleAttendance = async (image) => {
    const newStatus = image.status === 'Present' ? 'Absent' : 'Present';
    const apiStatus = newStatus === 'Present' ? 'P' : 'A';

    const attendanceChanges = [{
      attendance_id: image.id,
      student_id: student_id,
      status: apiStatus
    }];

    const success = await updateAttendanceStatus(attendanceChanges);
    if (success) {
      setImages(prevImages => 
        prevImages.map(img => 
          img.id === image.id 
            ? { ...img, status: newStatus, attendanceStatus: apiStatus }
            : img
        )
      );
    }
  };

  const markAllPresent = async () => {
    const updatedImages = images.map(img => ({ 
      ...img, 
      status: 'Present', 
      attendanceStatus: 'P' 
    }));

    const attendanceChanges = updatedImages.map(img => ({
      attendance_id: img.id,
      student_id: student_id,
      status: 'P'
    }));

    const success = await updateAttendanceStatus(attendanceChanges);
    if (success) {
      setImages(updatedImages);
    }
  };

  const markAllAbsent = async () => {
    const updatedImages = images.map(img => ({ 
      ...img, 
      status: 'Absent', 
      attendanceStatus: 'A' 
    }));

    const attendanceChanges = updatedImages.map(img => ({
      attendance_id: img.id,
      student_id: student_id,
      status: 'A'
    }));

    const success = await updateAttendanceStatus(attendanceChanges);
    if (success) {
      setImages(updatedImages);
    }
  };

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  if (loading || updatingStatus) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0d904f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>


      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.presentButton]} 
          onPress={markAllPresent}
          disabled={updatingStatus}
        >
          <Text style={styles.actionButtonText}>✓ Mark All Present</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.absentButton]} 
          onPress={markAllAbsent}
          disabled={updatingStatus}
        >
          <Text style={styles.actionButtonText}>✗ Mark All Absent</Text>
        </TouchableOpacity>
      </View>

      {/* Attendance List */}
      <ScrollView style={styles.listContainer}>
        {images.map((item, index) => (
          <View key={item.key} style={styles.attendanceItem}>
            <View style={styles.indexContainer}>
              <Text style={styles.indexText}>{index + 1}</Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.attendanceNo}>Attendance No: {index + 1}</Text>
              <Text style={[
                styles.status,
                item.status === 'Present' ? styles.presentText : styles.absentText
              ]}>
                Status: {item.status}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleImagePress(item)}>
              <Image 
                source={{ uri: `data:image/jpeg;base64,${item.image}` }} 
                style={styles.thumbnail}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Detailed View Modal */}
      <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.detailedModalContainer}>
          <View style={styles.detailedModalContent}>
            {selectedImage && (
              <>
                <View style={styles.studentInfoContainer}>
                  <Text style={styles.studentIdText}>Student ID: 2023-ARID-3966</Text>
                  <Text style={[
                    styles.attendanceStatusText,
                    selectedImage.status === 'Present' ? styles.presentText : styles.absentText
                  ]}>
                    Attendance Status: {selectedImage.status}
                  </Text>
                </View>
                
                <Image 
                  source={{ uri: `data:image/jpeg;base64,${selectedImage.image}` }} 
                  style={styles.detailedImage}
                  resizeMode="contain"
                />

                <TouchableOpacity
                  style={[
                    styles.markButton,
                    selectedImage.status === 'Present' ? styles.markAbsentButton : styles.markPresentButton
                  ]}
                  onPress={() => toggleSingleAttendance(selectedImage)}
                >
                  <Text style={styles.markButtonText}>
                    Mark as {selectedImage.status === 'Present' ? 'Absent' : 'Present'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  presentButton: {
    backgroundColor: '#90EE90',
  },
  absentButton: {
    backgroundColor: '#ff96a4',
  },
  actionButtonText: {
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
  },
  attendanceItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  indexContainer: {
    width: 30,
    alignItems: 'center',
  },
  indexText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  attendanceNo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    marginTop: 4,
  },
  presentText: {
    color: '#0d904f',
  },
  absentText: {
    color: '#f44336',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  detailedModalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  detailedModalContent: {
    flex: 1,
    padding: 20,
  },
  studentInfoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  studentIdText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  attendanceStatusText: {
    fontSize: 16,
  },
  detailedImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  markButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  markPresentButton: {
    backgroundColor: '#0d904f',
  },
  markAbsentButton: {
    backgroundColor: '#f44336',
  },
  markButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AttendanceImageViewer;