import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { callurl } from "../apifile";
import Icon from "react-native-vector-icons/MaterialIcons"; // Make sure to install this package

function CMM_Voilations_expand({ navigation, route }) {
  const { voilationid, voilationtype, voilationdesc, voilationdate, voilationby } =
    route.params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDateOnly = (dateTimeString) => {
    return dateTimeString.split(" ")[0];
  };

  const formattedDate = formatDateOnly(voilationdate);

  const fetchViolationStudents = async () => {
    const semesterNo = "2024SM"; // Replace with dynamic value if needed
    const apiUrl = `${callurl}violations/students?violation_id=${voilationid}&semester_no=${semesterNo}`;

    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        setData(result.punishments_students);
      } else {
        Alert.alert("Error", result.error || "Failed to fetch data");
      }
    } catch (error) {
      Alert.alert("Error", "Could not fetch data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolationStudents();
  }, []);

  const viewlogs = (ids, startdate, enddate, fullnames, studentids, sections) => {
    navigation.navigate("CMM_ViewLogs", {
      punishid: ids,
      datesstart: startdate,
      dateend: enddate,
      studentname: fullnames,
      studnetid: studentids,
      studnetsetion: sections,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        viewlogs(
          item.punishment_id,
          item.start_date,
          item.end_date,
          item.FullName,
          item.student_id,
          item.Section
        )
      }
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon
            name={item.status ? "check-circle" : "cancel"}
            size={20}
            color={item.status ? "#4CAF50" : "#F44336"}
          />
          <Text style={styles.statusText}>
            {item.status ? "Active" : "Inactive"}
          </Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.durationText}>
            Duration: {item.start_date} - {item.end_date}
          </Text>
          <Text style={styles.studentName}>{item.FullName} S/O {item.Father_name}</Text>
          <Text style={styles.roleText}>Role: {item.role}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>
              Punishment Room: {item.punishment_room ? "Yes" : "No"}
            </Text>
            <Text style={styles.detailText}>
              Last Row: {item.last_row ? "Yes" : "No"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
  
      <View style={styles.violationDetails}>
        <Text style={styles.violationType}>{voilationtype}</Text>
        <View style={styles.detailRow}>
          <Icon name="description" size={20} color="#555" />
          <Text style={styles.detailText}>{voilationdesc}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="person" size={20} color="#555" />
          <Text style={styles.detailText}>Reported by: {voilationby}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="calendar-today" size={20} color="#555" />
          <Text style={styles.detailText}>Date: {formattedDate}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Punished Students</Text>

      <View style={styles.listContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.punishment_id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#6200EE",
    padding: 20,
    alignItems: "center",
  },
  
  violationDetails: {
    backgroundColor: "#C2F0D1",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  violationType: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  detailText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 16,
    marginTop: 20,
  },
  listContainer: {
    flex: 1,
    margin: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#C2F0D1",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
  },
  cardBody: {
    padding: 16,
  },
  durationText: {
    fontSize: 12,
    color: "#777",
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  roleText: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
});

export default CMM_Voilations_expand;