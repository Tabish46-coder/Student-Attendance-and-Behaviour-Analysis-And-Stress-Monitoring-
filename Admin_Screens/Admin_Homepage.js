import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Settings } from "react-native";

function Admin_Homepage({navigation, route}) {
    const {role,user}=route.params
    console.log(role)
    const gototimetable=()=>{
        navigation.navigate('AdminTimetable1')
    }
    const Admin_Teachers=()=>{
        navigation.navigate('Admin_Teachers')
    }
    const setting=()=>{
        navigation.navigate('Admin_Setting')
    }
    const logout=()=>{
        navigation.navigate('Login')
    }
    const notification=()=>{
     navigation.navigate('Admin_Notification')
    }
    const students=()=>{
        navigation.navigate('Admin_Students')
    }

    const gotopunish=()=>{
        navigation.navigate("Admin_Punish_Students")
    }

    const gotosetting=()=>{
        navigation.navigate("Admin_Setting")
    }

    const gotoprofile=()=>{
        navigation.navigate("Teacher_Profile",{roleof:role,user:user})
    }
    const gototasks=()=>{
        navigation.navigate('Tasks')
    }

  const gotocomparison=()=>{
    navigation.navigate('ComparisonChartScreen')
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
                <View style={styles.notoficationlogo}>
                    <TouchableOpacity onPress={notification}>
                        <Image source={require('../assets/bell.png')} style={{height:30, width:30}}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.logoutlogo}>
                    <TouchableOpacity onPress={logout}>
                        <Image source={require('../assets/quit.png')} style={{height:30, width:30}}></Image>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.lowerview}>
              <View style={{flexDirection:'row',alignItems:'center',width:'auto',padding:10,marginTop:20}}>
              <View style={{height:100,backgroundColor:'#e5e6e8',width:150,alignItems:'center',borderRadius:10,elevation:5,marginLeft:15}}>
                    <Image source={require('../assets/profile.png')} style={{width:50,height:50,marginTop:10}}></Image>
                    <TouchableOpacity onPress={gotoprofile}>
                    <Text style={{fontWeight:'bold',fontSize:16,marginTop:5}}>Profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={{height:100,backgroundColor:'#e5e6e8',width:150,alignItems:'center',borderRadius:10,marginLeft:40,elevation:5}}>
                    <Image source={require('../assets/students.png')} style={{width:50,height:50,marginTop:10}}></Image>
                    <TouchableOpacity onPress={students}>
                    <Text style={{fontWeight:'bold',fontSize:16,marginTop:5}}>Students</Text>
                    </TouchableOpacity>
                </View>

              </View>


              <View style={{flexDirection:'row',alignItems:'center',width:'auto',padding:10,marginTop:20,marginLeft:15}}>
              <View style={{height:100,backgroundColor:'#e5e6e8',width:150,alignItems:'center',borderRadius:10,elevation:5}}>
                    <Image source={require('../assets/settings.png')} style={{width:50,height:50,marginTop:10}}></Image>
                    <TouchableOpacity onPress={setting}>
                    <Text style={{fontWeight:'bold',fontSize:16,marginTop:5}}>Settings</Text>
                    </TouchableOpacity>
                </View>
              

                <View style={{height:100,backgroundColor:'#e5e6e8',width:150,alignItems:'center',borderRadius:10,marginLeft:40,elevation:5}}>
                    <Image source={require('../assets/attendance.png')} style={{width:50,height:50,marginTop:10}}></Image>
                    <TouchableOpacity onPress={gototimetable}>
                    <Text style={{fontWeight:'bold',fontSize:15,marginTop:5}}>Mark Attendance</Text>
                    </TouchableOpacity>
                </View>

              </View>

              <View style={{flexDirection:'row',alignItems:'center',width:'auto',padding:10,marginTop:20,marginLeft:15}}>
              <View style={{height:100,backgroundColor:'#e5e6e8',width:150,alignItems:'center',borderRadius:10,elevation:5}}>
                    <Image source={require('../assets/punish.png')} style={{width:50,height:50,marginTop:10}}></Image>
                    <TouchableOpacity onPress={gotopunish}>
                    <Text style={{fontWeight:'bold',fontSize:16,marginTop:5}}>Punished Students</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={Admin_Teachers}>
                <View style={{height:100,backgroundColor:'#e5e6e8',width:150,alignItems:'center',borderRadius:10,elevation:5,marginLeft:40}}>
                    <Image source={require('../assets/teacher.png')} style={{width:50,height:50,marginTop:10}}></Image>
                    
                    <Text style={{fontWeight:'bold',fontSize:16,marginTop:5}}>Teachers</Text>
                    
                </View>
                </TouchableOpacity>
              

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

export default Admin_Homepage;


