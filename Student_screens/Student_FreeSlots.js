import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from 'react-native';
import {Button} from "react-native-paper"
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Assuming you're using Ionicons
import { callurl } from '../apifile';
import moment from 'moment';
const FreeSlotsScreen = ({navigation,route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [freeSlots, setFreeSlots] = useState([]);
  const [punishments, setPunishments] = useState([]);
  const [day, setDay] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const{user,roles}=route.params

  // Dropdown state
  const [dayOpen, setDayOpen] = useState(false);
  const [dayValue, setDayValue] = useState(null);
  const [dayItems, setDayItems] = useState([
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
  ]);

  const fetchFreeSlots = async () => {
    const semesterNo = '2024FM';  // Replace with appropriate semester_no value
      // Replace with student_id
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'

    if (!dayValue) {
      Alert.alert('Error', 'Please select a day.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${callurl}timetable/free-slots?semester_no=${semesterNo}&student_id=${user}&day=${dayValue}&current_date=${formattedDate}`);
      const result = await response.json();
      console.log(result)

      if (response.ok && result.status === 'success') {
        setFreeSlots(result.data.free_slots || []);
        setPunishments(result.data.punishments || []);
        setDay(result.data.day);
      } else {
        Alert.alert('Error', result.message || 'Failed to fetch data.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (event, selected) => {
    const currentDate = selected || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const formatTime = (timeString) => {
    const [hourMinute] = timeString.split('.'); // Splits by '.' and takes the first part
    return hourMinute; // Returns the formatted time in 'HH:MM' format
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('ddd, DD MMM'); // Formats to 'Tue, 14 Jan'
  };

  return (
    <FlatList
      data={[{ type: 'header' }, ...freeSlots, ...punishments]}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => {
        if (item.type === 'header') {
          return (
            <View style={{ padding: 16 }}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Ionicons name="calendar" size={24} color="green" />
                <Text style={{ marginLeft: 8, fontSize: 16 }}>{selectedDate.toDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
              <DropDownPicker
                open={dayOpen}
                value={dayValue}
                items={dayItems}
                setOpen={setDayOpen}
                setValue={setDayValue}
                setItems={setDayItems}
                placeholder="Select a day"
                style={{ marginBottom: 16 }}
              />
              <Button onPress={fetchFreeSlots} style={{ backgroundColor: '#372948' }}>
                <Text style={{ color: 'white' }}>Fetch Slots</Text>
              </Button>
              <Text style={{ marginTop: 22, fontSize: 20, fontWeight: 'bold',color:'black' }}>Free Slots for {day}</Text>
            </View>
          );
        } else if (freeSlots.includes(item)) {
          return (
            <View style={{ marginTop: 10, borderRadius: 10, borderColor: 'black', borderWidth: 1, padding: 5, width: 200, backgroundColor: '#d8d5ff', alignItems: 'center',marginLeft:30 }}>
              <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14 }}>
                {formatTime(item.slot_starttime)} - {formatTime(item.slot_endtime)}
              </Text>
            </View>
          );
        } else {
          return (
            <View style={{ marginTop: 15,padding:10,width:360,marginLeft:15}}>
                <Text style={{ marginTop: 10, fontSize: 20, fontWeight: 'bold',color:'black' }}>Punishments for {day}</Text>
                <View style={{borderColor:'black',borderWidth:1,marginTop:20,borderRadius:10,padding:5,backgroundColor:'#d8d5ff'}}>
                <Text style={{color:'black',fontSize:14,marginLeft:10,fontWeight:'bold'}}>Violation: {item.description}</Text>
                <Text style={{color:'black',marginLeft:10,fontWeight:'bold',marginTop:10}}>Duration: {formatDate(item.start_date)} - {formatDate(item.end_date)}</Text>
                </View>
             
            </View>
          );
        }
      }}
    />
  );
};

export default FreeSlotsScreen;
