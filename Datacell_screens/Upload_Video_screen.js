import React, { useState } from 'react';
import { View, Text, Alert, Image } from 'react-native';
import { Button } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { callurl } from '../apifile';
import { SafeAreaView } from 'react-native-safe-area-context';

const Upload_Video_screen = ({navigation,route}) => {
  const [responseMessage, setResponseMessage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { ids,section,cource, Employe, semester,version,name,courcedesc,secname,venue} = route.params
  console.log(ids,section,cource,Employe,semester,version,name,courcedesc,secname,venue)
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  //console.log(formattedDate)

  const uploadVideo = async () => {
    if (!selectedVideo) {
      Alert.alert("Please select a video first.");
      return;
    }

    try {
      const file = selectedVideo;
      const destPath = `${RNFS.TemporaryDirectoryPath}/${file.name}`;
      await RNFS.copyFile(file.uri, destPath);

      const formData = new FormData();
     
      formData.append('date',formattedDate)
      formData.append('filename', `${ids}_${version}_${section}_${cource}_${Employe}`); // Assuming you want to use the selected file name
      formData.append('videos', {
        uri: `file://${destPath}`,
        name: file.name || 'video.mp4',
        type: file.type || 'video/mp4',
      });

      const response = await fetch(`${callurl}admin/uploadVideo`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        const json = await response.json();
        setResponseMessage(json.message);
        Alert.alert("Video is saved")
      } else {
        const errorData = await response.json();
        setResponseMessage(errorData.error || "Upload failed.");
      }
    } catch (error) {
      console.error(error);
      setResponseMessage("An error occurred while uploading the video");
    }
  };

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });

      const file = result[0];
      setSelectedVideo(file);
      console.log('Selected video URI:', file.uri);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User canceled the picker');
      } else {
        console.error(error);
      }
    }
  };

  return (
    <SafeAreaView>
      <View style={{ alignItems: 'center', padding: 20,marginTop:25,marginLeft:20,marginRight:20 }}>
        <View style={{height:300,width:320,borderColor:'#7097EA',borderRadius:20,borderWidth:1,backgroundColor:'#DFE7FA',padding:20,elevation:10}}>
          <View style={{height:50,width:'auto',flexDirection:'row',alignContent:'center',alignItems:'center'}}><Image source={require("../assets/user.png")} style={{height:40,width:40}}></Image>
          <Text style={{marginLeft:10,color:'black',fontWeight:'bold',fontSize:12}}>Name : {name}</Text>
          </View>

          <View style={{height:50,width:'auto',flexDirection:'row',alignContent:'center',alignItems:'center'}}><Image source={require("../assets/cource.png")} style={{height:40,width:40}}></Image>
          <Text style={{marginLeft:10,color:'black',fontWeight:'bold',fontSize:12}}>Cource : {courcedesc}</Text>
          </View>

          <View style={{height:50,width:'auto',flexDirection:'row',alignContent:'center',alignItems:'center'}}><Image source={require("../assets/section.png")} style={{height:40,width:40}}></Image>
          <Text style={{marginLeft:10,color:'black',fontWeight:'bold',fontSize:12}}>Section : {secname}</Text>
          </View>

          <View style={{height:50,width:'auto',flexDirection:'row',alignContent:'center',alignItems:'center'}}><Image source={require("../assets/cource_code.png")} style={{height:40,width:40}}></Image>
          <Text style={{marginLeft:10,color:'black',fontWeight:'bold',fontSize:12}}>Course_Code : {cource}</Text>
          </View>

          <View style={{height:50,width:'auto',flexDirection:'row',alignContent:'center',alignItems:'center'}}><Image source={require("../assets/venue.png")} style={{height:40,width:40}}></Image>
          <Text style={{marginLeft:10,color:'black',fontWeight:'bold',fontSize:12}}>Venue : {venue}</Text>
          </View>
          
        </View>
        <Button onPress={pickVideo} style={{ backgroundColor: '#90EE90', marginVertical: 10,width:300 }}>
          <Text style={{ color: 'black' }}>Select Video</Text>
        </Button>

        {selectedVideo && (
          <Image
            source={{ uri: selectedVideo.uri }}
            style={{ width: 200, height: 200, marginVertical: 10,borderColor:'#4169E1',borderWidth:1,borderRadius:20 }}
            resizeMode="cover"
          />
        )}

        <Button onPress={uploadVideo} style={{ backgroundColor: '#9EBBF2', marginVertical: 10,width:300 }}>
          <Text style={{ color: 'black' }}>Upload Video</Text>
        </Button>

        {responseMessage && <Text>{responseMessage}</Text>}
      </View>
    </SafeAreaView>
  );
};

export default Upload_Video_screen;
