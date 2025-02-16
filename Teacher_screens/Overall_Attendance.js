import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet,Switch } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { callurl } from "../apifile";

const Overall_Attendance = ({navigation,route}) => {
    const {cource_code,section_name}=route.params
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEnabled, setIsEnabled] = useState(false);
    const [merge, setmerge]=useState('NO')
    const [classs,setclasss]=useState(0)
    const [students,setstudents]=useState(0)
    const toggleSwitch = () => {setIsEnabled(previousState => !previousState)
        if (merge=='NO'){
            setmerge('YES')
        }
        else {
            setmerge('NO')
        }
    
    }
    const fetchData = async () => {
        try {
            const response = await fetch(`${callurl}teacher/per-subj/students-attendance?course_id=${cource_code}&merged=${merge}&section_name=${section_name}&semester_no=2024FM`);
            const json = await response.json();
            console.log(json)
            if (json.status === "success") {
                setclasss(json.data[0].total_classes_held)
                const list_count = json.data.length;
                setstudents(list_count);
                setData(json.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isEnabled,merge,classs]);

    // Function to render each student row
    const renderItem = ({ item }) => {
        return (
            <View style={[
                styles.card,
                { backgroundColor: item.total_present > item.total_absent ? "#98ff90" : "#ff96a4" }
            ]}>
                <Ionicons name="person-circle" size={40} color="#fff" style={styles.icon} />
                <View style={styles.infoContainer}>
                    <Text style={styles.studentId}>{item.student_id}</Text>
                    <Text style={styles.details}>
                        <Text style={styles.present}>🟢 Present: {item.total_present} </Text>
                        <Text style={styles.absent}>🔴 Absent: {item.total_absent}</Text>
                    </Text>
                </View>
                <Text style={styles.percentage}>{item.overall_percentage}%</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.headerText}>📚 Total Classes: {classs}</Text>
                <Text style={styles.headerText}>👥 Students: {students}</Text>
            </View>
            <Text style={styles.alertText}>⚠️ Below 75%: {data.filter(s => s.overall_percentage < 75).length}</Text>
             <View style={{flexDirection:'row',alignItems:'center',marginBottom:30,borderColor:'black',borderWidth:1,borderRadius:10,padding:10,}}>

                <Text style={{color:'black',fontSize:16,fontWeight:'bold'}}>Merge With Unsupervised</Text>
                <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
        style={{marginLeft:130}}
      />
             </View>
            {/* Loader */}
            {loading ? <ActivityIndicator size="large" color="blue" /> : null}

            {/* Attendance List */}
            <FlatList
                data={data}
                keyExtractor={(item) => item.student_id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },
    headerText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    alertText: {
        color: "red",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },
    icon: {
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
    },
    studentId: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    details: {
        flexDirection: "row",
        marginTop: 5,
    },
    present: {
        color: "green",
        marginRight: 10,
    },
    absent: {
        color: "red",
    },
    percentage: {
        fontSize: 16,
        fontWeight: "bold",
        color: "red",
    },
});
export default Overall_Attendance;