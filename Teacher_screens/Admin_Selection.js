import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Admin_Selection = ({ navigation, route }) => {
    const { section_name,cource_code } = route.params;
 

    const attendanceOptions = [
        {
            id: 1,
            title: "Overall Subject Attendance",
            description: "Get a view of students overall attendance in the subject.",
            icon: "📚", // Placeholder emoji icon
            onPress: () => navigation.navigate('Overall_Attendance',{ cource_code: cource_code,section_name: section_name})
        },
        {
            id: 2,
            title: "Show Class Attendance",
            description: "View attendance records for each specific class session.",
            icon: "👨‍🏫", // Placeholder emoji icon
            onPress: () => navigation.navigate('Teacher_Held_Classes', { section_name: section_name,cource_code: cource_code,type:'SUPERVISED' })
        },
       /*  {
            id: 3,
            title: "Jr.Lecturer Attendance",
            description: "View attendance records for each specific class session.",
            icon: "📖", // Placeholder emoji icon
            onPress: () => navigation.navigate('Teacher_Held_Classes', { section_name: section_name,cource_code: cource_code,type:'UNSUPERVISED' })
        },
       {
            id: 4,
            title: "Download Attendance Sheet",
            description: "Download Attendance Sheet Of Your Class.",
            icon: "📥", // Placeholder emoji icon
            onPress: () => {navigation.navigate('Teacher_Attendance_Sheet', { section_name: section_name,cource_code: cource_code,type:'UNSUPERVISED' })}
        }*/
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Select an attendance option</Text>
            <View style={styles.optionsContainer}>
                {attendanceOptions.map((option) => (
                    <TouchableOpacity key={option.id} style={styles.optionCard} onPress={option.onPress}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>{option.icon}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.optionTitle}>{option.title}</Text>
                            <Text style={styles.optionDescription}>{option.description}</Text>
                        </View>
                        <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
        marginTop: 10,
    },
    optionsContainer: {
        gap: 16,
    },
    optionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0FFF4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 20,
    },
    textContainer: {
        flex: 1,
        paddingRight: 10,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    arrow: {
        fontSize: 24,
        color: '#666',
    },
});

export default Admin_Selection;
