import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { callurl } from "../apifile";
import moment from 'moment';

const AdminTimetable1 = ({ navigation }) => {
    const [slotday, setslotday] = useState('Monday');
    const [open, setOpen] = useState(false);
    const [groupedData, setGroupedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const today = moment();
        setCurrentDate(today.format('YYYY-MM-DD'));
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
        fetchCourses(newDate);
    }, [slotday]);

    const fetchCourses = async (date) => {
        try {
            const semesterNo = '2024FM';
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
                const timeGroupedData = groupClassesByTime(fetchedData);
                setGroupedData(timeGroupedData);
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

    const groupClassesByTime = (data) => {
        // Ensure data is an array
        if (!Array.isArray(data)) {
            console.error('Invalid data type in groupClassesByTime');
            return [];
        }

        // Group by time slot (start and end times)
        const timeSlotMap = data.reduce((acc, item) => {
            // Ensure item is not undefined
            if (!item) return acc;

            const timeKey = `${item.slot_starttime}_${item.slot_endtime}`;
            if (!acc[timeKey]) {
                acc[timeKey] = {
                    slot_starttime: item.slot_starttime?.slice(0, 5) || '',
                    slot_endtime: item.slot_endtime?.slice(0, 5) || '',
                    classes: [item], // Store all class data for this time slot
                };
            } else {
                acc[timeKey].classes.push(item);
            }
            return acc;
        }, {});

        // Convert the grouped time slots to an array and sort by start time
        return Object.values(timeSlotMap).sort((a, b) =>
            a.slot_starttime.localeCompare(b.slot_starttime)
        );
    };

    const handleNavigation = (classes) => {
        // Ensure classes is an array before navigation
        if (Array.isArray(classes) && classes.length > 0) {
            navigation.navigate('Admin_Timetable2', { classes });
        }
    };

    const renderItem = ({ item }) => {
        // Add null check for item and item.classes
        if (!item || !item.classes) return null;

        return (
            <TouchableOpacity 
                onPress={() => handleNavigation(item.classes)} 
                style={styles.card}
            >
                <View style={styles.courseDetails}>
                    <Text style={styles.timeText}>
                        {item.slot_starttime} - {item.slot_endtime}
                    </Text>

                    {item.classes && item.classes.length > 1 && (
                        <Text style={styles.countText}>
                            {item.classes.length} classes at this time
                        </Text>
                    )}
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
                    data={groupedData}
                    renderItem={renderItem}
                    keyExtractor={(item) => `${item?.slot_starttime}_${item?.slot_endtime}`}
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
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#1C791D',
        width: 150
    },
    listContainer: {
        paddingVertical: 10,
    },
    card: {
        backgroundColor: '#C0F3BF',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginLeft: 10,
        marginRight: 10,
        alignItems:'center'
    },
    courseDetails: {
        alignItems: 'center',
    },
   
    timeText: {
        fontSize: 16,
        color: 'black',
        marginBottom: 5,
        fontWeight:'bold',
    },
    sectionVenue: {
        fontSize: 12,
        color: '#83888d',
        fontWeight: 'bold',
        marginTop: 5,
    },
    countText: {
        fontSize: 12,
        color: '#7531ff',
        fontWeight: 'bold',
    },
    timeContainer: {
        justifyContent: 'center',
        backgroundColor:'#e5e6e8',
        borderRadius: 10
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
export default AdminTimetable1