import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { Text } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons
import { callurl } from "../apifile";


function Admin_Teachers({ navigation }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch(
        `${callurl}teachers?semes_no=2024SM`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const fetchedData = await response.json();

      if (fetchedData.length > 0) {
        setData(fetchedData);
        setFilteredData(fetchedData); // Initialize filtered data with the full list
      } else {
        throw new Error("No data received");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text === "") {
      setFilteredData(data); // Reset to full list when search is cleared
    } else {
      const filtered = data.filter((item) =>
        item.Name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.teachersTile}>{item.Emp_no} - {item.Status}</Text>
        <Text style={styles.courseDesc}>{item.Name}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            navigation.navigate("Admin_allocation", {
              empNo: item.Emp_no,
              empName: item.Name,
            })
          }
        >
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.searchContainer}>
                <Ionicons
                  name="search"
                  size={20}
                  color="#000"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  placeholderTextColor={"black"}
                  value={search}
                  onChangeText={handleSearch}
                />
              </View>
            </View>
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.Emp_no}
          // ListHeaderComponent={
            
          // }
          ListFooterComponent={<View style={{ paddingBottom: 100 }} />}
          ListEmptyComponent={
            !loading && <Text style={{ textAlign: "center" }}>No data found</Text>
          }
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled" // Prevents FlatList from blocking touches
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginHorizontal: 18,
    marginTop: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    width: 360,
  },
  searchIcon: {
    position: "absolute",
    left: 10,
    zIndex: 1,
  },
  searchInput: {
    height: 50,
    flex: 1,
    borderColor: "#acb0b4",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 35,
    color: "black",
    backgroundColor: "white",
    elevation: 5,
  },
  teachersTile:{
    color : "#686d72",
    fontSize: 12,
  },
  dropdownWrapper: {
    zIndex: 10,
    elevation: 10,
    width: 150,
  },
  card: {
    backgroundColor: "#e5e6e8",
    padding: 20,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 18,
    elevation: 3,
    alignItems: "center",
    flexDirection: "row",
  },
  courseDesc: {
    fontSize: 16,
    fontWeight: "bold",
    width: 220,
  },
  buttonContainer: {
    marginTop: 5,
  },
  viewButton: {
    backgroundColor: "#078345",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Admin_Teachers;
