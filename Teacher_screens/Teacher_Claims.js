import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { callurl } from '../apifile';

const Teacher_Claims = ({navigation, route}) => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  
  const {user} = route.params;

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `${callurl}claims?`;
      if (selectedStatus) {
        url += `status=${selectedStatus}&`;
      }
      if (user) {
        url += `resolved_by=${user}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      console.log(data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch claims');
      }

      setClaims(data.claims || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [selectedStatus]);

  const gotoclaimdetails=(student,held,dates,ids)=>{
     navigation.navigate("Teacher_Claim_Details",{student_id:student,held_id:held,date:dates,id:ids})
  }


  const renderClaimItem = ({ item }) => {
    // Determine status color
    const statusColor = item.status === 'Pending' ? '#FFD700' : '#008000';
    
    // Determine which image to use
    const statusImage = item.status === 'Pending' 
      ? require('../assets/pending.png')
      : require('../assets/resolved.png');

    return (
      <View style={styles.claimCard}>
        <TouchableOpacity onPress={()=>{gotoclaimdetails(item.student_id,item.held_id,item.created_at,item.id)}}>
        <View style={styles.cardContent}>
          <View style={[styles.statusBar, { backgroundColor: statusColor }]} />
          
          <View style={styles.detailsContainer}>
            <Text style={styles.dateText}>{item.created_at}</Text>
            <Text style={{color:'black',marginBottom:5,fontSize:16,fontWeight:'bold'}}>Resolved by: {item.resolved_by}</Text>
            <Text>Reason: {item.reason}</Text>
          </View>

          <View style={styles.statusContainer}>
            <Image 
              source={statusImage} 
              style={styles.statusImage}
            />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.contentContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.contentContainer}>
          <Text style={styles.error}>{error}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={claims}
        renderItem={renderClaimItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.contentContainer}>
            <Text style={styles.emptyText}>No claims found</Text>
          </View>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={{marginLeft:20,fontWeight:'bold',fontSize:16,color:'black'}}>Filter by Status: </Text>
        <Picker
          selectedValue={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value)}
          style={styles.picker}
        >
          <Picker.Item label="All Claims" value="" />
          <Picker.Item label="Pending" value="Pending" />
          <Picker.Item label="Resolved" value="Resolved" />
        </Picker>
      </View>

      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection:'row',
    alignItems:'center',

  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    height: 50,
    width:150
  },
  listContainer: {
    padding: 16,
    flexGrow: 1, // This ensures the container takes up available space
  },
  
  claimTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#666',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBar: {
    width: 20,
    height: '100%', // This ensures the color bar extends full height
    minHeight: 100, // Minimum height to ensure visibility
  },
  detailsContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  dateText: {
    marginBottom: 5,
  },
  statusContainer: {
    alignItems: 'center',
    marginLeft: 20,
    padding:10
  },
  statusImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  statusText: {
    marginTop: 20,
    color:'black'
  },
  claimCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden', 
    // This ensures the status bar doesn't overflow
  },
});

export default Teacher_Claims;