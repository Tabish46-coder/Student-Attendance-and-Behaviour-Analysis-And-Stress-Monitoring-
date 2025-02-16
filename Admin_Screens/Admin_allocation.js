import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { callurl } from "../apifile";

const Admin_allocation = ({ navigation, route }) => {
    const { empNo, empName } = route.params;
    const [loading, setLoading] = useState(false);
    const [allocations, setAllocations] = useState({});

   

    const emotions = (id,course) => {
        navigation.navigate('Admin_Emotions', { sections: id,course_id:course });
    };

    const fetchTeacherAllocations = async () => {
        const semsNo = '2024FM';
        try {
            setLoading(true);
            const apiUrl = `${callurl}allocated?emp_no=${empNo}&sems_no=${semsNo}`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Failed to fetch data. Status: ${response.status}`);
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setAllocations(data.allocations);
        } catch (error) {
            console.error("Error fetching allocations:", error);
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeacherAllocations();
    }, []);

    const renderAllocations = () => {
        const courseData = Object.keys(allocations).map((course) => {
            const [courseCode, courseName, creditHours] = course.split(',');
            return { course, courseCode, courseName, creditHours, sections: allocations[course] };
        });
    
        return courseData.length ? (
            <FlatList
                data={courseData}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.courseTitle}>{item.courseCode} - {item.courseName}</Text>
                        <Text style={styles.creditHours}>Credit Hours: {item.creditHours}</Text>
                        <FlatList
                            data={item.sections}
                            renderItem={({ item: section }) => (
                                <TouchableOpacity onPress={() => emotions(section, item.courseCode)}>
                                    <View style={styles.sectionButton}>
                                        <Text style={styles.sectionText}>Section {section}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(section, index) => index.toString()}
                        />
                    </View>
                )}
                keyExtractor={(item) => item.course}
            />
        ) : (
            <Text style={styles.noDataText}>No allocations found.</Text>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../assets/profile.png')} style={styles.profileImage} />
                <View>
                    <Text style={styles.empNo}>{empNo}</Text>
                    <Text style={styles.empName}>{empName}</Text>
                </View>
             
            </View>
            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator size="large" color="#4CAF50" />
                ) : (
                    renderAllocations()
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#4CAF50', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 5 },
    profileImage: { width: 60, height: 60, borderRadius: 30 },
    empNo: { color: 'white', fontSize: 14, fontWeight: 'bold' },
    empName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    content: { flex: 1, margin: 15 },
    card: { backgroundColor: "#FFFFFF", padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 } },
    courseTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
    creditHours: { fontSize: 14, color: "#777", marginBottom: 10 },
    sectionButton: { backgroundColor: '#90EE90', padding: 10, borderRadius: 10, alignItems: 'center', marginVertical: 5, elevation: 2 },
    sectionText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    noDataText: { textAlign: 'center', fontSize: 16, color: '#777', marginTop: 20 },
});

export default Admin_allocation;
