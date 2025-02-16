import React,{useEffect,useState} from "react";
import { SafeAreaView,View,Text,Alert, Image, TouchableOpacity } from "react-native";
import { callurl } from "../apifile";
import { Button, TextInput } from "react-native-paper";

function CMM_Manage_Student_Voilation({navigation,route}){
    const{punishmentids,sec,datesatrt,enddates,fathername,stuname,statuses,rooms,punishroom}=route.params
    const[lastrowon,setlastrowon]=useState(0)
    const[punishon,setpunishon]=useState(0)
    const[statuson,setstatuson]=useState(0)


    const [role, setRole] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [punishmentRoom, setPunishmentRoom] = useState(punishroom);
    const [lastRow, setLastRow] = useState(rooms);
    const [status, setStatus] = useState(statuses);
    console.log(lastrowon,punishon,statuson,statuses)


  
    const toggleLastRow = () => {
        setlastrowon((prev) => (prev === 0 ? 1 : 0)); 
        setLastRow((prev) => (prev === false ? true : false));
      };
      const punishment = () => {
        setpunishon((prev) => (prev === 0 ? 1 : 0)); 
        setPunishmentRoom((prev) => (prev === false ? true : false)); 
      };

      const statusfunc = () => {
        setstatuson((prev) => {(prev === 0 ? 1 : 0)}); 
        setStatus((prev) => (prev === false ? true : false));
      };


      const updatePunishment = async () => {
        try {
          const response = await fetch(`${callurl}punishments/${punishmentids}/update`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              start_date: startDate || datesatrt,
              end_date: endDate || enddates,
              punishment_room: punishmentRoom,
              last_row: lastRow,
              status: status,
            }),
          });
    
          const result = await response.json();
          if (response.ok) {
            Alert.alert('Success', result.message || 'Punishment updated successfully');
          } else {
            Alert.alert('Error', result.error || 'Failed to update punishment');
          }
        } catch (error) {
          Alert.alert('Error', 'An unexpected error occurred: ' + error.message);
        }
      };

    return(
      <SafeAreaView>
          <View style={{padding:20}}>
           <Text style={{fontSize:14,fontWeight:'bold',color:'black'}}>Student Name: {stuname}</Text>
           <Text style={{fontSize:14,fontWeight:'bold',color:'black'}}>Father Name: {fathername}</Text>
           <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>Section: {sec}</Text>
           <View style={{marginTop:20}}>
            <Text style={{color:'black',fontSize:14,fontWeight:'bold'}}>Start date</Text>
            <TextInput placeholder={datesatrt} style={{width:120,height:40,marginTop:10}} onChangeText={(value)=>{setStartDate(value)}}></TextInput>

            <Text style={{color:'black',fontSize:14,fontWeight:'bold',marginTop:10}}>End date</Text>
            <TextInput placeholder={enddates} style={{width:120,height:40,marginTop:10}} onChangeText={(value)=>{setEndDate(value)}}></TextInput>
           </View>

           <View style={{marginTop:40}}>
            <View style={{flexDirection:'row'}}>
             <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}>Last Row</Text>
             <TouchableOpacity onPress={()=>toggleLastRow()}>
             <Image source={lastrowon?require("../assets/on.png"):require("../assets/off.png")} style={{width:40,height:40,marginLeft:220}}></Image>
             </TouchableOpacity>
            </View>

            <View style={{flexDirection:'row'}}>
             <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}>Punisment Room</Text>
             <TouchableOpacity onPress={()=>punishment()}>
             <Image source={punishon?require("../assets/on.png"):require("../assets/off.png")} style={{width:40,height:40,marginLeft:163}}></Image>
             </TouchableOpacity>
            </View>

            <View style={{flexDirection:'row'}}>
             <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}>Status(Active/InActive)</Text>
             <TouchableOpacity onPress={()=>statusfunc()}>
             <Image source={status?require("../assets/on.png"):require("../assets/off.png")} style={{width:40,height:40,marginLeft:120}}></Image>
             </TouchableOpacity>
            </View>
            
            <Button style={{backgroundColor:'#bdb4ff',marginTop:30}} onPress={updatePunishment}><Text style={{color:'white'}}>Save</Text></Button>
           </View>
          </View>
      </SafeAreaView>
    );
}
export default CMM_Manage_Student_Voilation