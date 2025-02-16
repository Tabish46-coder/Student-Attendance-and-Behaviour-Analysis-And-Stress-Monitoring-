import react,{useState} from 'react'
import { SafeAreaView,View,Text,StyleSheet } from 'react-native'
import { Button, TextInput } from 'react-native-paper';
import { callurl } from '../apifile'
import DropDownPicker from 'react-native-dropdown-picker';

function ADD_FEEDBACK({navigation,route}){
    const {held_id,userid,roles}=route.params
    const [open2, setOpen2] = useState(false);
    const [minutes, setminutes] = useState('5')
    const [topic,settopic]=useState('')
    const [args,setargs]=useState('')
    console.log(held_id,userid,roles)

     const handleButton = async () => {
            try {
               
    
                const response = await fetch(`${callurl}lecture/add/cr-details?heldId=${held_id}&cr_gr_id=${userid}&minuteMark=${minutes}&lectureTopic=${topic}&lectureStyle=${args}&assignee=${roles}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Error');
                }
    
                
                console.log(response)
               
            } catch (error) {
                console.error("Error during login:", error);
                Alert.alert('Login Failed', error.message);
            }
        };
    return (
       <SafeAreaView>
         

<View style={{marginLeft:15}}>
    <Text style={{fontSize:20,fontWeight:'bold',color:'black'}}>Add Your Comments about lecture</Text>
    </View>
<View>
  <View style={{marginTop:15}}>
                  <DropDownPicker
                        open={open2}
                        value={minutes}
                        items={[
                            { label: '5', value: '5' },
                            { label: '10', value: '10' },
                            { label: '15', value: '15' },
                            { label: '20', value: '20' },
                            
                        ]}
                        setOpen={setOpen2}
                        setValue={setminutes}
                        style={style.dropdown3}
                        dropDownContainerStyle={style.dropdownList3}
                        zIndex={1000}
                    />
              
   </View>

   <View style={{marginTop:20}}>
    <Text>Topic Detail</Text>
    <TextInput onChangeText={(text)=>{settopic(text)}} style={{marginTop:10}}></TextInput>
    <Text>Lecture Style</Text>
    <TextInput onChangeText={setargs} style={{marginTop:10}}></TextInput>

    <Button style={{backgroundColor:'#078345',marginTop:30}} onPress={()=>{handleButton()}}><Text style={{color:'white'}}>Add</Text></Button>

   </View>

</View>


       </SafeAreaView>
    );

}
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    upperview: {
        backgroundColor: '#078345',
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 10,
        zIndex: 1,
    },
    mainContent: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 10,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        
        paddingHorizontal: 15,
    },
    dropdownContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        zIndex: 3000,
        width:200,
        height:100,
        backgroundColor:'black'
    
    },
    dropdown: {
        width: 150,
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 8,
        borderWidth: 2,
        elevation: 5,
        marginLeft:20

    },
   
    dropdown3: {
        width: 150,
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 8,
        borderWidth: 2,
        elevation: 5,
        marginLeft:50
    },
    dropdownList: {
        backgroundColor: 'white',
        borderColor: 'black',
        marginLeft:20
    },
    dropdownList2: {
        backgroundColor: 'white',
        borderColor: 'black',
        marginLeft:10,
        width:120
    },
    dropdownList3: {
        backgroundColor: 'white',
        borderColor: 'black',
        marginLeft:50,
        width:150
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        zIndex: 1,
        marginTop:20
    },
    searchIcon: {
        position: 'absolute',
        left: 10,
        zIndex: 1,
    },
    searchInput: {
        flex: 1,
        height: 50,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 40,
        color: 'black',
        backgroundColor: 'white',
    },
    listContainer: {
        flex: 1,
        zIndex: 1,
    },
    flatListContent: {
        paddingBottom: 20,
    },
    hellotext: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    roletext: {
        color: 'white',
        fontSize: 13,
        marginTop: 5
    },
    itemContainer: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#5d6166',
        borderWidth: 1
    },
});

export default ADD_FEEDBACK