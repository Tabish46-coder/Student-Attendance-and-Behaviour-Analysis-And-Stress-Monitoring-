import React, { useRef, useEffect, useState } from "react";
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";
import { Text } from "react-native-paper";
import { Badge } from "react-native-elements";
import { callurl } from "../apifile";
import notifee, { AndroidImportance } from "@notifee/react-native";

function Student_home({ navigation, route }) {
  const { role } = route.params;
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationShownRef = useRef(false);
  const [channelId, setChannelId] = useState(null);
  const [isChannelReady, setIsChannelReady] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const notification = () => {
    navigation.navigate("Student_notification", { user: route.params.id });
  };

  const goto_allocation = () => {
    navigation.navigate("Student_enrollment", { user: route.params.id });
  };

  const goto_attendance = () => {
    navigation.navigate("Studnet_Attendance", { user: route.params.id });
  };

  const goto_timetable = () => {
    navigation.navigate("Student_timetable", { user: route.params.id });
  };

  const goto_Claims = () => {
    navigation.navigate("Student_Claims", { user: route.params.id });
  };

  const goto_profile=()=>{
    navigation.navigate('Teacher_Profile',{user:route.params.id,roleof:role}) 
  }

  const goto_freeslots=()=>{
    navigation.navigate("Student_FreeSlots",{user: route.params.id,roles:role})
  }

  const fetchProfilePicture = async () => {
    try {
      const response = await fetch(`${callurl}profile_picture/fetch?user_id=${route.params.id}`);
      
      if (response.ok) {
        const imageUrl = `${callurl}profile_picture/fetch?user_id=${route.params.id}&timestamp=${new Date().getTime()}`;
        setProfileImage(imageUrl);
      }
    } catch (error) {
      console.log('Error fetching profile picture:', error);
      // Silently fail and use default image
    }
  };

  const checkNotificationPermissions = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const settings = await notifee.requestPermission();
        
        if (settings.authorizationStatus === notifee.AuthorizationStatus.DENIED) {
          console.warn("Notification permissions denied");
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Error checking notification permissions:", error);
      return false;
    }
  };

  const createNotificationChannel = async () => {
    try {
      const newChannelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
      
      if (newChannelId) {
        setChannelId(newChannelId);
        setIsChannelReady(true);
        console.log("Notification channel created successfully:", newChannelId);
        return newChannelId;
      }
      
      console.warn("Failed to create notification channel");
      return null;
    } catch (error) {
      console.error("Error creating notification channel:", error);
      return null;
    }
  };

  const fetchUnreadNotificationsCount = async () => {
    if (!isChannelReady) {
      console.log("Waiting for notification channel to be ready...");
      return;
    }

    try {
      const apiUrl = `${callurl}notifications/unread_count?userid=${route.params.id}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setUnreadCount(data.unread_count);
      await showNotifications(data.unread_count);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
    }
  };

  const showNotifications = async (count) => {
    try {
      if (!isChannelReady || !channelId) {
        console.log("Notification channel not ready yet");
        return;
      }

      const hasPermission = await checkNotificationPermissions();
      if (!hasPermission) return;

      if (count > 0 && !notificationShownRef.current) {
        await notifee.displayNotification({
          title: "New Notifications",
          body: `You have ${count} unread notification${count > 1 ? 's' : ''}.`,
          android: {
            channelId,
            smallIcon: 'ic_launcher',
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
            },
          },
        });
        notificationShownRef.current = true;
        console.log("Notification displayed successfully");
      } else if (count === 0) {
        notificationShownRef.current = false;
      }
    } catch (error) {
      console.error("Error displaying notification:", error);
    }
  };

  useEffect(() => {
    fetchProfilePicture()
    let intervalId;

    const initializeNotifications = async () => {
      const hasPermission = await checkNotificationPermissions();
      if (hasPermission) {
        await createNotificationChannel();
      }
    };

    initializeNotifications().then(() => {
      if (isChannelReady) {
        // Initial fetch
      //  fetchUnreadNotificationsCount();
        // Set up interval only after channel is ready
       // intervalId = setInterval(fetchUnreadNotificationsCount, 5000);
      }
    });

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isChannelReady]);

  // Rest of your component remains the same
  return (
    <SafeAreaView style={{ backgroundColor: "#FFFFF" }}>
      <View style={styles.card}>
        <View style={styles.notificationContainer}>
          <TouchableOpacity onPress={notification}>
            <Image source={require("../assets/bell.png")} style={styles.bellIcon} />
            {unreadCount > 0 && (
              <Badge
                value={unreadCount}
                status="error"
                containerStyle={styles.badgeContainer}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.greetingText}>Hello!</Text>
            <Text style={styles.nameText}>{route.params?.user || "Guest"}</Text>
            <Text style={styles.roleText}>{role}</Text>
          </View>
          <View style={styles.image}>
            <Image source={profileImage ? 
                  { uri: profileImage } : 
                  require('../assets/profile.png')
                } style={styles.personIcon} />
          </View>
        </View>
      </View>

      <View style={{ height: "auto", flexDirection: "row" }}>
        <View style={styles.allocation}>
          <Image source={require("../assets/enrollment.png")} style={styles.lowerimages}></Image>
          <TouchableOpacity onPress={goto_allocation}>
            <Text style={styles.allocationtext}>Enrollment</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.allocation}>
          <Image source={require("../assets/attendance.png")} style={styles.lowerimages}></Image>
          <TouchableOpacity onPress={goto_attendance}>
            <Text style={styles.allocationtext}>Attendance</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.allocation}>
          <Image source={require("../assets/timetable.png")} style={styles.lowerimages}></Image>
          <TouchableOpacity onPress={goto_timetable}>
            <Text style={styles.allocationtext}>Timetable</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ height: "auto", flexDirection: "row" }}>
      <View style={styles.allocation}>
        <Image source={require("../assets/claim.png")} style={styles.lowerimages}></Image>
        <TouchableOpacity onPress={goto_Claims}>
          <Text style={styles.allocationtext}>Claims</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.allocation}>
        <Image source={require("../assets/profile.png")} style={styles.lowerimages}></Image>
        <TouchableOpacity onPress={goto_profile}>
          <Text style={styles.allocationtext}>Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.allocation}>
        <Image source={require("../assets/punishment.png")} style={styles.lowerimages}></Image>
        <TouchableOpacity onPress={goto_freeslots}>
          <Text style={styles.allocationtext}>Punishment</Text>
        </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 250,
    backgroundColor: '#078345',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    elevation: 5
  },
  notificationContainer: {
    height: 80,
    flexDirection: 'row-reverse',
    paddingTop: 10,
    paddingRight: 10,
  },
  bellIcon: {
    height: 40,
    width: 40,
  },
  infoContainer: {
    height: 180,
    flexDirection: 'row',
  },
  textContainer: {
    height: 170,
    width: 200
  },
  greetingText: {
    color: 'white',
    width: 70,
    height: 34,
    fontStyle: 'normal',
    fontWeight: 'bold',
    lineHeight: 40,
    fontSize: 17,
    marginLeft: 26,
  },
  nameText: {
    color: 'white',
    width: 'auto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    lineHeight: 40,
    fontSize: 17,
    marginLeft: 25,
    height: 39,
  },
  allocationtext: {
    color: 'black',
    fontStyle: 'normal',
    lineHeight: 40,
    fontSize: 14,
    fontWeight: 'bold'
  },
  roleText: {
    color: 'white',
    width: 70,
    fontStyle: 'normal',
    fontWeight: 'bold',
    lineHeight: 40,
    fontSize: 14,
    marginLeft: 25,
  },
  personIcon: {
    height: 100,
    width: 100,
    overflow: 'hidden',
    borderRadius: 60
  },
  image: {
    width: 120,
    alignItems: 'center',
    height: 120,
    elevation: 20,
    borderRadius: 60,
    marginLeft: 30,
  },
  allocation: {
    height: 85,
    width: 100,
    marginTop: 50,
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: '#e5e6e8',
    borderRadius: 15,
    marginLeft: 15,
    padding: 10
  },
  lowerimages: {
    height: 30,
    width: 30,
  },
  badgeContainer: {
    position: 'absolute',
    top: -2,
    right: -6,
  }
});

export default Student_home;