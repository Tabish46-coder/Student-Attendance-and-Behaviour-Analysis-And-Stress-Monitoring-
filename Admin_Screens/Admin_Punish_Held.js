import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { callurl } from "../apifile";

const { width } = Dimensions.get("window");

function Admin_Punish_Held({ navigation, route }) {
  const { sections,course_id } = route.params;
  const [loading, setLoading] = useState(false);
  const [heldclasses, setHeldclasses] = useState([]);

  const piechart = (held) => {
    navigation.navigate("EmotionalAnalysis", { heldid: held });
  };

  const Behaviour = (id) => {
    navigation.navigate("Admin_Behaviour", { held_id: id });
  };

  const fetchHeldClasses = async () => {
    try {
      setLoading(true);
      const apiUrl = `${callurl}admin/fetchHeldClasses?section_name=${sections}&course_id=${course_id}&check=ALL`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch held classes");
      }

      const data = await response.json();
      console.log(data)
      setHeldclasses(data);
    } catch (error) {
      console.error("Error fetching held classes:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sections) {
      fetchHeldClasses();
    }
  }, [sections]);

  const renderHeldClasses = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading classes...</Text>
        </View>
      );
    }

    if (heldclasses.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../assets/held.png")}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>No classes found</Text>
          <Text style={styles.emptySubtext}>
            Classes will appear here once they are held
          </Text>
        </View>
      );
    }

    return heldclasses.map((classItem, index) => (
      <View style={styles.classContainer} key={index}>
        <View style={styles.classCard}>
          <View style={styles.headerContainer}>
            <View style={styles.dayContainer}>
              <Text style={styles.dayText}>{classItem.slot_day}</Text>
              <Text style={styles.dateText}>{classItem.class_date}</Text>
            </View>
            <View style={styles.badgeContainer}>
              <Text style={styles.semesterBadge}>Semester {classItem.semester_no}</Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.locationContainer}>
              <Image
                source={require("../assets/lecture.png")}
                style={styles.locationIcon}
              />
              <Text style={styles.venueText}>{classItem.venue}</Text>
            </View>
            <View style={styles.locationContainer}>
              <Text style={styles.venueText}>Class Type: {classItem.type}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {classItem.slot_starttime} - {classItem.slot_endtime}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => piechart(classItem.held_id)}
              style={[styles.button, styles.emotionButton]}
            >
              <Image
                source={require("../assets/emotion.png")}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Emotions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Behaviour(classItem.held_id)}
              style={[styles.button, styles.behaviourButton]}
            >
              <Image
                source={require("../assets/behaviour.png")}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Behaviour</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        {renderHeldClasses()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollView: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6366f1",
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyImage: {
    width: 120,
    height: 120,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
  },
  classContainer: {
    marginBottom: 16,
  },
  classCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dayContainer: {
    flex: 1,
  },
  dayText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  dateText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  badgeContainer: {
    backgroundColor: "#818cf8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  semesterBadge: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  infoContainer: {
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  venueText: {
    fontSize: 14,
    color: "#4b5563",
  },
  timeContainer: {
    backgroundColor: "#e0e7ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  timeText: {
    color: "#4338ca",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    flex: 0.48,
  },
  emotionButton: {
    backgroundColor: "#10b981",
  },
  behaviourButton: {
    backgroundColor: "#f97316",
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default Admin_Punish_Held;