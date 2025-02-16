import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, StatusBar, Modal, TouchableOpacity } from 'react-native';
import { callurl } from '../apifile';

const Teacher_Held_Classes_Detail = ({ navigation, route }) => {
    const { held_id } = route.params;
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await fetch(`${callurl}teacher/held-classes/students-attendance?held_id=${held_id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                setAttendanceData(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, [held_id]);

    const handleStudentPress = (student) => {
        setSelectedStudent(student);
        setModalVisible(true);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.errorText}>Error: {error}</Text>;
    }

    const filteredStudents = attendanceData?.students_attendance.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.reg_no.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalStudents = attendanceData?.students_attendance.length || 0;
    const presentStudents = attendanceData?.students_attendance.filter(student => student.att_status === 'P').length || 0;
    const absentStudents = totalStudents - presentStudents;

    const calculateAttendancePercentage = (student) => {
        if (!student) return 0;
        return ((student.present_count / student.total_attendances) * 100).toFixed(1);
    };


    const handleAttendanceUpdate = async (student) => {
        const updatedStatus = student.att_status === 'P' ? 'A' : 'P'; // Toggle the status
    
        try {
            // Call the new API to update attendance status
            const response = await fetch(`${callurl}teacher/attendance-update-all`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    held_id: attendanceData.metadata.held_id, // Using held_id instead of attendance_id
                    student_id: student.reg_no, // Sending only one student_id
                    status: updatedStatus, // Updated status
                })
            });
    
            const data = await response.json();
            
            if (response.ok) {
                console.log('Attendance updated successfully:', data.message);
                // Update local state to reflect the changes
                setAttendanceData(prevData => {
                    const updatedStudents = prevData.students_attendance.map(s => {
                        if (s.reg_no === student.reg_no) {
                            return { ...s, att_status: updatedStatus };
                        }
                        return s;
                    });
                    return { ...prevData, students_attendance: updatedStudents };
                });
                setModalVisible(false); // Close the modal
            } else {
                console.error('Error updating attendance:', data.message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#006400" barStyle="light-content" />

            <View style={styles.header}>
                <Text style={styles.dateText}>
                    Date: {attendanceData?.metadata.slot_day}, {attendanceData?.metadata.date}
                </Text>
                <Text style={styles.timeText}>
                    Time: {attendanceData?.metadata.slot_starttime} - {attendanceData?.metadata.slot_endtime}
                </Text>
                <Text style={styles.venueText}>Venue: {attendanceData?.metadata.venue.name}</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={[styles.statBox, styles.totalBox]}>
                    <Text style={styles.statNumber}>Total: {totalStudents}</Text>
                </View>
                <View style={[styles.statBox, styles.presentBox]}>
                    <Text style={styles.statNumber}>Present: {presentStudents}</Text>
                </View>
                <View style={[styles.statBox, styles.absentBox]}>
                    <Text style={styles.statNumber}>Absent: {absentStudents}</Text>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by ARID or Name"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#666"
                />
            </View>

            <FlatList
                data={filteredStudents}
                keyExtractor={(item) => item.reg_no}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleStudentPress(item)}>
                        <View style={styles.studentItem}>
                            <View style={[
                                styles.attendanceIndicator,
                                { backgroundColor: item.att_status === 'P' ? '#4CAF50' : '#F44336' }
                            ]}>
                                <Text style={styles.attendanceMarker}>
                                    {item.att_status === 'P' ? 'P' : 'A'}
                                </Text>
                            </View>
                            <View style={styles.studentInfo}>
                                <Text style={styles.studentName}>{item.name}</Text>
                                <Text style={styles.studentRegNo}>Reg No: {item.reg_no}</Text>
                            </View>
                            <Text style={[
                                styles.attendanceStatus,
                                item.att_status === 'P' ? styles.presentText : styles.absentText
                            ]}>
                                {item.att_status === 'P' ? 'Present' : 'Absent'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedStudent && (
                            <View style={styles.modalBody}>
                                <Text style={styles.presenceTitle}>Class Presence:</Text>
                                <Text style={[
                                    styles.presencePercentage,
                                    { color: selectedStudent.present_count > 0 ? '#4CAF50' : '#666' }
                                ]}>
                                    {calculateAttendancePercentage(selectedStudent)}%
                                </Text>

                                <TouchableOpacity
                                              style={[
                                                      styles.actionButton,
                                                                  { backgroundColor: selectedStudent.att_status === 'P' ? '#FF4444' : '#4CAF50' }
                                                                                                             ]}
                                                                 onPress={() => handleAttendanceUpdate(selectedStudent)} // Use handleAttendanceUpdate here
                                                                                                     >
                                                                           <Text style={styles.actionButtonText}>
                                                                              {selectedStudent.att_status === 'P' ? 'Mark as Absent' : 'Mark as Present'}
                                                                                  </Text>
                                                                                   </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.viewImagesButton}
                                    onPress={() => {
                                        navigation.navigate("Teacher_Attendance_Images",{student_id:selectedStudent.reg_no, held_id:held_id});
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.viewImagesText}>View Attendance Images</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: 'white',
        padding: 10,
        marginTop: 10,
        marginLeft: 20
    },
    dateText: {
        fontSize: 16,
        color: 'black',
        marginBottom: 4,
        fontWeight: 'bold'
    },
    timeText: {
        fontSize: 16,
        color: 'black',
        marginBottom: 4,
        fontWeight: 'bold'
    },
    venueText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold'
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'space-between',
    },
    statBox: {
        flex: 1,
        padding: 10,
        borderRadius: 25,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    totalBox: {
        backgroundColor: '#2196F3',
    },
    presentBox: {
        backgroundColor: '#4CAF50',
    },
    absentBox: {
        backgroundColor: '#F44336',
    },
    statNumber: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    searchContainer: {
        padding: 16,
        backgroundColor: 'white',
    },
    searchInput: {
        height: 40,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    studentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginVertical: 4,
        padding: 16,
        borderRadius: 8,
    },
    attendanceIndicator: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    attendanceMarker: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    studentRegNo: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    attendanceStatus: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    presentText: {
        color: '#4CAF50',
    },
    absentText: {
        color: '#F44336',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        width: '80%',
        padding: 20,
    },
    modalBody: {
        alignItems: 'center',
    },
    presenceTitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    presencePercentage: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    actionButton: {
        width: '100%',
        padding: 12,
        borderRadius: 25,
        marginBottom: 10,
    },
    actionButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    viewImagesButton: {
        width: '100%',
        padding: 12,
        marginBottom: 10,
    },
    viewImagesText: {
        color: '#2196F3',
        textAlign: 'center',
        fontSize: 16,
    },
    cancelButton: {
        width: '100%',
        padding: 12,
    },
    cancelButtonText: {
        color: '#FF4444',
        textAlign: 'center',
        fontSize: 16,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 16,
    },
});

export default Teacher_Held_Classes_Detail;