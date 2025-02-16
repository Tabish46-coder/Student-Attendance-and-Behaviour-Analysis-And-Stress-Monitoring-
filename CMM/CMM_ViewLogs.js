import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Switch
} from 'react-native';
import { callurl } from '../apifile';

function CMM_ViewLogs({navigation, route}) {
  const {
    punishid,
    datesstart,
    dateend,
    studentname,
    studnetid,
    studnetsetion
  } = route.params;
  
  const [logsData, setLogsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMinutes, setShowMinutes] = useState(false);

  const fetchLogs = async () => {
    try {
      const url = `${callurl}punishments/student_logs?punishment_id=${punishid}&student_id=${studnetid}&record_date=${datesstart}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setLogsData(data);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch logs');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [punishid, studnetid, datesstart]);

  const formatTime = (seconds) => {
    if (showMinutes) {
      const minutes = (seconds / 60).toFixed(1);
      return `${minutes} min`;
    } else {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Image source={require("../assets/people.png")} style={styles.icon} />
            <Text style={styles.infoText}>{studnetid}</Text>
          </View>

          <View style={styles.infoRow}>
            <Image source={require("../assets/folder.png")} style={styles.icon} />
            <Text style={styles.infoText}>{studentname}</Text>
          </View>

          <View style={styles.infoRow}>
            <Image source={require("../assets/sections.png")} style={styles.icon} />
            <Text style={styles.infoText}>{studnetsetion}</Text>
          </View>

          <View style={styles.infoRow}>
            <Image source={require("../assets/calendar.png")} style={styles.icon} />
            <Text style={styles.infoText}>{datesstart} to {dateend}</Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : logsData ? (
            <>
              <View style={styles.headerSection}>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryText}>
                    Total Duration: {formatTime(logsData.duration)}
                  </Text>
                </View>
                
                <View style={styles.toggleContainer}>
                  <Text style={styles.toggleLabel}>Show in minutes</Text>
                  <Switch
                    value={showMinutes}
                    onValueChange={setShowMinutes}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={showMinutes ? '#2196F3' : '#f4f3f4'}
                  />
                </View>
              </View>

              <ScrollView horizontal>
                <View>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.headerCell, { width: 50 }]}>No.</Text>
                    <Text style={[styles.headerCell, { width: 100 }]}>Start</Text>
                    <Text style={[styles.headerCell, { width: 100 }]}>End</Text>
                    <Text style={[styles.headerCell, { width: 100 }]}>Duration</Text>
                    <Text style={[styles.headerCell, { width: 100 }]}>Status</Text>
                    <Text style={[styles.headerCell, { width: 150 }]}>Updated</Text>
                  </View>

                  <View>
                    {logsData.logs.map((log, index) => (
                      <View 
                        key={log.log_id} 
                        style={[
                          styles.tableRow,
                          { backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }
                        ]}
                      >
                        <Text style={[styles.cell, { width: 50 }]}>{index + 1}</Text>
                        <Text style={[styles.cell, { width: 100 }]}>{formatTime(log.start_time)}</Text>
                        <Text style={[styles.cell, { width: 100 }]}>{formatTime(log.end_time)}</Text>
                        <Text style={[styles.cell, { width: 100 }]}>{formatTime(log.duration)}</Text>
                        <Text style={[styles.cell, { width: 100 }, 
                          { color: log.status === 'Present' ? 'green' : 'red' }]}>
                          {log.status}
                        </Text>
                        <Text style={[styles.cell, { width: 150 }]}>{log.updated_at}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>
            </>
          ) : (
            <View style={styles.errorContainer}>
              <Text>No logs available for this date</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  icon: {
    width: 30,
    height: 30,
  },
  infoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 20,
  },
  tableContainer: {
    padding: 16,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#E7EAF3',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7EAF3',
    padding: 10,
    borderRadius: 8,
  },
  toggleLabel: {
    marginRight: 10,
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '500',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E7EAF3',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingVertical: 12,
  },
  headerCell: {
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  cell: {
    padding: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default CMM_ViewLogs;