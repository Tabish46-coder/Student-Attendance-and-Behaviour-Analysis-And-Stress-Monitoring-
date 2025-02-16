import React from "react";
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text } from "react-native-paper";

function Junior_Home({ navigation, route }) {
    const{role,id}=route.params
    console.log(role,id)
    const notification = () => {
        navigation.navigate('Teacher_notification',{user:route.params.id});
    };

    const goto_Timetable=()=>{
        navigation.navigate('Junior_Timetable',{user:route.params.id})

    }

    const goto_Attendance=()=>{
        navigation.navigate('Junior_Attendance',{emp_no:route.params.id})

    }

    const goto_Allocations=()=>{
       navigation.navigate('Junior_Allocations',{user:route.params.id}) 
    }
    const teacherProfile=()=>{
        navigation.navigate('Teacher_Profile',{user:route.params.id}) 
     }
     const teacherclaims=()=>{
        navigation.navigate('Teacher_Claims',{user:route.params.id}) 
     }

    return (
        <SafeAreaView style={{backgroundColor:'#FFFFF'}}>
            <View style={styles.card}>
                <View style={styles.notificationContainer}>
                    <TouchableOpacity onPress={notification}>
                        <Image source={require('../assets/bell.png')} style={styles.bellIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.infoContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.greetingText}>Hello!</Text>
                        <Text style={styles.nameText}>{route.params?.user || 'Guest'}</Text>
                        <Text style={styles.roleText}>{role}</Text>
                    </View>
                    <View style={styles.image}>
                        <Image source={require('../assets/profile.png')} style={styles.personIcon} />
                    </View>
                </View>
            </View>

            <View style={{height:'auto',flexDirection:'row'}}>
                <View style={styles.allocation}>
                    <Image source={require('../assets/profile.png')} style={styles.lowerimages}></Image>
                    <TouchableOpacity onPress={teacherProfile}>
                        <Text style={styles.profiletxt}>Profile</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.allocation}>
                    <Image source={require('../assets/allocation.png')} style={styles.lowerimages}></Image>
                    <TouchableOpacity onPress={goto_Allocations}>
                        <Text style={styles.allocationtext}>Allocations</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.allocation}>
                    <Image source={require('../assets/timetable.png')} style={styles.lowerimages}></Image>
                    <TouchableOpacity onPress={goto_Timetable}>
                        <Text style={styles.allocationtext}>Timetable</Text>
                    </TouchableOpacity>

                </View>

                
            </View>

            <View style={{height:'auto',flexDirection:'row'}}>
              
                <View style={styles.allocation}>
                    <Image source={require('../assets/attendance.png')} style={styles.lowerimages}></Image>
                    <TouchableOpacity onPress={goto_Attendance}>
                        <Text style={styles.allocationtext}>Attendance</Text>
                    </TouchableOpacity>
                </View>
                

                
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card: {
        height: 250,
        backgroundColor: '#078345',
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
        elevation:5
    },
    notificationContainer: {
        height: 80,
        flexDirection: 'row-reverse',
        paddingTop: 10,
        paddingRight: 10,
    },
    bellIcon: {
        height: 30,
        width: 30,
    },
    infoContainer: {
        height: 180,
        flexDirection: 'row',
    },
    textContainer: {
        height: 170,width:200
    },
    greetingText: {
        color: 'white',
        width: 200,
        height: 34,
        fontStyle: 'normal',
        fontWeight: 'bold',
        lineHeight: 40,
        fontSize: 18,
        marginLeft: 26,
    },
    nameText: {
        color: 'white',
        width: 'auto',
        fontStyle: 'normal',
        fontWeight: 'bold',
        lineHeight: 40,
        fontSize: 17,
        marginLeft: 25,
        height: 39,
    },
    allocationtext:{
        color: 'black',
        fontStyle: 'normal',
        lineHeight: 40,
        fontSize: 14,
        marginLeft:5

    },
    profiletxt:{
        color: 'black',
        fontStyle: 'normal',
        lineHeight: 40,
        fontSize: 14,
        marginLeft:20
    },
    roleText: {
        color: 'white',
        width: 100,
        fontStyle: 'normal',
        fontWeight: 'bold',
        lineHeight: 40,
        fontSize: 14,
        marginLeft: 25,
    },
    personIcon: {
        height: 100,
        width: 100,
        overflow:'hidden',
        borderRadius:60,
    },
    image:{
        width:100,
        alignItems:'center',
        height:100,
        borderRadius:60,
        marginLeft:30,
        elevation:10
    },
    allocation:{
        height:85,
        width:100,
        marginTop:50,
        overflow:'hidden',
        elevation:5,
        backgroundColor:'#e5e6e8',
        borderRadius:15,
        marginLeft:15,
        padding:10

    },
    lowerimages:{
        height:25,
        width:25,
        marginLeft:25
    }
})

export default Junior_Home;
