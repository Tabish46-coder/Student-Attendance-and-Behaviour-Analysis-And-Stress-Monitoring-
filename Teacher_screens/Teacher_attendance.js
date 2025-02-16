import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { callurl } from "../apifile";

const Teacher_attendance = ({ navigation, route }) => {
    const { emp_no } = route.params;
    const [allocations, setAllocations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllocations = async () => {
            try {
                const response = await fetch(
                    `${callurl}allocated?emp_no=${emp_no}&sems_no=2024FM`
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                console.log(data);
                setAllocations(data.allocations);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllocations();
    }, [emp_no]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#357266" />
            </View>
        );
    }

    if (error) {
        return <Text style={styles.errorText}>Error: {error}</Text>;
    }

    const gotoheldclass = (sections,course_id) => {
        console.log(sections);
        navigation.navigate("Admin_Selection", {
            section_name: sections,
            cource_code: course_id,
        });
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>📚 Teacher's Allocations</Text>
    
        <FlatList
            data={Object.entries(allocations)}
            keyExtractor={(item) => item[0]}
            renderItem={({ item }) => {
                const course_id = item[0].split(",")[0]; // Extract "CS-692" from "CS-692,VISUAL PROGRAMMING,3(2-2)"
    
                return (
                    <View style={styles.allocationCard}>
                        {/* Course Title */}
                        <View style={styles.courseHeader}>
                            <Ionicons name="book-outline" size={20} color="white" />
                            <Text style={styles.courseText}>{item[0]}</Text>
                        </View>
    
                        {/* Sections List */}
                        <FlatList
                            data={item[1]} // List of sections like ["BIT-9A", "BCS-9A"]
                            keyExtractor={(section) => section}
                            renderItem={({ item: section }) => (
                                <TouchableOpacity
                                    style={styles.sectionButton}
                                    onPress={() => gotoheldclass(section, course_id)} // Pass section & course_id
                                >
                                    <Text style={styles.sectionText}>{section}</Text>
                                    <Ionicons
                                        name="arrow-forward-circle"
                                        size={22}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                );
            }}
        />
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#F3F8FF",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#2E2E2E",
        textAlign: "center",
    },
    allocationCard: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    courseHeader: {
        backgroundColor: "#1C791D",
        padding: 10,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    courseText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        marginLeft: 5,
    },
    sectionButton: {
        backgroundColor: "#54D454",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    sectionText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginTop: 16,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Teacher_attendance;
