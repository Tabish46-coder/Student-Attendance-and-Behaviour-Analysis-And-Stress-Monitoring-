import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert, Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { callurl } from "../apifile"; // Ensure the correct import for the API URL
import moment from 'moment';

const { width } = Dimensions.get('window');

const Junior_Timetable = ({ navigation, route }) => {
    const [slotday, setslotday] = useState('Monday');
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        // Set today's date initially
        const today = moment();
        setCurrentDate(today.format('MMMM DD, YYYY'));

        // Fetch the courses for the current default slotday
        fetchCourses();
    }, []);

    useEffect(() => {
        // Update the date when slotday changes
        const today = moment();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const currentDayIndex = today.day(); // 0 for Sunday, 1 for Monday, etc.
        const selectedDayIndex = daysOfWeek.indexOf(slotday);

        let difference = selectedDayIndex - currentDayIndex;

        // If the selected day is earlier in the week, find the next occurrence
        if (difference < 0) {
            difference += 7;
        }

        const newDate = today.add(difference, 'days');
        setCurrentDate(newDate.format('MMMM DD, YYYY'));

        // Fetch courses based on the new slotday
        fetchCourses();
    }, [slotday]);

    const fetchCourses = async () => {
        try {
            const employeno = route.params.user; 
console.log(employeno)
            const semesterNo = '2024FM';
            const slot_day = slotday;

            if (!employeno || !slot_day) {
                throw new Error('Please select a semester.');
            }

            const response = await fetch(`${callurl}jr-lecturer/timetable?teacher_id=${employeno}&semester_no=${semesterNo}&slot_day=${slot_day}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const fetchedData = await response.json();

            if (fetchedData.length > 0) {
                setData(fetchedData);
            } else {
                Alert.alert('Note','No Classes Found');
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.courseDetails}>
                <Text style={styles.courseDesc}>{item.course_desc}</Text>
                <Text style={styles.sectionVenue}>{item.section} | {item.venue}</Text>
            </View>
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{item.slot_starttime.slice(0, 5)} - {item.slot_endtime.slice(0, 5)}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.dropdownview}>
                <Text style={styles.dateText}>{currentDate}</Text>
                <DropDownPicker
                    open={open}
                    value={slotday}
                    items={[
                        { label: 'Monday', value: 'Monday' },
                        { label: 'Tuesday', value: 'Tuesday' },
                        { label: 'Wednesday', value: 'Wednesday' },
                        { label: 'Thursday', value: 'Thursday' },
                        { label: 'Friday', value: 'Friday' },
                        {label:'Saturday', value:'Saturday'}
                    ]}
                    setOpen={setOpen}
                    setValue={setslotday}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                />
            </View>

            <View style={styles.listView}>
                {loading ? (
                    <Text style={styles.loadingText}>Loading...</Text>
                ) : (
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFF',
        height: '100%',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    dropdownview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        height: 60,
        width:140
    },
    dropdown: {
        width: 120,
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 8,
        marginLeft:20
    },
    dropdownContainer: {
        backgroundColor: 'white',
    },
    dateText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor:'#90EE90',
        width:220
    },
    listView: {
        marginTop: 10,
    },
    listContainer: {
        paddingVertical: 10,
        backgroundColor:'#FFFFF'
    },
    card: {
        backgroundColor: '#e5e6e8',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft:10,
        marginRight:10,
    },
    courseDetails: {
        width: '65%',
    },
    sectionVenue: {
        fontSize: 12,
        color: '#83888d',
        fontWeight: 'bold',
        marginTop: 5,
    },
    courseDesc: {
        fontSize: 12,
        color: 'black',
        fontWeight: 'bold',
    },
    timeContainer: {
        justifyContent: 'center',
    },
    timeText: {
        fontSize: 14,
        color: '#83888d',
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#5d6166',
        padding: 5,
        width: 110,
        borderRadius: 5,
        backgroundColor:'#f5f6f6',
        elevation:5
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Junior_Timetable;
