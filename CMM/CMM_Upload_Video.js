import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { callurl } from '../apifile';

const CMM_upload_Video = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const pickVideo = () => {
    const options = {
      mediaType: 'video',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.error) {
        Alert.alert('Error', 'ImagePicker Error: ' + response.error);
      } else if (response.assets && response.assets[0]) {
        setSelectedVideo(response.assets[0]);
      }
    });
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const uploadVideo = async () => {
    if (!selectedVideo) {
      Alert.alert('Error', 'Please select a video first');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const videoPath = selectedVideo.uri;
      const filename = `punishment_video_${Date.now()}.mp4`;
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');

      const formData = new FormData();
      formData.append('date', formattedDate);
      formData.append('filename', filename);
      formData.append('videos', {
        uri: Platform.OS === 'android' ? videoPath : videoPath.replace('file://', ''),
        type: selectedVideo.type || 'video/mp4',
        name: filename
      });

      const response = await fetch(`${callurl}punishments/uploadVideo`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      // First check if the response is ok
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to upload video');
      }

      // Try to parse the response as JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Response parsing error:', parseError);
        throw new Error('Invalid server response');
      }

      Alert.alert('Success', 'Video uploaded successfully');
      setSelectedVideo(null);
      setUploadProgress(0);
      
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', error.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Upload Video</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={pickVideo}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>Select Video</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.buttonText}>
          {`Select Date: ${format(selectedDate, 'yyyy-MM-dd')}`}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {selectedVideo && (
        <View style={styles.videoInfo}>
          <Text style={styles.videoInfoText}>
            Video selected: {selectedVideo.fileName || 'video.mp4'}
          </Text>
          <Text style={styles.videoInfoText}>
            Size: {(selectedVideo.fileSize / (1024 * 1024)).toFixed(2)} MB
          </Text>
        </View>
      )}

      {uploading && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Upload Progress: {uploadProgress.toFixed(1)}%
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, styles.uploadButton]}
        onPress={uploadVideo}
        disabled={!selectedVideo || uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Upload Video</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    color: 'black',
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#372948',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  uploadButton: {
    backgroundColor: '#a98ebf',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  videoInfo: {
    marginVertical: 15,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  videoInfoText: {
    fontSize: 14,
    color: '#333333',
    marginVertical: 2,
  },
  progressContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#333333',
  },
});

export default CMM_upload_Video;