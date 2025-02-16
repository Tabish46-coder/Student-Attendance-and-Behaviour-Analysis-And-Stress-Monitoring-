import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { callurl } from '../apifile';

const Student_Profile = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);  // Selected or fetched picture
  const [fetchedPicture, setFetchedPicture] = useState(null);  // Picture fetched from API
  const { user, roles } = route.params;

  const fetchProfileDetails = async () => {
    if (!roles || !user) {
      Alert.alert('Error', 'Please enter both role and ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${callurl}profiles/details?role=${roles}&id=${user}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (response.ok) {
        setProfileData(data.data);
        fetchProfilePicture();
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfilePicture = async () => {
    try {
      const response = await fetch(`${callurl}profile_picture/fetch?user_id=${user}`, { method: 'GET' });
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setFetchedPicture(imageUrl);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile picture: ' + error.message);
    }
  };

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.error) {
        const { uri } = response.assets[0];
        setProfilePicture(uri);
      } else if (response.error) {
        Alert.alert('Error', 'Failed to select image');
      }
    });
  };

  const uploadProfilePicture = async () => {
    if (!profilePicture) {
      Alert.alert('Error', 'Please select a picture first');
      return;
    }

    const formData = new FormData();
    formData.append('user_id', user);
    formData.append('picture', {
      uri: profilePicture,
      type: 'image/jpeg',
      name: `${user}.jpg`,
    });

    setLoading(true);
    try {
      const response = await fetch(`${callurl}profile_picture/upsert`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = await response.json();
      if (response.ok) {
        setFetchedPicture(profilePicture);  // Show updated picture
        Alert.alert('Success', 'Profile picture uploaded successfully');
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload profile picture: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectImage} style={styles.imageWrapper}>
        <Image
          source={
            profilePicture ? { uri: profilePicture } :
            fetchedPicture ? { uri: fetchedPicture } :
            require('../assets/profile.png')
          }
          style={styles.profileImage}
        />
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={uploadProfilePicture}>
          <Text style={styles.uploadButtonText}>Upload Picture</Text>
        </TouchableOpacity>
      )}

      {profileData && (
        <View style={styles.profileContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('../assets/name.png')} style={{ width: 40, height: 40 }} />
            <Text style={styles.profileText}>Name: {profileData.full_name}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
            <Image source={require('../assets/cource2.png')} style={{ width: 40, height: 40 }} />
            <Text style={styles.profileText}>Dicipline: {profileData.Final_course}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
            <Image source={require('../assets/gpa.png')} style={{ width: 40, height: 40 }} />
            <Text style={styles.profileText}>CGPA: {profileData.CGPA}</Text>
          </View>
          
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  uploadButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  profileContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  profileText: {
    fontSize: 14,
    marginLeft: 15,
    fontWeight: 'bold',
  },
});

export default Student_Profile;
