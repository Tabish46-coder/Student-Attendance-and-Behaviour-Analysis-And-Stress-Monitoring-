import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, Alert } from "react-native";
import { Text, FAB } from "react-native-paper";
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { callurl } from "../apifile";

function CMM_Students({ navigation, route }) {
    const [dicipline, setdecipline] = useState('BCS');
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [semesterno, setsemesterno] = useState('2024SM');
    const [currentsemes, setcurrentsemesno] = useState('7');
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [originalData, setOriginalData] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const{id}=route.params
    console.log(id)
    console.log(selectedStudents)

    const handleSearch = (text) => {
        setSearch(text);
        if (text === "") {
            setFilteredData(originalData);
        } else {
            const filtered = originalData.filter(item =>
                item.Name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    const toggleSelectStudent = (item) => {
        setSelectedStudents((prevSelected) => {
            const isSelected = prevSelected.some(student => student.REG_NO === item.REG_NO);
            if (isSelected) {
                return prevSelected.filter(student => student.REG_NO !== item.REG_NO);
            } else {
                return [...prevSelected, item];
            }
        });
    };

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const currentsemno = currentsemes;
                const semesterNo = semesterno;
                const diciplines = dicipline;

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

                if (fetchedData.length > 0) {
                    setFilteredData(fetchedData);
                    setOriginalData(fetchedData);
                } else {
                    throw new Error('No data received');
                }
            } catch (error) {
                console.error("Error during fetch:", error);
                Alert.alert('Error', error.message);
            } finally {
                setLoading(false);
            }
        };

        if (semesterno && currentsemes && dicipline) {
            fetchStudents();
        }
    }, [semesterno, currentsemes, dicipline]);

    const renderItem = ({ item }) => {
        const isSelected = selectedStudents.some(student => student.REG_NO === item.REG_NO);
        return (
            <TouchableOpacity onPress={() => toggleSelectStudent(item)}>
                <View style={styles.itemContainer}>
                    <Image 
                        source={isSelected ? require('../assets/circle.png') : require('../assets/person.png')} 
                        style={{ height: 40, width: 40 }} 
                    />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{item.Name}</Text>
                        <Text style={{ fontSize: 10, color: '#209920' }}>{item.REG_NO}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const handleSave = () => {

        for(let i=0;i<selectedStudents.length;i++){
            createPunishments(id,selectedStudents[i].REG_NO)
        }
        Alert.alert('Selected Students', JSON.stringify(selectedStudents, null, 2));
    };


    const createPunishments = (ids,stuids) => {
        const apiUrl = `${callurl}punishments/create`; // Replace with your actual URL
        const punishmentsData = [
            {
              violation_id: ids,
              student_id: stuids,
             
            },
          ];
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(punishmentsData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP status ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            setResponseMessage(data.message || 'Punishments created successfully.');
          })
          .catch((error) => {
            setResponseMessage(`Error: ${error.message}`);
          });
      };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContent}>
                <View style={styles.dropdownsWrapper}>
                    <View style={styles.dropdownContainer}>
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
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownList}
                            listMode="SCROLLVIEW"
                            scrollViewProps={{
                                nestedScrollEnabled: true,
                            }}
                            zIndex={3000}
                            zIndexInverse={1000}
                        />
                    </View>

                    <View style={styles.dropdownContainer}>
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
                            style={styles.dropdown2}
                            dropDownContainerStyle={styles.dropdownList2}
                            listMode="SCROLLVIEW"
                            scrollViewProps={{
                                nestedScrollEnabled: true,
                            }}
                            zIndex={2000}
                            zIndexInverse={2000}
                        />
                    </View>

                    <View style={styles.dropdownContainer}>
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
                            style={styles.dropdown3}
                            dropDownContainerStyle={styles.dropdownList3}
                            listMode="SCROLLVIEW"
                            scrollViewProps={{
                                nestedScrollEnabled: true,
                            }}
                            zIndex={1000}
                            zIndexInverse={3000}
                        />
                    </View>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor={'black'}
                        value={search}
                        onChangeText={handleSearch}
                    />
                </View>

                <View style={styles.listContainer}>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : (
                        <FlatList
                            data={filteredData}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.flatListContent}
                            nestedScrollEnabled={true}
                        />
                    )}
                </View>

                <FAB
                    style={styles.fab}
                    icon="content-save"
                    label="Save"
                    onPress={handleSave}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    dropdownsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        zIndex: 3000,
        position: 'relative',
    },
    dropdownContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
    dropdown: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 8,
        borderWidth: 2,
        height: 40,
    },
    dropdown2: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 8,
        borderWidth: 2,
        height: 40,
    },
    dropdown3: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 8,
        borderWidth: 2,
        height: 40,
    },
    dropdownList: {
        backgroundColor: 'white',
        borderColor: 'black',
        position: 'relative',
    },
    dropdownList2: {
        backgroundColor: 'white',
        borderColor: 'black',
        position: 'relative',
    },
    dropdownList3: {
        backgroundColor: 'white',
        borderColor: 'black',
        position: 'relative',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        position: 'relative',
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
        borderWidth: 1,
    },
    fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#b7e7ff',  // Primary color for the button
    borderRadius: 28,
    width: 100,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,  // Shadow for Android
    shadowColor: '#000',  // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 },  // Shadow offset for iOS
    shadowOpacity: 0.25,  // Shadow opacity for iOS
    shadowRadius: 3.5,
    zIndex:100  // Shadow radius for iOS
},
fabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
}
});

export default CMM_Students;