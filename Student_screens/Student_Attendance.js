import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert, Image,TouchableOpacity } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { callurl } from "../apifile";

const Studnet_Attendance = ({ navigation, route }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const regNo = route.params.user;

                if (!regNo) {
                    throw new Error('Please select a semester.');
                }

                const response = await fetch(`${callurl}enrolled?reg=${regNo}&sems_no=2024FM`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const fetchedData = await response.json();

                if (fetchedData.courses && fetchedData.courses.length > 0) {
                    setData(fetchedData.courses);
                } else {
                    throw new Error('No data received');
                }
            } catch (error) {
                console.error("Error during fetch:", error);
                Alert.alert('Error', error.message);
            } finally {
                setLoading(false);
            }
        };

            fetchCourses();
        
    }, []);

    function handlebutton(code){
        const registerationNo=route.params.user
        const semesterNo='2024FM'
        navigation.navigate("Attendance",{course:code,student:registerationNo,semester:semesterNo})
    }

    const renderItem = ({ item }) => {
        const [courseCode, courseName,credihours] = item.split(',').map((part) => part.trim());
        return (
            <View style={styles.itemContainer}>
                <View style={{width:40,height:40,alignItems:'center'}}>
                    <Image source={require('../assets/cource.png')} style={{height:30,width:30}}></Image>

                </View>
            <View style={{width:200,marginLeft:10}}>
                <Text style={styles.courseName}>{courseName}</Text>
                <Text style={styles.courseCode}>{courseCode}</Text>
                <Text style={styles.courseCode}>{credihours}</Text>
            </View>
            <View style={{height:30,width:30}}>
                <TouchableRipple style={{padding:5,width:'auto'}} onPress={()=>{handlebutton(courseCode)}} rippleColor="#209920">
                    <Image source={require('../assets/arrow.png')} style={{height:20,width:20}}></Image>
                </TouchableRipple>
            </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.listView}>
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor:'#FFFFF'
    },
    dropdownview: {
        height: 80,
        width: 150,
        paddingTop: 10,
        flexDirection: 'row',
        marginLeft: 90,
    },
    dropdown: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        width: 150,
        backgroundColor: 'white',
        elevation: 20,
    },
    listView: {
        flex: 1,
    },
    listContainer: {
        padding: 10,
    },
    itemContainer: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#e5e6e8',
        borderRadius: 10,
        elevation: 5,
        marginTop: 20,
        flexDirection:'row',
        alignItems:'center',
       
    },
    courseName: {
        fontSize: 12,
        color: '#343A46',
        fontWeight: '600',
    },
    courseCode: {
        fontSize: 12,
        color: '#acb0b4',
        fontWeight: '400',
    },
});

export default Studnet_Attendance;
