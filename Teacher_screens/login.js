import React, { useState } from "react";
import { Button,Text,TextInput} from "react-native-paper";
import { StyleSheet, SafeAreaView, View, Image, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView } from "react-native";
import { callurl } from "../apifile";
import Svg, { Path } from 'react-native-svg';

function Login({ navigation }) {
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleButton = async () => {
        try {
            if (!username || !password) {
                throw new Error('Please enter both username and password.');
            }

            const response = await fetch(`${callurl}login?user_id=${username}&password=${password}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('UserName or Password is wrong');
            }

            const data = await response.json();

            if (data && data.role === 'Teacher') {
                navigation.navigate('Teacher_home', { user: data.name, id: data.user_id,role:data.role });
            } else if (data && data.role === 'Student') {
                navigation.navigate('student_home', { user: data.name, id: data.user_id,role:data.role  });
            } else if (data && data.role === 'Admin') {
                navigation.navigate('Admin_Homepage', { user: data.name,role:data.role  });
            }
            else if (data && data.role==='DataCell'){
                navigation.navigate('Datacell_Home',{role:data.role})
            }
            else if (data && data.role==='Committee'){
                navigation.navigate('CMM_Home',{role:data.role})
            }
            else if (data && data.role==='Jr. Lecturer'){
                navigation.navigate('Junior_Home',{role:data.role,id: data.user_id})
            }
            else if (data && data.role==='CR/GR'){
                navigation.navigate('CRGR_Home',{role:data.role,id: data.user_id,user: data.name})
            }
            else if (!data){
                Alert.alert('Email or Password is wrong')
            }
             else {
                throw new Error('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error("Error during login:", error);
            Alert.alert('Login Failed', error.message);
        }
    };

    return (
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
                <SafeAreaView style={{ backgroundColor: '#FFFFF', flex: 1 }}>
                <View style={style.curveContainer}>
        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 1440 320"
          style={style.svgCurve}
        >
          <Path
            fill="#078345" // Orange color
            d="M0,96L60,106.7C120,117,240,139,360,165.3C480,192,600,224,720,234.7C840,245,960,235,1080,213.3C1200,192,1320,160,1380,144L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
        </Svg>
        
      </View>
                    <View style={style.pictureview}>
                        <Image source={require('../assets/BIIT.png')} style={style.image} />
                    </View>

                    <View style={style.loginview}>
                        <View style={{ marginTop: 65, height: 220, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', width: 300, borderRadius: 10, alignItems: 'center', paddingLeft: 10, backgroundColor: '#FFFFF', borderWidth: 1,borderColor:'green' }}>
                                <Image source={require('../assets/person.png')} style={{ height: 20, width: 20 }} />
                                <TextInput placeholder="Username" style={style.text} onChangeText={(text) => { setUsername(text) }} placeholderTextColor={'black'} />
                            </View>

                            <View style={{ flexDirection: 'row', width: 300, borderRadius: 10, marginTop: 25, alignItems: 'center', paddingLeft: 10, backgroundColor: '#FFFFF', borderWidth: 1,borderColor:'green' }}>
                                <Image source={require('../assets/lock.png')} style={{ height: 20, width: 20 }} />
                                <TextInput placeholder="Password" style={style.text} secureTextEntry={!isPasswordVisible} onChangeText={(text) => { setPassword(text) }} placeholderTextColor={'black'} />
                                <TouchableOpacity style={{ height: 30, width: 30, paddingLeft: 20, paddingTop: 2 }} onPress={() => setPasswordVisible(!isPasswordVisible)}>
                                    <Image style={{ height: 25, width: 25 }} source={isPasswordVisible ? require('../assets/eye-open.png') : require('../assets/eye-close.png')} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginTop: 70, height: 100, width: 300,alignItems:'center' }}>
                                <TouchableOpacity style={{ backgroundColor: '#078345', height: 50, alignItems: 'center',width:300,alignContent:'center',borderRadius:25}} onPress={handleButton}>
                                    <Text style={{ color: 'white',marginTop:12,fontWeight:'bold' }}>Login</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 30 }}>
                                <Text style={{ color: '#078345', fontSize: 12 }}>All Rights Reserved</Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const style = StyleSheet.create({
    pictureview: {
        height: 200,
        marginTop: 20,
        
    },
    image: {
        width: 200,
        height: 200,
        marginLeft: 88,
        resizeMode: 'contain',
    },
    loginview: {
        height: 500,
        alignItems: 'center',
    },
    text: {
        width: 215,
        borderRadius: 1,
        height: 50,
        paddingLeft: 8,
        color: 'black',
        backgroundColor:'#FFFFF'
    },
    curveContainer: {
        height: 85.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFF',
        position: 'relative',
        width:'auto'
      },
      svgCurve: {
        position: 'absolute',
        top: 0,
        left: 0,
      },
});

export default Login;
