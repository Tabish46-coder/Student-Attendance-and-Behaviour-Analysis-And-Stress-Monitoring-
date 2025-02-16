import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  Platform 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { callurl } from '../apifile';

const Admin_Punish_Students = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [punishedStudents, setPunishedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPunishedStudents = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const formattedDate = date.toISOString().split('T')[0];
      console.log('Fetching data for date:', formattedDate);
      
      const response = await fetch(
        `${callurl}/punishment/last-row/punished-students?selected_date=${formattedDate}`
      );
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.status === 'success' && Array.isArray(data.data)) {
        setPunishedStudents(data.data);
      } else {
        setError(data.message || 'Invalid data format received');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPunishedStudents(selectedDate);
  }, [selectedDate]);

  const onDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const gotologs=()=>{
    navigation.navigate('Admin_Punishment_Logs',{studentid:'2022-ARID-4145',heldid:1045})
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      key={item.punishment_id}
      style={styles.card}
      onPress={() =>gotologs()}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="person-circle-outline" size={40} color="#1e293b" />
        <View style={styles.headerText}>
          <Text style={styles.studentId}>ID: {item.student_id}</Text>
        </View>
      </View>
      <View style={styles.violationContainer}>
        <Ionicons name="warning-outline" size={20} color="#dc2626" />
        <Text style={styles.violationDescription}>{item.violation_description}</Text>
      </View>
      <View style={styles.typeContainer}>
        <Ionicons name="list-outline" size={20} color="#16a34a" />
        <Text style={styles.violationType}>{item.violation_type} ({item.role})</Text>
      </View>
      <View style={styles.dateRangeContainer}>
        <Text style={styles.dateRangeText}>{`${formatDate(item.start_date)} → ${formatDate(item.end_date)}`}</Text>
        <Text style={styles.reportedText}>Reported by: {item.reported_by}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.dateSelector}>
          <Ionicons name="calendar-outline" size={22} color="#16a34a" />
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{selectedDate.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
          />
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#16a34a" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={punishedStudents}
            keyExtractor={(item) => item.punishment_id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.noDataText}>No punished students found for this date.</Text>}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#16a34a',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 16,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },
  dateButton: {
    marginLeft: 10,
  },
  dateButtonText: {
    color: '#16a34a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
    padding: 16,
  },
  noDataText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 20,
    fontSize: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  violationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  violationDescription: {
    marginLeft: 8,
    color: '#374151',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  violationType: {
    marginLeft: 8,
    color: '#10b981',
  },
  dateRangeContainer: {
    marginTop: 8,
  },
  dateRangeText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reportedText: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  }
});

export default Admin_Punish_Students;
