import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { callurl } from '../apifile';
const Junior_Allocations = ({navigation,route}) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const{user}=route.params;

  const fetchAssignments = async () => {
    try {
      const response = await fetch(
        `${callurl}jr-lecturer/assignments?jr_emp_no=${user}&sems_no=2024FM`
      );
      const json = await response.json();
      
      if (json.status === 'success') {
        setAssignments(json.data);
        setError(null);
      } else {
        setError(json.message);
      }
    } catch (err) {
      setError('Failed to fetch assignments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAssignments();
  };

  const renderAssignmentCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.courseHeader}>
        <Text style={styles.courseCode}>{item.CourseCode}</Text>
        <Text style={styles.creditHours}>{item.Credit_hrs}</Text>
      </View>
      
      <Text style={styles.courseDesc}>{item.Course_desc}</Text>
      
      <View style={styles.divider} />
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>Section:</Text>
        <Text style={styles.value}>{item.Section}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>Senior Lecturer:</Text>
        <Text style={styles.value}>{item.Sr_FullName}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>Semester:</Text>
        <Text style={styles.value}>{item.SemesterNo}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAssignments}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={assignments}
        renderItem={renderAssignmentCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  creditHours: {
    fontSize: 16,
    color: '#666',
  },
  courseDesc: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: 120,
    fontSize: 14,
    color: '#666',
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Junior_Allocations;