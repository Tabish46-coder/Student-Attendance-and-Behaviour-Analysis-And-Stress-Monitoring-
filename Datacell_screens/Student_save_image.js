import React, { useEffect, useState } from "react";
import { SafeAreaView, View, StyleSheet, Image, PermissionsAndroid, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { callurl } from "../apifile";

function Student_save_image({ navigation, route }) {
  const { studentno, studentname } = route.params;
  const [photoUris, setPhotoUris] = useState([null, null, null, null]);
  const [imageData, setImageData] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch images from API when the component mounts
  useEffect(() => {
    fetchImages(studentno).then(setImageData);
  }, []);

  // Request camera permission
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "App needs permission to use the camera",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Open camera to capture image
  const openCamera = async (index) => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert("Camera permission denied");
      return;
    }

    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: false,
    });

    if (result.assets && result.assets.length > 0) {
      const newPhotoUri = result.assets[0].uri;
      setPhotoUris((prev) => {
        const updated = [...prev];
        updated[index - 1] = newPhotoUri; // Set URI for the specific index
        return updated;
      });
    }
  };

  // Open gallery to select image
  const openGallery = async (index) => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });

    if (result.assets && result.assets.length > 0) {
      const selectedPhotoUri = result.assets[0].uri;
      setPhotoUris((prev) => {
        const updated = [...prev];
        updated[index - 1] = selectedPhotoUri; // Set URI for the specific index
        return updated;
      });
    }
  };

  // Upload images to the API
  const uploadImages = async () => {
    setLoading(true); // Show loading indicator
    const formData = new FormData();

    formData.append("student_id", studentno);

    // Add each image file from photoUris to form data
    photoUris.forEach((uri, index) => {
      if (uri) {
        formData.append(`img${index + 1}`, {
          uri,
          name: `image${index + 1}.jpg`,
          type: "image/jpeg",
        });
      }
    });

    try {
      const response = await fetch(`${callurl}/datacell/save_images`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", data.message);
        fetchImages(studentno).then(setImageData); // Refresh images after upload
      } else {
        Alert.alert("Error", data.error || "An error occurred while saving images");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      Alert.alert("Error", "Failed to save images");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Fetch images from the API
  const fetchImages = async (reg_no) => {
    try {
      const response = await fetch(`${callurl}datacell/get_images?reg_no=${reg_no}`, {
        method: "GET",
      });

      const data = await response.json();
      console.log(data)
      if (response.ok && data.success) {
        return data.images.map((img) => (img.success ? `data:image/jpeg;base64,${img.image}` : null));
      } else {
        Alert.alert("Error", data.error || "Failed to fetch images");
        return [null, null, null, null];
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      Alert.alert("Error", "An error occurred while fetching images");
      return [null, null, null, null];
    }
  };

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:'white' }}>
      <ScrollView contentContainerStyle={style.scrollViewContent}>
        <View style={style.mainview}>
          <View style={style.imageview}>
            <View style={{ height: 80,width: 80}}>
              <Image source={require('../assets/profile.png')} style={style.Image}></Image>
            </View>
            <View style={{ height: 80, alignItems: 'center', marginLeft: 50,padding:10 }}>
              <Text style={{ fontSize: 14, fontStyle: 'normal', marginTop: 10, marginLeft: 30,color:'black',fontWeight:'bold' }}>{studentname}</Text>
              <Text style={{ fontSize: 14, fontStyle: 'normal', marginLeft: 30,color:'black',fontWeight:'bold' }}>{studentno}</Text>
            </View>
          </View>

          <View style={style.lowerview}>
            {/* Display images with camera and gallery options */}
            {Array.from({ length: 4 }).map((_, index) => (
              <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 20,backgroundColor:'COPIED!',borderRadius:10,width:320,marginLeft:10,padding:10,borderWidth:1,borderColor:'green' }}>
                <Image
                  source={
                    photoUris[index]
                      ? { uri: photoUris[index] }
                      : imageData[index]
                      ? { uri: imageData[index] }
                      : require("../assets/profile.png")
                  }
                  style={style.personimage}
                />
                <TouchableOpacity onPress={() => openCamera(index + 1)} style={style.iconButton}>
                  <Image source={require('../assets/camera.png')} style={style.icons} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openGallery(index + 1)} style={style.iconButton}>
                  <Image source={require('../assets/gallery.png')} style={style.icons} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={{ height: 70, width: 320, alignItems: 'center' }}>
            {loading ? (
              <ActivityIndicator size="large" color="green" />
            ) : (
              <TouchableOpacity style={style.button} onPress={uploadImages}>
                <Text style={{ color: 'white', fontSize: 15 }}>Save</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  mainview: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingBottom: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  imageview: {
    height: 150,
    flexDirection: 'row',
    alignItems: 'center',
  },
  Image: {
    height: 80,
    width: 80,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 40,
    marginLeft: 40,
  },
  lowerview: {
   marginLeft:20
  },
  personimage: {
    height: 70,
    width: 70,
    marginLeft: 20,
    elevation:5
  },
  icons: {
    height: 30,
    width: 30,
    marginTop: 10,
    marginLeft: 10,
  },
  iconButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
  },
  button: {
    backgroundColor: '#209920',
    marginTop: 20,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    width:340,
    marginLeft:60

  },
});

export default Student_save_image;
