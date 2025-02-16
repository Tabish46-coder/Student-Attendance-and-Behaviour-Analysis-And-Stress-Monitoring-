import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import DropDownPicker from 'react-native-dropdown-picker';
import RadioGroup from 'react-native-radio-buttons-group';
import { callurl } from '../apifile';
import Share from 'react-native-share';

const Teacher_Attendance_Sheet = ({ navigation, route }) => {
  const { section_name, cource_code } = route.params;
  const [attendanceType, setAttendanceType] = useState('overall');
  const [filePath, setFilePath] = useState('');
  const [downloadedFilePath, setDownloadedFilePath] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingClasses, setFetchingClasses] = useState(false);
  const [classesData, setClassesData] = useState([]);
  const [selectedHeldId, setSelectedHeldId] = useState(null);
  const [check,setcheck]=useState('');
  // Dropdown states
  const [openSupervised, setOpenSupervised] = useState(false);
  const [openUnsupervised, setOpenUnsupervised] = useState(false);
  const [supervised, setSupervised] = useState(null);
  const [unsupervised, setUnsupervised] = useState(null);
  
  const [supervisedItems] = useState([
    { label: 'Supervised / Lecture', value: 'LECTURE' },
    { label: 'Unsupervised', value: 'UNSUPERVISED' },
  ]);
  
  const [unsupervisedItems, setUnsupervisedItems] = useState([]);

  const radioButtons = [
    { id: 'overall', label: 'Overall Attendance', value: 'overall' },
    { id: 'class', label: 'Class Attendance', value: 'class' },
  ];

  // Function to format date and time
  const formatClassDetails = (classData) => {
    const date = new Date(classData.class_date);
    const formattedDate = date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    return `${classData.slot_day}, (${classData.slot_starttime.slice(0, 5)} to ${classData.slot_endtime.slice(0, 5)}) | ${classData.venue}`;
  };

  // Fetch held classes when component mounts
  useEffect(() => {
    fetchHeldClasses();
  }, []);

  // Fetch held classes data
  const fetchHeldClasses = async () => {
    setFetchingClasses(true);
    try {
      const response = await fetch(
        `${callurl}admin/fetchHeldClasses?section_name=${section_name}&check=${check}&course_id=${cource_code}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }

      setClassesData(data);
      updateUnsupervisedItems(data, supervised);
    } catch (error) {
      console.error('Error fetching held classes:', error);
      Alert.alert('Error', 'Failed to fetch class data');
    } finally {
      setFetchingClasses(false);
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to storage to download files.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  const fetchAttendanceData = async () => {
    if (attendanceType === 'class' && !supervised) {
      Alert.alert('Error', 'Please select attendance type');
      return;
    }

    if (attendanceType === 'class' && supervised === 'UNSUPERVISED' && !unsupervised) {
      Alert.alert('Error', 'Please select a class session');
      return;
    }

    try {
      setLoading(true);
      const check = attendanceType === 'overall' ? 'OVERALL' : supervised.toUpperCase();
      
      const response = await fetch(
        `${callurl}teacher/alternative-route/students-attendance?check=${check}&merged=YES&semester_no=2024FM&section_name=${section_name}&course_id=${cource_code}&held_id=${selectedHeldId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const data = await response.json();
      if (data.status === 'success') {
        setFilePath(data.file_path);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch attendance data.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while fetching attendance data.');
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage permission is required to download files.');
      return;
    }

    setLoading(true);
    const { config, fs } = RNFetchBlob;
    const downloadDir = Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
    const fileName = filePath.split("\\").pop();
    const fullDownloadPath = `${downloadDir}/${fileName}`;

    try {
      const response = await RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: 'Attendance Sheet',
          description: 'Downloading attendance sheet',
          path: fullDownloadPath,
          mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          mediaScannable: true,
        }
      }).fetch(
        'GET',
        `${callurl}teacher/download-attendance?file_name=${encodeURIComponent(fileName)}`,
        { 'Content-Type': 'application/json' }
      );

      setDownloadedFilePath(fullDownloadPath);
      Alert.alert('Success', `File downloaded successfully!\nLocation: ${fullDownloadPath}`);

    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download the file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openFile = () => {
    if (!downloadedFilePath) {
      Alert.alert('Error', 'Please download the file first.');
      return;
    }

    RNFetchBlob.fs.exists(downloadedFilePath).then((exists) => {
      if (!exists) {
        Alert.alert('Error', 'File not found. Please download again.');
        return;
      }

      const options = {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        url: `file://${downloadedFilePath}`,
        title: 'Open with...'
      };

      Share.open(options).catch(error => {
        console.error('Error opening file:', error);
        Alert.alert('Error', 'Failed to open the file.');
      });
    });
  };

  const updateUnsupervisedItems = (data) => {
   console.log(check);
    if (!check) return;
    
    const filteredClasses = data.filter(item => item.type === check);
    const formattedItems = filteredClasses.map(classItem => ({
      label: formatClassDetails(classItem),
      value: classItem.held_id.toString(),
      classData: classItem
    }));
    
    setUnsupervisedItems(formattedItems);
  };

  const handleSupervisedChange = (value) => {
    setcheck(value)
    setSupervised(value);
    setUnsupervised(null);
    setSelectedHeldId(null);
    updateUnsupervisedItems(classesData);
  };

  const handleUnsupervisedChange = (value) => {
    setcheck(value)
    setUnsupervised(value);
    setSelectedHeldId(value); // Save the held_id when a class is selected
  };

  return (
    <View style={styles.container}>
      <RadioGroup
        radioButtons={radioButtons}
        onPress={setAttendanceType}
        selectedId={attendanceType}
        containerStyle={styles.radioGroup}
      />

{attendanceType === 'class' && (
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            open={openSupervised}
            value={supervised}
            items={supervisedItems}
            setOpen={setOpenSupervised}
            setValue={handleSupervisedChange}
            placeholder="Select Attendance Type"
            style={styles.dropdown}
            containerStyle={styles.dropdownContainerStyle}
            zIndex={2000}
          />

          <DropDownPicker
            open={openUnsupervised}
            value={unsupervised}
            items={unsupervisedItems}
            setOpen={setOpenUnsupervised}
            setValue={handleUnsupervisedChange}
            placeholder={fetchingClasses ? "Loading classes..." : "Select Class Session"}
            style={styles.dropdown}
            containerStyle={[styles.dropdownContainerStyle, { marginTop: 10 }]}
            zIndex={1000}
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            loading={fetchingClasses}
            disabled={!supervised}
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.generateButton, (loading || fetchingClasses) && styles.disabledButton]}
        onPress={fetchAttendanceData}
        disabled={loading || fetchingClasses}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Generate Excel Sheet</Text>
        )}
      </TouchableOpacity>

      {filePath && (
        <TouchableOpacity
          style={[styles.downloadButton, loading && styles.disabledButton]}
          onPress={downloadFile}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Download File</Text>
        </TouchableOpacity>
      )}

      {downloadedFilePath && (
        <View style={styles.filePathContainer}>
          <Text style={styles.filePathText}>File Location:</Text>
          <Text style={styles.filePath}>{downloadedFilePath}</Text>

          <TouchableOpacity 
            style={[styles.openButton, loading && styles.disabledButton]} 
            onPress={openFile}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Open File</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  radioGroup: {
    marginBottom: 20,
  },
  dropdownContainer: {
    marginBottom: 20,
    zIndex: 3000,
  },
  dropdown: {
    borderColor: '#2196F3',
    backgroundColor: '#fff',
  },
  dropdownContainerStyle: {
    height: 40,
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#0D8F4D',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 50,
  },
  downloadButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  openButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  filePathContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  filePathText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  filePath: {
    color: '#333',
    fontSize: 14,
  },
});

export default Teacher_Attendance_Sheet;