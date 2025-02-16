import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { callurl } from '../apifile';
const Admin_Punishment_Logs = ({navigation,route}) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {studentid,heldid}=route.params
  console.log('ya id'+studentid)

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${callurl}punishment/last-row/logs?student_id=${studentid}&held_id=${heldid}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();
      
      if (result.status === 'success') {
        setLogs(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch punishment logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [studentid, heldid]);

  const renderLogItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.logCard}
      onPress={() => console.log('Log pressed:', item.last_row_log_id)}
    >
      <View style={styles.logHeader}>
        <Text style={styles.attendanceNo}>Attendance #{item.attendance_no}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.isFound ? '#FF6B6B' : '#4ECDC4' }
        ]}>
          <Text style={styles.statusText}>
            {item.isFound ? 'Found' : 'Not Found'}
          </Text>
        </View>
      </View>

      <View style={styles.logDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Row Number:</Text>
          <Text style={styles.value}>{item.rowNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>In Last Row:</Text>
          <Text style={styles.value}>
            {item.inLastRow ? 'Yes' : 'No'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchLogs}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Punishment Logs</Text>
      <FlatList
        data={logs}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.last_row_log_id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No punishment logs found</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    padding: 16,
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  attendanceNo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logDetails: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#636E72',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3436',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#636E72',
    marginTop: 24,
  },
});

export default Admin_Punishment_Logs;