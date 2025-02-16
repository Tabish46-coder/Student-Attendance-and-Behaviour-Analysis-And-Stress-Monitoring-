import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { callurl } from '../apifile';

const Give_Feedback = ({navigation, route }) => {
    const { Section,course,student,role } = route.params;
    const type='All'
    const [heldClasses, setHeldClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHeldClasses = async () => {
            try {
                const response = await fetch(`${callurl}admin/fetchHeldClasses?section_name=${Section}&course_id=${course}&check=${type}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data)
                setHeldClasses(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHeldClasses();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.errorText}>Error: {error}</Text>;
    }

    const gotoheldclassesdetails=(heldids)=>{
     console.log(student)
            navigation.navigate("ADD_FEEDBACK",{held_id:heldids,userid:student,roles:role})
      
        
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Held Classes for {Section}</Text>
            <FlatList
                data={heldClasses}
                keyExtractor={(item) => item.held_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.classItem}>
                        <Text style={styles.dateText}>Date: {item.class_date}</Text>
                        <Text style={styles.timeText}>Time: {item.slot_starttime} - {item.slot_endtime}</Text>
                        <Text style={styles.venueText}>Venue: {item.venue}</Text>
                        <Text style={styles.venueText}>Type: {item.type}</Text>
                        <View style={{backgroundColor:"#1C791D",padding:5,alignItems:'center',borderRadius:10,marginTop:15,borderColor:'white',borderWidth:2}}>
                            <TouchableOpacity onPress={()=>{gotoheldclassesdetails(item.held_id)}}>
                            <Text style={styles.viewAttendanceText}>View Attendance</Text>
                            </TouchableOpacity>
                        
                        </View>
                        
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color:'black'
    },
    classItem: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#C0F3BF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color:'black'
    },
    timeText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
        color:'black'
    },
    venueText: {
        fontSize: 14,
        color: 'black',
        marginBottom: 8,
        
    },
    viewAttendanceText: {
        fontSize: 14,
        color: 'white',
        fontWeight:'bold'
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 16,
    },
});

export default Give_Feedback;