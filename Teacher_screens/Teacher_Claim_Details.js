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
  PermissionsAndroid,
  Platform,
  TextInput,
  FlatList
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import RNFetchBlob from 'rn-fetch-blob';
import { callurl } from '../apifile';

const Teacher_Claim_Details = ({navigation, route}) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { student_id, held_id, date, id } = route.params;
  const [resolution, setResolution] = useState("");
  const [attendanceChanges, setAttendanceChanges] = useState([]);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "App needs access to storage to save images",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const fetchAttendanceImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${callurl}claims/resolve/attendanceImages?student_id=${student_id}&held_id=${held_id}`
      );
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        const processedData = data.data.map((item, index) => ({
          ...item,
          key: String(index), // Add key for FlatList
        }));
        
        setImages(processedData);
        // Initialize attendance changes with correct IDs
        const initialChanges = processedData.map(item => ({
          attendance_id: item.id, // Using the correct ID from the item
          status: item.attendanceStatus
        }));
        setAttendanceChanges(initialChanges);
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

  useEffect(() => {
    fetchAttendanceImages();
  }, []);

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleSaveImage = async () => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Please grant storage permission to save images');
        return;
      }

      if (!selectedImage?.image) {
        Alert.alert('Error', 'No image selected');
        return;
      }

      const fileName = `attendance_${selectedImage.attendance_no}_${date}.jpg`;
      const downloadPath = Platform.select({
        ios: RNFetchBlob.fs.dirs.DocumentDir,
        android: RNFetchBlob.fs.dirs.PictureDir,
      });

      const filePath = `${downloadPath}/${fileName}`;
      await RNFetchBlob.fs.writeFile(filePath, selectedImage.image, 'base64');

      if (Platform.OS === 'android') {
        await RNFetchBlob.fs.scanFile([{ path: filePath }]);
      }

      Alert.alert('Success', 'Image saved successfully!');
      setModalVisible(false);
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save image');
    }
  };

  const toggleAttendanceStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'A' ? 'P' : 'A';
    
    // Update images state
    setImages(prevImages => 
      prevImages.map(item => 
        item.id === id ? { ...item, attendanceStatus: newStatus } : item
      )
    );

    // Update attendance changes
    setAttendanceChanges(prevChanges => {
      const existingChangeIndex = prevChanges.findIndex(
        change => change.attendance_id === id
      );

      if (existingChangeIndex !== -1) {
        // Update existing change
        return prevChanges.map((change, index) =>
          index === existingChangeIndex
            ? { ...change, status: newStatus }
            : change
        );
      } else {
        // Add new change
        return [...prevChanges, { attendance_id: id, status: newStatus }];
      }
    });
  };

  const handleStatusChangeInModal = () => {
    if (selectedImage) {
      toggleAttendanceStatus(selectedImage.id, selectedImage.attendanceStatus);
      // Update the selectedImage state to reflect the change
      setSelectedImage(prevImage => ({
        ...prevImage,
        attendanceStatus: prevImage.attendanceStatus === 'A' ? 'P' : 'A'
      }));
    }
  };
  const resolveClaim = async () => {
    try {
      if (!resolution.trim()) {
        Alert.alert('Error', 'Please enter resolution details');
        return;
      }

      const response = await fetch(`${callurl}claims/resolve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          claim_id: id,
          resolution_details: resolution,
          attendance_changes: attendanceChanges,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert("Success", "Claim resolved successfully", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert("Error", data.error || data.message);
      }
    } catch (error) {
      console.error('Resolve error:', error);
      Alert.alert("Error", "Network error. Please try again.");
    }
  };

  const renderAttendanceItem = ({ item }) => (
    <View style={styles.attendanceItem}>
      <View style={styles.numberContainer}>
        <Text style={styles.numberText}>{item.attendance_no}</Text>
      </View>

      <View style={styles.attendanceDetails}>
        <Text style={styles.attendanceNo}>Attendance No: {item.attendance_no}</Text>
        <TouchableOpacity 
          onPress={() => toggleAttendanceStatus(item.id, item.attendanceStatus)}
          style={styles.statusButton}
        >
          <Text style={[
            styles.statusText,
            item.attendanceStatus === 'A' ? styles.absentText : styles.presentText
          ]}>
            Status: {item.attendanceStatus === 'A' ? 'Absent' : 'Present'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => handleImagePress(item)}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.image}` }}
          style={styles.smallImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0d904f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{date}</Text>
      </View>

      <View style={styles.reasonContainer}>
        <Text style={styles.sectionTitle}>Reason:</Text>
        <Text style={styles.reasonText}>Oh my god. I was present. ??</Text>
      </View>

      <View style={styles.resolutionContainer}>
        <Text style={styles.sectionTitle}>Resolution Details:</Text>
        <TextInput
          style={styles.resolutionInput}
          placeholder="Enter resolution details here..."
          multiline
          textAlignVertical="top"
          value={resolution}
          onChangeText={setResolution}
        />
        <TouchableOpacity 
          style={styles.savechanges} 
          onPress={resolveClaim}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.attendanceContainer}>
        <Text style={styles.sectionTitle}>Attendance Records:</Text>
        <FlatList
          data={images}
          renderItem={renderAttendanceItem}
          keyExtractor={item => String(item.id)}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ImageZoom
              cropWidth={Dimensions.get('window').width}
              cropHeight={Dimensions.get('window').height - 120}
              imageWidth={Dimensions.get('window').width}
              imageHeight={Dimensions.get('window').height - 120}
            >
              {selectedImage && (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${selectedImage.image}` }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              )}
            </ImageZoom>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveImage}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>

              {selectedImage && (
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    selectedImage.attendanceStatus === 'A' 
                      ? styles.presentButton 
                      : styles.absentButton
                  ]}
                  onPress={handleStatusChangeInModal}
                >
                  <Text style={styles.buttonText}>
                    Mark {selectedImage.attendanceStatus === 'A' ? 'Present' : 'Absent'}
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  // ... (previous styles remain the same)
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  reasonContainer: {
    padding: 15,
    backgroundColor: 'white',
    marginTop: 10,
  },
  resolutionContainer: {
    padding: 15,
    backgroundColor: 'white',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  reasonText: {
    fontSize: 14,
    color: '#666',
  },
  resolutionInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'white',
    textAlignVertical: 'top',
  },
  savechanges: {
    backgroundColor: '#0d904f',
    padding: 12,
    borderRadius: 25,
    marginTop: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  attendanceContainer: {
    flex: 1,
    marginTop: 10,
    padding: 15,
  },
  attendanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2,
  },
  numberContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  numberText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  attendanceDetails: {
    flex: 1,
  },
  attendanceNo: {
    fontSize: 14,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  absentText: {
    color: '#ff4444',
  },
  presentText: {
    color: '#4CAF50',
  },
  smallImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'black',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'black',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  presentButton: {
    backgroundColor: '#4CAF50',
  },
  absentButton: {
    backgroundColor: '#ff4444',
  },
  saveButton: {
    backgroundColor: '#0d904f',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 120,
  },
});

export default Teacher_Claim_Details;