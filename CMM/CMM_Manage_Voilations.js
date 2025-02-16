import React,{useEffect,useState} from "react";
import { SafeAreaView,StyleSheet,View,Text,FlatList,Image, TouchableOpacity,Alert } from "react-native";
import { callurl } from "../apifile";
import { Button } from "react-native-paper";
function CMM_Manage_Voilations({navigation,route}){
    const{voilationid,voilationtype,voilationdesc,voilationdate,voilationby}=route.params
    console.log("Violation Date:", voilationdate);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);


    const formatDateOnly = (dateTimeString) => {
        // Split the date-time string by space and return only the date part
        return dateTimeString.split(' ')[0];
      };
      
      // Example usage
      const dateTime = voilationdate;
      const formattedDate = formatDateOnly(dateTime);


      const fetchViolationStudents = async () => {
        // Replace with dynamic value if needed
        const semesterNo = '2024SM'; // Replace with dynamic value if needed
        const apiUrl = `${callurl}violations/students?violation_id=${voilationid}&semester_no=${semesterNo}`;
    
        try {
          const response = await fetch(apiUrl);
          const result = await response.json();
          console.log(result)
          if (response.ok) {
            setData(result.punishments_students);
          } else {
            Alert.alert('Error', result.error || 'Failed to fetch data');
          }
        } catch (error) {
          Alert.alert('Error', 'Could not fetch data: ' + error.message);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchViolationStudents();
      }, [data]);

      const editpunishment=(ids,sections,start,end,father,fullnames,statuss,room,punish)=>{
        navigation.navigate('CMM_Manage_Student_Voilation',{punishmentids:ids,sec:sections,datesatrt:start,enddates:end,fathername:father,stuname:fullnames,statuses:statuss,rooms:room,punishroom:punish})
      }

      const modifyPunishmentStatus = async (key, id) => {
        console.log('Request Key:', key, 'Request ID:', id);
         // Ensure callurl is defined and correct
        try {
          const response = await fetch(`${callurl}punishments/${key}?key=${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          const responseText = await response.text();  // Get raw text
          console.log('Raw Response:', responseText);  // Debug log
          
          if (response.ok) {
            const result = JSON.parse(responseText);   // Parse JSON only if the response is OK
            Alert.alert('Success', result.message);
          } else {
            Alert.alert('Error', 'Failed to modify punishment status.');
          }
        } catch (error) {
          Alert.alert('Error', 'An unexpected error occurred: ' + error.message);
        }
      };
       


      const renderItem = ({ item }) => (
        <View style={style.card}>
          <View style={{flexDirection:'row',backgroundColor:'#bdb4ff',padding:10,borderTopLeftRadius:10,borderTopRightRadius:10}}>
            <Image source={item.status? require('../assets/circle.png'):require('../assets/circle2.png')} style={{width:20,height:20}}></Image>
            <Text style={{marginLeft:10,fontWeight:'bold'}}>{item.status?"Active":"InActive"}</Text>
            <TouchableOpacity onPress={()=>{editpunishment(item.punishment_id,item.Section,item.start_date,item.end_date,item.Father_name,item.FullName,item.status,item.last_row,item.punishment_id)}}>
            <Image source={require('../assets/pencil.png')} style={{height:20,width:20,marginLeft:150}}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{modifyPunishmentStatus(item.punishment_id,'DELETE')}}>
            <Image source={require('../assets/delete.png')} style={{height:20,width:20,marginLeft:30}}></Image>
            </TouchableOpacity>
          </View>
          <View style={{backgroundColor:'#d8d5ff',padding:10,borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
            <Text style={{fontSize:10}}>({item.start_date}  {item.end_date})</Text>
            <Text style={{fontSize:12,marginTop:5,fontWeight:'bold'}}>{item.FullName} S/O {item.Father_name}</Text>
            <Text style={{fontSize:12,marginTop:10}}>Role: {item.role}</Text>
            <Text style={{fontSize:12,marginTop:10}}>Punisment Room :{item.punishment_room?"True":"False"}                  Last Row:{item.last_row?"True":"False"}</Text>
             
          </View>
        </View>
      );

      const addstudents=()=>{
        navigation.navigate('CMM_Students',{id:voilationid})
      }
return(
<SafeAreaView>
    <View style={style.upperview}>

<View style={style.details}>
<Text style={{fontSize:16,fontWeight:'bold',color:'black'}}>description:</Text>
<Text style={{marginLeft:40,fontSize:13,marginTop:15}}>{voilationdesc}</Text>
<Text style={{fontSize:12,color:'black',marginTop:20,fontWeight:'bold'}}>Type:                                   Roport By:                      Report At:</Text>
<Text style={{fontSize:12,color:'black',marginTop:10}}>{voilationtype}                       {voilationby}                           {formattedDate}</Text>
</View>
    </View>

    <View style={style.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.punishment_id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>

    <View>
        <Button onPress={addstudents} style={{backgroundColor:'#77d6ff',width:300,marginLeft:40}}><Text style={{color:'white'}}>Add Student</Text></Button>
    </View>

    <View style={{flexDirection:'row',alignItems:'center',marginTop:50,marginLeft:50}}>
    <Button style={{backgroundColor:'#7531ff',width:120}}><Text style={{color:'white'}}>Edit</Text></Button>
    <Button style={{backgroundColor:'#ff5a6f',width:120,marginLeft:40}}><Text style={{color:'white'}}>Delete/Archive</Text></Button>
    </View>

</SafeAreaView>
);
}
const style=StyleSheet.create({
    upperview:{
        padding:10,
        alignItems:'center',
        
    },
    details:{
    backgroundColor:'#F9D2DA',
    padding:10,
    width:350,
    borderRadius:10
    },
    container: {
        padding: 20,
        backgroundColor: '#f4f4f4',
      },
      card: {
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
      },
      title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
      },
})
export default CMM_Manage_Voilations