import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert, Dimensions, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { callurl } from "../apifile";
import moment from 'moment';


const AdminTimetable = ({ navigation, route }) => {
    const [slotday, setslotday] = useState('Monday');
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const today = moment();
        setCurrentDate(today.format('YYYY-MM-DD'));

        // Fetch the timetable for the default slotday and date
        fetchCourses(today.format('YYYY-MM-DD'));
    }, []);

    useEffect(() => {
        const today = moment();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDayIndex = today.day();
        const selectedDayIndex = daysOfWeek.indexOf(slotday);

        let difference = selectedDayIndex - currentDayIndex;
        if (difference < 0) {
            difference += 7;
        }

        const newDate = today.add(difference, 'days').format('YYYY-MM-DD');
        setCurrentDate(newDate);

        // Fetch timetable based on the new slotday and date
        fetchCourses(newDate);
        
    }, [slotday]);

    const fetchCourses = async (date) => {
        try {
            const semesterNo = '2024SM';
            const slot_day = slotday;

            if (!slot_day || !date) {
                throw new Error('Missing slot day or date.');
            }

            const response = await fetch(`${callurl}admin/timetable?slot_day=${slot_day}&semester_no=${semesterNo}&date=${date}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const fetchedData = await response.json();

            if (fetchedData && fetchedData.length > 0) {
                setData(fetchedData);
                console.log(fetchedData)
            } else {
                throw new Error('No timetable data found');
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => {
        // Ensure item is defined before trying to access its properties
        if (!item) return null;

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() =>
                    navigation.navigate("Upload_Video_screen", {
                        ids: item.id,
                        section: item.section_id,
                        cource: item.course_id,
                        Employe: item.Emp_no,
                        semester: item.semester_no,
                        version: item.version_id,
                        name: item.teacher,
                        courcedesc: item.course_desc,
                        secname: item.section,
                        venue: item.venue,
                    })
                }
            >
                <View style={styles.courseDetails}>
                    <Text style={styles.courseDesc}>{item.course_desc}</Text>
                    <Text style={styles.sectionVenue}>{item.section} | {item.venue}</Text>
                    <Text style={styles.teacherText}>Teacher: {item.teacher}</Text>
                    <Text style={styles.statusText}>Status: {item.status}</Text>
                </View>
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>
                        {item.slot_starttime.slice(0, 5)} - {item.slot_endtime.slice(0, 5)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.dropdownview}>
                <Text style={styles.dateText}>{moment(currentDate).format('MMMM DD, YYYY')}</Text>
                <DropDownPicker
                    open={open}
                    value={slotday}
                    items={[
                        { label: 'Monday', value: 'Monday' },
                        { label: 'Tuesday', value: 'Tuesday' },
                        { label: 'Wednesday', value: 'Wednesday' },
                        { label: 'Thursday', value: 'Thursday' },
                        { label: 'Friday', value: 'Friday' },
                        { label: 'Saturday', value: 'Saturday' },
                    ]}
                    setOpen={setOpen}
                    setValue={setslotday}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                />
            </View>

            {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => (item ? item.id.toString() : Math.random().toString())}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={<Text style={styles.loadingText}>No timetable data available.</Text>}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    dropdownview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        height: 60,
        width:140,
        
    },
    dropdown: {
        width: 140,
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 8,
        marginLeft: 20
    },
    dropdownContainer: {
        backgroundColor: 'white',
        marginLeft:20
    },
    dateText: {
        color: 'black',
        fontSize: 12,
        fontWeight: 'bold',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#90EE90',
        width: 150
    },
    listContainer: {
        paddingVertical: 10,
    },
    card: {
        backgroundColor: '#e5e6e8',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
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
        color: '#444E60',
        fontWeight: 'bold',
    },
    timeContainer: {
        justifyContent: 'center',
        backgroundColor:'#e5e6e8',
        borderRadius: 10
    },
    timeText: {
        fontSize: 12,
        color: '#686d72',
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#5d6166',
        padding: 5,
        width: 110,
        borderRadius: 10,
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    teacherText: {
        fontSize: 12,
        color: '#83888d',
        marginTop: 5,
        fontWeight:'bold'
    },
    statusText: {
        fontSize: 14,
        color: '#FF2A23',
        fontWeight: 'bold',
        marginTop: 5,
        textShadowColor: '#FF9794', // Shadow color matching the text
        textShadowOffset: { width: 0, height: 0 }, // Center the shadow
        textShadowRadius: 10,
    },
});

export default AdminTimetable;
