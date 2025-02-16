import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { callurl } from "../apifile"; // Ensure the correct import for the API URL

const Teacher_allocation = ({ navigation, route }) => {
    const [semester, setSemester] = useState('2024SM');
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const empNO = route.params.user; // Assuming user reg_no is passed in route params
                console.log('Reg No:', empNO); // Debugging
                const semesterNo = semester;
                console.log('Semester No:', semesterNo); // Debugging

                // Validate parameters
                if (!empNO || !semesterNo) {
                    throw new Error('Please select a semester.');
                }

                const response = await fetch(`${callurl}allocated?emp_no=${empNO}&sems_no=${semesterNo}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const fetchedData = await response.json();
                console.log('Fetched Data:', fetchedData); // Debugging

                // Convert the allocations object into an array of course data
                const allocationData = Object.entries(fetchedData.allocations).map(([courseInfo, classes]) => {
                    const [courseNo, courseDesc, creditHrs] = courseInfo.split(',');
                    return { courseNo, courseDesc, creditHrs, classes };
                });

                if (allocationData.length > 0) {
                    setData(allocationData);
                } else {
                    throw new Error('No data received');
                }
            } catch (error) {
                console.error("Error during fetch:", error);
                Alert.alert('Error', error.message);
            } finally {
                setLoading(false); // Set loading to false after fetch completes
            }
        };

        // Fetch courses only if semester is selected
        if (semester) {
            fetchCourses();
        }
    }, [semester]); // Dependency on semester to re-fetch when it changes

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.courseDesc}>{item.courseDesc}</Text>
            <Text style={styles.courseNo}>Course No: {item.courseNo}</Text>
            <Text style={styles.creditHrs}>Credit Hours: {item.creditHrs.trim()}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.dropdownview}>
                <Image source={require('../assets/semester.png')} style={{ height: 50, width: 50, marginRight: 40 }} />
                <DropDownPicker
                    open={open}
                    value={semester}
                    items={[
                        { label: '2024SM', value: '2024SM' },
                        { label: '2023FM', value: '2023FM' },
                        { label: '2023SM', value: '2023SM' },
                        { label: '2022FM', value: '2022FM' },
                        { label: '2022SM', value: '2022SM' },
                        {label: '2021FM', value: '2021FM'},
                        {label: '2021SM', value: '2021SM'}
                    ]}
                    setOpen={setOpen}
                    setValue={setSemester}
                    placeholder="Select Semester"
                    style={styles.dropdown}
                />
            </View>

            <View style={styles.listView}>
                {loading ? (
                    <Text>Loading...</Text> 
                ) : (
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()} 
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
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
        elevation: 5,
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
    },
    courseDesc: {
        fontSize: 12,
        color: 'black',
        fontStyle: 'normal',
        fontWeight: 'bold',
    },
    courseNo: {
        fontSize: 12,
        color: '#83888d',
    },
    creditHrs: {
        fontSize: 12,
        color: '#83888d',
    },
});

export default Teacher_allocation;
