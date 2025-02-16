import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Settings } from "react-native";


function CMM_Home({navigation, route}) {
    const {role}=route.params
    console.log(role)
  
    const logout=()=>{
        navigation.navigate('Login')
    }
    const createvoilations=()=>{
        navigation.navigate('CMM_Add_Voilations')
    }
    const viewvoilations=()=>{
        navigation.navigate('CMM_Voilations')
    }

    const log=()=>{
     navigation.navigate("CMM_Voilations_Details")
    }

    const upload_video=()=>{
        navigation.navigate("CMM_upload_Video")
    }

    return (
        <SafeAreaView>
            <View style={styles.upperview}>
                <View style={styles.biitlogo}>
                    <Image source={require('../assets/BIIT.png')} style={{height:80, width:80, marginLeft:15}}></Image>
                </View>
                <View style={{marginLeft:50,marginBottom:30}}>
                    <Text style={{fontWeight:'bold', fontSize:16, color:'white'}}>Welcome</Text>
                    <Text style={{fontWeight:'bold', fontSize:16, color:'white', marginTop:10}}>MR.{role}</Text>
                </View>
                <View style={styles.logoutlogo}>
                    <TouchableOpacity onPress={logout}>
                        <Image source={require('../assets/quit.png')} style={{height:30, width:30}}></Image>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.lowerview}>
              <View style={{flexDirection:'row',alignItems:'center',width:'auto',padding:10,marginTop:20,marginLeft:20}}>
              
                <View style={{height:100,backgroundColor:'#e5e6e8',width:150,alignItems:'center',borderRadius:10,elevation:5,marginLeft:10}}>
                    <Image source={require('../assets/voilation.png')} style={{width:50,height:50,marginTop:10}}></Image>
                    <TouchableOpacity onPress={createvoilations}>
                    <Text style={{fontWeight:'bold',fontSize:16,marginTop:5}}>Create Voilations</Text>
                    </TouchableOpacity>
                    
                    
                </View>
                

                <View style={{height:100,backgroundColor:'#e5e6e8',width:150,alignItems:'center',borderRadius:10,marginLeft:20,elevation:5}}>
                    <Image source={require('../assets/punishment.png')} style={{width:60,height:60}}></Image>
                    <TouchableOpacity onPress={viewvoilations} >
                    <Text style={{fontWeight:'bold',fontSize:16,marginTop:5}}>View Voilations</Text>
                    </TouchableOpacity>
                </View>

              </View>   

              <View style={{flexDirection:'row',alignItems:'center',width:'auto',padding:10,marginTop:20,marginLeft:20}}>
              <View style={{height:100,backgroundColor:'#e5e6e8',width:150,alignItems:'center',borderRadius:10,marginLeft:10,elevation:5,marginTop:20,padding:10}}>
                    <Image source={require('../assets/uploadvideo.png')} style={{width:50,height:50}}></Image>
                    <TouchableOpacity onPress={()=>{upload_video()}}>
                    <Text style={{fontWeight:'bold',fontSize:16,marginTop:5}}>Upload Videos</Text>
                    </TouchableOpacity>
                </View>

                <View style={{height:100,backgroundColor:'#e5e6e8',width:150,alignItems:'center',borderRadius:10,marginLeft:20,elevation:5,marginTop:20,padding:10}}>
                    <Image source={require('../assets/logs.png')} style={{width:50,height:50}}></Image>
                    <TouchableOpacity onPress={()=>{log()}}>
                    <Text style={{fontWeight:'bold',fontSize:16,marginTop:5}}>Punishment Logs</Text>
                    </TouchableOpacity>
                </View>
                </View>
              
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    upperview: {
        height: 130,
        width: '100%',
        backgroundColor: '#078345',
        alignItems: 'center',
        flexDirection: 'row',
        zIndex: 1,
    },
    biitlogo: {
        height: 80,
        width: 80,
        marginBottom:30,
    },
    notoficationlogo: {
        height: 50,
        width: 50,
        marginLeft: 60,
        marginTop: 15,
        marginBottom:30
    },
    logoutlogo: {
        height: 50,
        width: 50,
        marginTop: 15,
        marginBottom:30,
        marginLeft:70
    },
    lowerview: {
        position: 'absolute', // Make it absolute to allow overlapping
        top: 100, // Adjust this value to control the overlap
        left: 0,
        right: 0,
        bottom:100,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        height: 800,
        backgroundColor: 'white',
        zIndex: 2,
        elevation:5
    }
});

export default CMM_Home;