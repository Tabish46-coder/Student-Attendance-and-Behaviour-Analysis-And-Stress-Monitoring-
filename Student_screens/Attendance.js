import React, { useEffect, useRef,useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Image,Modal, SafeAreaView,FlatList,Alert, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { callurl } from '../apifile';
const ProgressBar = ({ progress, total,absent,present }) => {

  const animatedProgress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const progressColor = animatedProgress.interpolate({
    inputRange: [0, 50, 100],
    outputRange: ['#FF0000', '#FFFF00', '#00FF00'],
  });

  return (
    <View style={styles.rowContainer}>
      {/* Left side details */}
      <View style={styles.detailsContainer}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <Image source={require('../assets/total.png')} style={{height:20,width:20}}></Image>
        <Text style={styles.labelText}>{total} Total</Text>
        </View>
     
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <Image source={require('../assets/present.png')} style={{height:20,width:20,marginTop:10}}></Image>
        <Text style={styles.labelText2}>{present} Presents</Text>
        </View>

        <View style={{flexDirection:'row',alignItems:'center'}}>
        <Image source={require('../assets/absent.png')} style={{height:20,width:20,marginTop:10}}></Image>
        <Text style={styles.labelText2}>{absent} Absents</Text>
        </View>
      </View>

      {/* Right side progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: animatedProgress.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>
        <Text style={styles.percentageText}>{`${progress}%`}</Text>
      </View>
    </View>
  );
};




const Attendance = ({navigation,route}) => {
  const {course,student,semester}=route.params
 const [description,setdescription]=useState('')
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total,settotal]=useState(0)
  const [Absents,setAbsents]=useState(0)
  const [Presents,setPresents]=useState(0)
  const [percentage,setpercentage]=useState(0)
  const [modalVisible, setModalVisible] = useState(false);
  const [heldid,setheldid]=useState(0);
  const [studentids,setstudentids]=useState('');
  const [teacher_ids,setteacherids]=useState('');


 const fetchAttendanceData = async () => {
  // Replace these with actual values
  const courseId = course;
  const regNo = student;
  const semesterNo = semester;

  try {
    // Construct the URL with query parameters
    const url = `${callurl}attendance/subject?course_id=${courseId}&reg_no=${regNo}&semester_no=${semesterNo}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // Add any additional headers like authorization if needed
        // 'Authorization': `Bearer ${yourAuthToken}`
      }
    });

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const json = await response.json();
    console.log(json)
    setAttendanceData(json);
    calculation(json)
    setIsLoading(false);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    setError(error.message);
    setIsLoading(false);
  }
};

const calculation = (list) => {
  const totalAttendance = list.length; // Total items in the list
  settotal(totalAttendance);
  console.log(total) // Update the total count

  let count = 0; // Initialize count for absences
  list.forEach((item) => {
    if (item.final_status === 'A') {
      count += 1; // Increment count for each absenc
    }
  });

  setAbsents(count);
  console.log(Absents) // Update absences count
  setPresents(totalAttendance - count);
  //console.log(Presents)
  const percent=(Presents/totalAttendance)*100
  setpercentage(percent) 
  //console.log(percentage)// Calculate and update presents
};

// Fetch data when component mounts
useEffect(() => {
  fetchAttendanceData();
  
}, [course,student,semester]);

// Render loading state
if (isLoading) {
  return <Text>Loading attendance data...</Text>;
}

// Render error state
if (error) {
  return <Text>Error: {error}</Text>;
}
console.log(attendanceData.length)

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.toDateString().split(' ').slice(0, 3).join(' ')}`;
};

//Create Claim
const handleCreateClaim = async (heldid,studentid,reason,teacherid) => {
  if (!heldid || !studentid || !reason || !teacherid) {
    Alert.alert("Error", "All fields are required");
    return;
  }

  const apiUrl = `${callurl}claims/create` // Replace with your actual API URL

  const formData = new FormData();
  formData.append("held_id", heldid);
  formData.append("student_id", studentid);
  formData.append("reason", reason);
  formData.append("teacher_id", teacherid);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      Alert.alert("Success", result.message);
    } else {
      const errorResult = await response.json();
      Alert.alert("Error", errorResult.error || "Failed to create claim");
    }
  } catch (error) {
    Alert.alert("Error", "An error occurred while creating the claim");
    console.error("Error:", error);
  }
};

const openModal = (held,student,teacher) => {
  setheldid(held)
  setstudentids(student)
  setteacherids(teacher)
  console.log(heldid,studentids,teacher_ids) // Set the data you want to pass
  setModalVisible(true); // Show the modal
};

const renderAttendanceItem = ({ item }) => (
  <View style={{ padding: 10,backgroundColor:'#FFFFF',borderRadius:10,marginTop:10}}>
    <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#e5e6e8',height:70,width:'auto',borderRadius:15,elevation:5}}>

      <View>
      <Image source={item.final_status==='A'?require('../assets/absent.png'):require('../assets/present.png')} style={{width:30,height:30,marginLeft:20}}></Image>
      </View>

      <View>
      <Text style={styles.listtext1}>{formatDate(item.held_date)}</Text>
      <Text style={styles.listtext}>{item.class_venue} | {item.slot_starttime}-{item.slot_endtime}</Text>
      </View>

      <View>
        <TouchableOpacity onPress={()=>{openModal(item.held_id,item.student_id,item.teacher_id)}}>
        <Image source={require('../assets/claim2.png')} style={{width:35,height:35,marginLeft:20}}></Image>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);
  return (
    <View style={styles.appContainer}>
      <ProgressBar 
        progress={percentage} 
        total={total}
        absent={Absents}
        present={Presents}
      />
      <View style={{height:'auto',backgroundColor:'#FFFFF',flex:1}}>
      
      <FlatList
        data={attendanceData}
        keyExtractor={(item) => item.held_id.toString()}
        renderItem={renderAttendanceItem}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
      </View>
    
      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)} // Handle back button close
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Create a Claim</Text>
      <Text style={{marginLeft:5,marginBottom:10}}>Description</Text>
      <View style={{height:80,width:'auto',padding:10,borderWidth:1,borderColor:'black',backgroundColor:'#DFE7FA',borderRadius:10}}>
      <TextInput placeholder='Why you Claiming it?' onChangeText={(value)=>{setdescription(value)}}></TextInput>
      </View>
      <View style={{flexDirection:'row',alignItems:'center'}}>
      <TouchableOpacity
        style={{backgroundColor:'#9EBBF2',width:100,height:20,alignItems:'center',borderRadius:10,marginTop:20}}
        onPress={()=>{handleCreateClaim(heldid,studentids,description,teacher_ids)}}
      >
        <Text style={{color:'white'}}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{backgroundColor:'#FD6C78',width:100,height:20,alignItems:'center',borderRadius:10,marginLeft:80,marginTop:20}}
        onPress={() => setModalVisible(false)} // Close Modal
      >
        <Text style={{color:'white'}}>Cancel</Text>
      </TouchableOpacity>
      </View>
     
    </View>
  </View>
</Modal>
    </View>



   
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#FFFFF',
    padding: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    borderRadius:10,
    padding:10,
    backgroundColor:'#e5e6e8',
    elevation:5
  },
  detailsContainer: {
    flex: 3, // Takes 30% of the space
    paddingRight: 15,
  },
  progressContainer: {
    flex: 5, // Takes 70% of the space
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  labelText: {
    fontSize: 14,
    color: '#000',
    marginLeft:10
  },
  labelText2: {
    fontSize: 14,
    color: '#000',
    marginLeft:10,
    marginTop:10
  },
  subLabelText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  progressBarBackground: {
    flex: 1,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  percentageText: {
    fontSize: 14,
    color: '#000',
    minWidth: 45, // Ensures consistent width for percentage text
    textAlign: 'right',
  },
  listtext:{
   color:'#acb0b4',
   fontWeight:'bold',
   fontSize:14,
   marginLeft:15
  },
  listtext1:{
    color:'black',
    fontWeight:'bold',
    fontSize:14,
    marginLeft:15
   },
   modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
});

export default Attendance;