import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, ActivityIndicator, Image } from 'react-native';
import { callurl } from '../apifile';
import DropDownPicker from 'react-native-dropdown-picker';

const Student_Claims = ({ navigation, route }) => {
  const { user } = route.params || {}; // Get user from route params

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  // Initialize studentId as empty
  const [status, setStatus] = useState('Pending'); // Default status
  const [resolvedBy, setResolvedBy] = useState('BIIT235'); // Filter by resolvedBy

  const [open, setOpen] = useState(false); // Dropdown visibility state
  const [value, setValue] = useState('Resolved');
  console.log(value) // Selected dropdown value
  const [items, setItems] = useState([
    { label: 'Pending', value: 'Pending' },
    { label: 'Solved', value: 'Resolved' },
    { label: 'All', value: '' },
  ]);



  // Fetch claims from the API
  const fetchClaims = async () => {
    setLoading(true);
    try {
      // Build query parameters for the API
      const queryParams = new URLSearchParams();
      if (value) queryParams.append('status', value);
      if (user) queryParams.append('student_id', user);
      

      const response = await fetch(`${callurl}claims?${queryParams.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setClaims(data.claims);
      } else {
        setClaims([]);
        alert(data.message || 'No claims found.');
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
      alert('Error fetching claims.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch claims when status or studentId changes
  useEffect(() => {
    fetchClaims();
  }, [value,user]);

  // Render each claim item
  const renderClaimItem = ({ item }) => (
    <View style={styles.claimItem}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ backgroundColor: '#F53E4D', width: 20, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}></View>
        <View style={{ marginLeft: 5, padding: 5,width:200 }}>
          <Text style={styles.reason}>Claim Reason: {item.reason}</Text>
          <Text style={styles.arid}>Student ID: {item.student_id}</Text>
          <Text style={styles.arid}>Claim To: {item.resolved_by}</Text>
          <Text style={styles.arid}>Status: {item.status}</Text>
          <Text style={styles.arid}>Date: {item.created_at}</Text>
        </View>
        <View style={{ alignItems: 'center', width: 70, padding: 30, marginLeft: 10 }}>
          <Image source={require('../assets/pending.png')} style={{ width: 50, height: 50 }} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Loading Indicator */}
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: 'black', marginLeft: 10, fontSize: 14 }}>Filter for list</Text>

        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Choose"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>

      {/* Claims List */}
      <FlatList
        data={claims}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderClaimItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No claims found.</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  filterContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  claimItem: {
    backgroundColor: '#FEF2F3',
    marginBottom: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 20,
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 4,
    width: 120,
    marginLeft: 10,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    width: 120,
    marginLeft: 10,
  },
  reason: {
    fontSize: 13,
    color: 'black',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  arid: {
    fontSize: 12,
    color: '#83888d',
  },
});

export default Student_Claims;
