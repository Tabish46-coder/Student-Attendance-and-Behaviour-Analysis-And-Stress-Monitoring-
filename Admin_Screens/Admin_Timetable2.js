import React from "react";
import { 
    SafeAreaView, 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    Dimensions, 
    TouchableOpacity
} from "react-native";

function Admin_Timetable2({navigation, route}) {
    const {classes} = route.params;


    const gotovideupload=(id,sections,cources, Employes, semesters,versions,names,courcedescs,sectionnames,venues)=>{
        console.log("ya wala section hai "+sectionnames)
        navigation.navigate("Upload_Video_screen",{ids:id,section:sections,cource:cources,Employe:Employes,semester:semesters,version:versions,name:names,courcedesc:courcedescs,secname:sectionnames,venue:venues})
    }
    const renderClassItem = ({ item }) =>{ console.log("Item data:", item);
        return(
        
        <View style={styles.classCard}>
            <TouchableOpacity
      onPress={() =>
        gotovideupload(
          item.id, // id
          item.section_id, // sections
          item.course_id, // cources
          item.Emp_no, // Employes
          item.semester_no, // semesters
          item.version_id, // versions
          item.teacher, // names
          item.course_desc, // courcedescs
          item.section, // sectionnames (make sure it's item.section here)
          item.venue // venues
        )
      }
    >
            <View style={styles.cardContent}>
                <Text style={styles.courseTitle}>{item.course_desc}</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Section:</Text>
                    <Text style={styles.detailText}>{item.section}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Teacher:</Text>
                    <Text style={styles.detailText}>{item.teacher}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Venue:</Text>
                    <Text style={styles.detailText}>{item.venue}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Time:</Text>
                    <Text style={styles.detailText}>
                        {item.slot_starttime.slice(0,5)} - {item.slot_endtime.slice(0,5)}
                    </Text>
                </View>
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>Status: {item.status}</Text>
                </View>
            </View>
            </TouchableOpacity>
        </View>
    );}

    return(
        <SafeAreaView style={styles.container}>
        
            <FlatList
                data={classes}
                renderItem={renderClassItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainer: {
        backgroundColor: '#90EE90',
        padding: 15,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',

    },
    listContainer: {
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    classCard: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardContent: {
        padding: 15,
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444E60',
        marginBottom: 10,
        textAlign: 'center',
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    detailLabel: {
        fontWeight: 'bold',
        color: '#666',
        width: 100,
    },
    detailText: {
        flex: 1,
        color: 'black',
    },
    statusContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    statusText: {
        color: '#7531ff',
        fontWeight: 'bold',
    },
});

export default Admin_Timetable2;