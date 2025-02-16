import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { callurl } from "../apifile";

const Admin_Behaviour = ({ route }) => {
  const { held_id } = route.params;
  const [behaviorData, setBehaviorData] = useState(null);
  const [activeView, setActiveView] = useState("graph");
  const [selectedMinute, setSelectedMinute] = useState(1);
  const [showInput, setShowInput] = useState(false);
  const [inputMinute, setInputMinute] = useState("");

  useEffect(() => {
    fetchBehaviorData();
  }, []);

  const fetchBehaviorData = async () => {
    try {
      const response = await fetch(
        `${callurl}admin/behavior/class-overview?held_id=${held_id}`
      );
      const jsonResponse = await response.json();

      if (jsonResponse.status === "success") {
        setBehaviorData(jsonResponse.data);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleMinuteInput = () => {
    const minute = parseInt(inputMinute);
    if (minute && minute > 0 && minute <= (behaviorData?.minute_trends?.length || 0)) {
      setSelectedMinute(minute);
      setShowInput(false);
      setInputMinute("");
    }
  };

  const renderSummaryCards = () => (
    <View style={styles.summaryCards}>
      <View style={[styles.card, styles.engagementCard]}>
        <View style={styles.cardIconContainer}>
          <Image
            source={require("../assets/engagement.png")}
            style={styles.cardIcon}
          />
        </View>
        <Text style={styles.cardTitle}>Engagement</Text>
        <Text style={styles.cardValue}>
          {behaviorData?.overall_engagement.toFixed(1)}%
        </Text>
      </View>
      <View style={[styles.card, styles.sleepingCard]}>
        <View style={styles.cardIconContainer}>
          <Image
            source={require("../assets/sleeping.png")}
            style={styles.cardIcon}
          />
        </View>
        <Text style={styles.cardTitle}>Avg Sleeping</Text>
        <Text style={styles.cardValue}>
          {behaviorData?.avg_sleeping_per_minute.toFixed(1)}%
        </Text>
      </View>
    </View>
  );

  const renderMinuteSelector = () => (
    <View style={styles.minuteSelectorContainer}>
      <View style={styles.minuteHeader}>
        <Text style={styles.minuteSelectorTitle}>Timeline Analysis</Text>
        <TouchableOpacity
          style={styles.inputToggle}
          onPress={() => setShowInput(!showInput)}
        >
          <Text style={styles.inputToggleText}>
            {showInput ? "Hide" : "Jump to Minute"}
          </Text>
        </TouchableOpacity>
      </View>

      {showInput ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.minuteInput}
            value={inputMinute}
            onChangeText={setInputMinute}
            keyboardType="number-pad"
            placeholder="Enter minute"
            maxLength={3}
          />
          <TouchableOpacity style={styles.inputButton} onPress={handleMinuteInput}>
            <Text style={styles.inputButtonText}>Go</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          horizontal
          data={behaviorData?.minute_trends || []}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedMinute(item.minute_number)}
              style={[
                styles.minuteButton,
                selectedMinute === item.minute_number && styles.selectedMinuteButton,
              ]}
            >
              <Text
                style={[
                  styles.minuteButtonText,
                  selectedMinute === item.minute_number && styles.selectedMinuteText,
                ]}
              >
                {item.minute_number}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.minute_number.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.minuteList}
        />
      )}
    </View>
  );

  const renderGraphView = () => {
    if (!behaviorData) return null;

    const minuteData = behaviorData.minute_trends.find(
      (item) => item.minute_number === selectedMinute
    );

    const chartData = {
      labels: ["Attentive", "Sleeping", "Raising Hand"],
      datasets: [
        {
          data: [
            minuteData.behavior_breakdown.Attentive,
            minuteData.behavior_breakdown.Sleeping,
            minuteData.behavior_breakdown["Raising Hand"],
          ],
        },
      ],
    };

    return (
      <View style={styles.graphContainer}>
        <View style={styles.graphHeader}>
          <Text style={styles.sectionTitle}>Behavior Distribution</Text>
          <View style={styles.minuteBadge}>
            <Text style={styles.minuteBadgeText}>Minute {selectedMinute}</Text>
          </View>
        </View>
        <BarChart
          data={chartData}
          width={Dimensions.get("window").width - 60}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#e9e8ff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(211, 1, 28, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(13, 3, 27, ${opacity})`,
            barPercentage: 0.7,
            propsForLabels: {
              fontSize: 12,
              fontWeight: "bold",
            },
          }}
          style={styles.chart}
        />
      </View>
    );
  };

  const renderStudentView = () => {
    const filteredStudents = behaviorData?.person_data.filter(
      (student) => student.minute_number === selectedMinute
    );

    return (
      <View style={styles.studentsContainer}>
        <View style={styles.studentsHeader}>
          <Text style={styles.sectionTitle}>Student Insights</Text>
          <View style={styles.minuteBadge}>
            <Text style={styles.minuteBadgeText}>Minute {selectedMinute}</Text>
          </View>
        </View>
        <FlatList
          data={filteredStudents}
          renderItem={({ item }) => (
            <View style={styles.studentCard}>
              <View style={styles.studentAvatarContainer}>
                <Image
                  source={require("../assets/profile.png")}
                  style={styles.profileIcon}
                />
              </View>
              <View style={styles.studentInfo}>
                <Text style={styles.studentId}>{item.student_id}</Text>
                <View style={styles.behaviorBadge}>
                  <Text style={styles.behaviorText}>{item.dominant_behavior}</Text>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.student_id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  if (!behaviorData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading behavior data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderSummaryCards()}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, activeView === "graph" && styles.activeToggleButton]}
          onPress={() => setActiveView("graph")}
        >
          <Text style={[styles.toggleButtonText, activeView === "graph" && styles.activeToggleText]}>
            Graph Analysis
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, activeView === "students" && styles.activeToggleButton]}
          onPress={() => setActiveView("students")}
        >
          <Text style={[styles.toggleButtonText, activeView === "students" && styles.activeToggleText]}>
            Students Overview
          </Text>
        </TouchableOpacity>
      </View>
      {renderMinuteSelector()}
      {activeView === "graph" ? renderGraphView() : renderStudentView()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6366f1",
    fontWeight: "500",
  },
  summaryCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  engagementCard: {
    backgroundColor: "#dbeafe",
  },
  sleepingCard: {
    backgroundColor: "#fae8ff",
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cardIcon: {
    width: 24,
    height: 24,
  },
  cardTitle: {
    fontSize: 14,
    color: "#1f2937",
    marginBottom: 4,
    fontWeight: "500",
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    padding: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  activeToggleButton: {
    backgroundColor: "#6366f1",
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  activeToggleText: {
    color: "#ffffff",
  },
  minuteSelectorContainer: {
    marginBottom: 20,
  },
  minuteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  minuteSelectorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  inputToggle: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  inputToggleText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  minuteInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 24,
    paddingHorizontal: 20,
    marginRight: 12,
    backgroundColor: "#ffffff",
    fontSize: 16,
  },
  inputButton: {
    backgroundColor: "#6366f1",
    height: 48,
    width: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  inputButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  minuteList: {
    paddingVertical: 8,
  },
  minuteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    minWidth: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedMinuteButton: {
    backgroundColor: "#6366f1",
  },
  minuteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  selectedMinuteText: {
    color: "#ffffff",
  },
  graphContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  graphHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  studentsContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
  },
  studentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  minuteBadge: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  minuteBadgeText: {
    color: "#4338ca",
    fontSize: 14,
    fontWeight: "600",
  },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  studentAvatarContainer: {
    marginRight: 12,    
    marginBottom: 10,
},
studentsHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
},

profileIcon: {
  width: 30,
  height: 30,
},
studentInfo: {
  marginLeft: 12,
  flex: 1,
},
studentId: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#1f2937",
},
behaviorBadge: {
  marginTop: 4,
  backgroundColor: "#6366f1",
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 8,
  alignSelf: "flex-start",
},
behaviorText: {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "bold",
},
});

export default Admin_Behaviour;
