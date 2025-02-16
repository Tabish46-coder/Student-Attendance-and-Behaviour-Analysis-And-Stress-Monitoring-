import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { callurl } from "../apifile";


function Student_notification({navigaton,route}){

const {user}=route.params
const [notifications, setNotifications] = useState([]);
const [time,settime]=useState('')
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const formatTime = (timeString) => {
    if (!timeString) {
      return 'Invalid Time'; // Handle missing or invalid time values
    }
  
    // Extract hours, minutes, and seconds
    const [hours, minutes] = timeString.split(':');
  
    const hourIn12HourFormat = (parseInt(hours) % 12) || 12;
    const amPm = parseInt(hours) >= 12 ? 'PM' : 'AM';
  
    return `${hourIn12HourFormat}:${minutes} ${amPm}`;
  };

  const fetchNotifications = async () => {
    const apiUrl = `${callurl}notifications?userid=${user}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const notificationsWithFormattedTime = data.map(notification => ({
            ...notification,
            formattedTime: formatTime(notification.time),
          }));
          setNotifications(notificationsWithFormattedTime);
          console.log('Fetched Data:', data);
      } else if (response.status === 404) {
        setError('No notifications found.');
      } else {
        setError('Failed to fetch notifications.');
      }
    } catch (err) {
      setError('Error fetching notifications: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const updateNotificationStatus = async (ids) => {
    const apiUrl = `${callurl}notifications/update?id=${ids}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('done')
      } else if (response.status === 404) {
        setError('Notification not found.');
      } else {
        setError('Failed to update notification.');
      }
    } catch (err) {
      setError('Error updating notification: ' + err.message);
    }
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
            <TouchableOpacity onPress={()=>updateNotificationStatus(item.id)}>
          <View style={[
      styles.notificationItem,
      { backgroundColor: item.status === 'UNREAD' ? '#ffc1c9' : '#C0F3BF' }, // Light red if Unread, white otherwise
    ]}>
        
        <Text style={styles.notificationSubText}>{item.message}</Text>

            <View style={{flexDirection:'row',marginTop:20}}>
            <View style={{marginLeft:20,marginTop:10,backgroundColor:'#8057ff',borderRadius:8,borderWidth:1,borderColor:'black',width:130,alignItems:'center',padding:5}}>
            <Text style={styles.date}>Date: {item.date}</Text>
            </View>
            <View style={{marginLeft:110,marginTop:10,backgroundColor:'#8057ff',borderRadius:8,borderWidth:1,borderColor:'black',width:100,alignItems:'center',padding:5}}>
            <Text style={styles.time}>Time: {item.formattedTime}</Text>
            </View> 
            </View>
            
          </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  notificationItem: {
    marginBottom: 10,
    padding: 5,
    borderRadius:10,
    backgroundColor:'#C5D5F8'
  },
  notificationSubText: {
    fontSize: 14,
    color: '#555',
    marginLeft:20
  },
  date:{
    fontSize:12,
    color:'white',
  },
  time:{
  color:'white',
  fontSize:10
  }
});

export default Student_notification