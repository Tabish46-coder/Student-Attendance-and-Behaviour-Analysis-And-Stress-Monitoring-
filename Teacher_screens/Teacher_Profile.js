import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { callurl } from '../apifile';

const Teacher_Profile = ({navigation, route}) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const {user, roleof} = route.params;
console.log(user,roleof)
  // Fetch profile picture
  const fetchProfilePicture = async () => {
    try {
      const response = await fetch(`${callurl}profile_picture/fetch?user_id=${user}`);
      
      if (response.ok) {
        const imageUrl = `${callurl}profile_picture/fetch?user_id=${user}&timestamp=${new Date().getTime()}`;
        setProfileImage(imageUrl);
      }
    } catch (error) {
      console.log('Error fetching profile picture:', error);
      // Silently fail and use default image
    }
  };

  // Fetch profile details
  const fetchProfileDetails = async () => {
    try {
      const response = await fetch(
        `${callurl}profiles/details?id=${user}&role=${roleof}`
      );
      const result = await response.json();
      
      if (result.status === 'success') {
        setProfileData(result.data);
        // Fetch profile picture after getting profile details
        await fetchProfilePicture();
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile details');
    } finally {
      setLoading(false);
    }
  };

  // Handle image picking and upload
  const handleImagePick = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    try {
      const result = await launchImageLibrary(options);
      
      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage);
        return;
      }

      const selectedImage = result.assets[0];
      uploadProfilePicture(selectedImage);
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async (imageFile) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('user_id', user);
      formData.append('picture', {
        uri: imageFile.uri,
        type: imageFile.type,
        name: imageFile.fileName || 'profile.jpg',
      });

      const response = await fetch(`${callurl}profile_picture/upsert`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      
      if (response.ok) {
        Alert.alert('Success', 'Profile picture updated successfully');
        // Refresh profile picture after successful upload
        await fetchProfilePicture();
      } else {
        Alert.alert('Error', result.error || 'Failed to update profile picture');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, [user, roleof]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.profileImageContainer} 
          onPress={handleImagePick}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            <>
              <Image
                source={profileImage ? 
                  { uri: profileImage } : 
                  require('../assets/profile.png')
                }
                style={styles.profileImage}
              />
              <View style={styles.editIconContainer}>
                <Text style={styles.editIcon}>📷</Text>
              </View>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{profileData?.full_name}</Text>
        <Text style={styles.email}>{profileData?.email}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{profileData?.id}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Joining Date:</Text>
          <Text style={styles.value}>
            {new Date(profileData?.joining_date).toLocaleDateString()}
          </Text>
        </View>

        {roleof === 'Student' && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Father's Name:</Text>
              <Text style={styles.value}>{profileData?.father_name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Semester:</Text>
              <Text style={styles.value}>{profileData?.semester_no}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>CGPA:</Text>
              <Text style={styles.value}>{profileData?.CGPA}</Text>
            </View>
          </>
        )}

        {roleof === 'teacher' && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Full Name:</Text>
              <Text style={styles.value}>{profileData?.full_name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{profileData?.email}</Text>
            </View>
          </>
        )}

{roleof === 'Admin' && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Full Name:</Text>
              <Text style={styles.value}>{profileData?.full_name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{profileData?.email}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#209920',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#209920',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    marginBottom:25
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#184F1A',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  editIcon: {
    fontSize: 20,
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 20,
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#666666',
  },
  value: {
    flex: 2,
    fontSize: 16,
    color: '#333333',
  },
});

export default Teacher_Profile;