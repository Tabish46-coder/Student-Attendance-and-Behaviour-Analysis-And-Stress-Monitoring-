import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { callurl } from "../apifile";

const Student_enrollment = ({ navigation, route }) => {
    const [semester, setSemester] = useState('2024FM');
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const regNo = route.params.user;
                const semesterNo = semester;

                if (!regNo || !semesterNo) {
                    throw new Error('Please select a semester.');
                }

                const response = await fetch(`${callurl}enrolled?reg=${regNo}&sems_no=${semesterNo}`, {
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
                    Alert.alert('No Courses', 'No courses found for selected semester.');
                    setData([]);
                }
            } catch (error) {
                console.error("Error during fetch:", error);
                Alert.alert('Error', error.message);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        if (semester) {
            fetchCourses();
        }
    }, [semester]);

    const renderItem = ({ item }) => {
        const [courseCode, courseName] = item.split(',').map((part) => part.trim());
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.courseName}>{courseName}</Text>
                <Text style={styles.courseCode}>{courseCode}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.dropdownContainer}>
                <Image 
                    source={require('../assets/semester.png')} 
                    style={styles.semesterIcon} 
                />
                <View style={styles.dropdownWrapper}>
                    <DropDownPicker
                        open={open}
                        value={semester}
                        items={[
                            { label: '2024SM', value: '2024SM' },
                            { label: '2023FM', value: '2023FM' },
                            { label: '2023SM', value: '2023SM' },
                            { label: '2022FM', value: '2022FM' },
                            { label: '2022SM', value: '2022SM' },
                            { label: '2021FM', value: '2021FM' },
                            { label: '2021SM', value: '2021SM' }
                        ]}
                        setOpen={setOpen}
                        setValue={setSemester}
                        placeholder="Select Semester"
                        style={styles.dropdown}
                        zIndex={1000}
                        zIndexInverse={3000}
                        modalProps={{
                            animationType: "fade"
                        }}
                        modalTitle="Select Semester"
                    />
                </View>
            </View>

            <View style={styles.listView}>
                {loading ? (
                    <Text style={styles.loadingText}>Loading...</Text>
                ) : data.length === 0 ? (
                    <Text style={styles.noCoursesText}>No courses found</Text>
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
        backgroundColor: '#FFFFFF'
    },
    dropdownContainer: {
        height: 80,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        position: 'relative',
        marginBottom: 10
    },
    dropdownWrapper: {
        zIndex: 1000,
        width: '60%'
    },
    semesterIcon: {
        height: 50, 
        width: 50, 
        marginRight: 20
    },
    dropdown: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    listView: {
        flex: 1,
        zIndex: 1
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
    courseName: {
        fontSize: 14,
        color: '#343A46',
        fontWeight: '600',
    },
    courseCode: {
        fontSize: 12,
        color: '#acb0b4',
        fontWeight: '400',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    noCoursesText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#888'
    }
});

export default Student_enrollment;