import React from "react";
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text } from "react-native-paper";

function Home({ navigation, route }) {
    console.log(route.params.id)
    const{role}=route.params
    console.log(role)
    const notification = () => {
        navigation.navigate('Teacher_notification',{user:route.params.id,roleof:role});
    };

    const goto_allocation=()=>{
        navigation.navigate('Teacher_allocation',{user:route.params.id})
    }

    const goto_attendance=()=>{
        navigation.navigate('Teacher_attendance',{emp_no:route.params.id})

    }

    const goto_timetable=()=>{
       navigation.navigate('Teacher_timetable',{user:route.params.id}) 
    }
    const teacherProfile=()=>{
        navigation.navigate('Teacher_Profile',{user:route.params.id,roleof:role}) 
     }
     const teacherclaims=()=>{
        navigation.navigate('Teacher_Claims',{user:route.params.id}) 
     }

     const gotocrgr=()=>{
        navigation.navigate('Teacher_Manage_CRGR',{emp_no:route.params.id})
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
                    <Image source={require('../assets/allocation.png')} style={styles.lowerimages}></Image>
                    <TouchableOpacity onPress={goto_allocation}>
                        <Text style={styles.allocationtext}>Allocation</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.allocation}>
                    <Image source={require('../assets/attendance.png')} style={styles.lowerimages}></Image>
                    <TouchableOpacity onPress={goto_attendance}>
                        <Text style={styles.allocationtext}>Attendance</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.allocation}>
                    <Image source={require('../assets/timetable.png')} style={styles.lowerimages}></Image>
                    <TouchableOpacity onPress={goto_timetable}>
                        <Text style={styles.allocationtext}>Timetable</Text>
                    </TouchableOpacity>

                </View>

                
            </View>


            
            <View style={{height:'auto',flexDirection:'row'}}>
                <View style={styles.allocation}>
                    <Image source={require('../assets/profile.png')} style={styles.lowerimages}></Image>
                    <TouchableOpacity onPress={teacherProfile}>
                        <Text style={{marginLeft:15,marginTop:10}}>Profile</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.allocation}>
                    <Image source={require('../assets/claim.png')} style={styles.lowerimages}></Image>
                    <TouchableOpacity onPress={teacherclaims}>
                        <Text style={{marginLeft:15,marginTop:10}}>Clamis</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.allocation}>
                    <Image source={require('../assets/settings.png')} style={styles.lowerimages}></Image>
                    <TouchableOpacity onPress={gotocrgr}>
                        <Text style={{marginLeft:15,marginTop:10}}>Manage CR/GR</Text>
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
    roleText: {
        color: 'white',
        width: 70,
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

export default Home;
