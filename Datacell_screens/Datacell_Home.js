import React,{useState,useEffect} from "react";
import { SafeAreaView,View,StyleSheet,Image, TouchableOpacity,TextInput,FlatList,Alert,Modal } from "react-native";
import { Text,Button } from "react-native-paper";
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { callurl } from "../apifile";
import { ScrollView } from "react-native-gesture-handler";

function Datacell_Home({navigation,route}){

    const [dicipline, setdecipline] = useState('BCS')
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [semesterno, setsemesterno]= useState('2024SM')
    const [currentsemes, setcurrentsemesno] = useState('7')
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const {role}=route.params
    const [originalData, setOriginalData] = useState([]); // The full data


    const handleSearch = (text) => {
        setSearch(text);
        if (text === "") {
            setFilteredData(originalData); // Reset to full data when search is cleared
        } else {
            const filtered = originalData.filter(item =>
                item.Name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };


    const goback=()=>{
        navigation.navigate('Login')
    }


    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const currentsemno = currentsemes; // Assuming user reg_no is passed in route params
                console.log('currentsemno:', currentsemno); // Debugging
                const semesterNo = semesterno;
                console.log('Semester No:', semesterNo);
                 const diciplines=dicipline

                // Validate parameters
                if (!currentsemno || !semesterNo || !diciplines) {
                    throw new Error('error while selecting.');
                }

                const response = await fetch(`${callurl}datacell/getstudents?discipline=${diciplines}&semester_no=2024FM&cr_semester_no=${currentsemno}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const fetchedData = await response.json();
                console.log('Fetched Data:', fetchedData); 
                

                if (fetchedData.length > 0) {
                    setFilteredData(fetchedData);
                    setOriginalData(fetchedData); // Store full data
                } else {
                    throw new Error('No data received');
                }
            } catch (error) {
                console.error("Error during fetch:", error);
                Alert.alert('Error', error.message);
            } finally {
                setLoading(false); // Set loading to false after fetch completes
            }
        };

        // Fetch courses only if semester is selected
        if (semesterno && currentsemes && dicipline ) {
            fetchStudents();
        }
    }, [semesterno,currentsemes,dicipline]);

   


    const renderItem = ({ item }) => (
        <View style={style.itemContainer}>
            <Image source={require('../assets/person.png')} style={{height: 40, width: 40}} />
            <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{item.Name}</Text>
                <Text style={{ fontSize: 10, color: '#209920' }}>{item.REG_NO}</Text>
            </View>
            <TouchableOpacity onPress={()=> navigation.navigate('Student_save_image',{studentno: item.REG_NO,studentname:item.Name})} 
            style={{marginLeft:'auto',backgroundColor:'#209920',height:40,width:60,alignItems:'center',borderRadius:10}}>
                <Text style={{color:'white',fontSize:14,marginTop:10}}>View</Text>
                </TouchableOpacity>
        </View>
    );


    return (
        <SafeAreaView style={style.container}>
            <View style={style.upperview}>
                <View style={{ marginLeft: 20 }}>
                    <Image source={require('../assets/BIIT.png')} style={{ height: 70, width: 70, elevation: 5 }}></Image>
                </View>
                <View style={{ marginLeft: 40 }}>
                    <Text style={style.hellotext}>Hello!</Text>
                    <Text style={style.roletext}>{role}</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={goback}>
                        <Image source={require('../assets/quit.png')} style={{ height: 30, width: 30, marginLeft: 140 }}></Image>
                    </TouchableOpacity>
                </View>
            </View>

            
            <View style={style.mainContent}>
            <View style={{flexDirection:'row',width:150}}>
                    <DropDownPicker
                        open={open}
                        value={dicipline}
                        items={[
                            { label: 'BCS', value: 'BCS' },
                            { label: 'BSE', value: 'BSE' },
                            { label: 'BAI', value: 'BAI' },
                        ]}
                        setOpen={setOpen}
                        setValue={setdecipline}
                        style={style.dropdown}
                        dropDownContainerStyle={style.dropdownList}
                        zIndex={3000}
                    />
                    
                    <DropDownPicker
                        open={open2}
                        value={currentsemes}
                        items={[
                            { label: '1', value: '1' },
                            { label: '2', value: '2' },
                            { label: '3', value: '3' },
                            { label: '4', value: '4' },
                            { label: '5', value: '5' },
                            { label: '6', value: '6' },
                            { label: '7', value: '7' },
                            { label: '8', value: '8' },
                            { label: '9', value: '9' }
                        ]}
                        setOpen={setOpen2}
                        setValue={setcurrentsemesno}
                        style={style.dropdown3}
                        dropDownContainerStyle={style.dropdownList3}
                        zIndex={1000}
                    />
               </View>
                
                <View style={style.searchContainer}>
                    <Ionicons name="search" size={20} color="#000" style={style.searchIcon} />
                    <TextInput
                        style={style.searchInput}
                        placeholder="Search"
                        placeholderTextColor={'black'}
                        value={search}
                        onChangeText={handleSearch}
                    />
                </View>

                <View style={style.listContainer}>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : (
                        <FlatList
                            data={filteredData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={style.flatListContent}
                        />
                    )}
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
        marginLeft:50
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
export default Datacell_Home
