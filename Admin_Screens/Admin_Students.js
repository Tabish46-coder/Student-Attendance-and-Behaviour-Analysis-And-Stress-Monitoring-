import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, Alert, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { callurl } from "../apifile";

const { width: SCREEN_WIDTH } = Dimensions.get('window');


function Admin_Students({navigation,route}){

    const [dicipline, setdecipline] = useState('BCS')
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [semesterno, setsemesterno]= useState('2024SM')
    const [currentsemes, setcurrentsemesno] = useState('7')
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
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

                const response = await fetch(`${callurl}datacell/getstudents?discipline=${diciplines}&semester_no=${semesterNo}&cr_semester_no=${currentsemno}`, {
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
          
        </View>
    );


    return (
        <SafeAreaView style={style.container}>
            <View style={style.mainContent}>
                {/* Wrap dropdowns in individual containers */}
                <View style={style.dropdownsRow}>
                    <View style={style.dropdownWrapper}>
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
                            
                           
                        />
                    </View>

                    <View style={style.dropdownWrapper}>
                        <DropDownPicker
                            open={open1}
                            value={semesterno}
                            items={[
                                { label: '2021FM', value: '2021FM' },
                                { label: '2021SM', value: '2021SM' },
                                { label: '2022FM', value: '2022FM' },
                                { label: '2022SM', value: '2022SM' },
                                { label: '2023SM', value: '2023SM' },
                                { label: '2023FM', value: '2023FM' },
                                { label: '2024FM', value: '2024FM' },
                                { label: '2024SM', value: '2024SM' },
                            ]}
                            setOpen={setOpen1}
                            setValue={setsemesterno}
                            style={style.dropdown2}
                            dropDownContainerStyle={style.dropdownList2}
                           
                        />
                    </View>

                    <View style={style.dropdownWrapper}>
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
                         
                        />
                    </View>
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
        backgroundColor: '#DEFADE',
    },
    mainContent: {
        flex: 1,
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingTop: 20,
        paddingHorizontal: 15,
    },
    dropdownsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        zIndex: 3000,
        position: 'relative',
    },
    dropdownWrapper: {
        zIndex: 3000,
        position: 'relative',
    },
    dropdown: {
        width: SCREEN_WIDTH * 0.25,
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 8,
        borderWidth: 2,
        elevation: 5,
    },
    dropdown2: {
        width: SCREEN_WIDTH * 0.3,
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 8,
        borderWidth: 2,
        elevation: 5,
    },
    dropdown3: {
        width: SCREEN_WIDTH * 0.25,
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 8,
        borderWidth: 2,
        elevation: 5,
    },
    dropdownList: {
        backgroundColor: 'white',
        borderColor: 'black',
        position: 'absolute',
        width: '100%',
    },
    dropdownList2: {
        backgroundColor: 'white',
        borderColor: 'black',
        position: 'absolute',
        width: '100%',
    },
    dropdownList3: {
        backgroundColor: 'white',
        borderColor: 'black',
        position: 'absolute',
        width: '100%',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        zIndex: 1,
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
    itemContainer: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#F1F4FD',
        borderRadius: 10,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#5d6166',
        borderWidth: 1
    },
});
export default Admin_Students
