import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Tasks = ({navigation}) => {

    const gotoemotionsummary=()=>{
        navigation.navigate('EmotionSummaryView')
    }
    const gotobehavioursummary=()=>{
        navigation.navigate('BehaviorSummaryView')
    }

    const gotolastrowimages=()=>{
        navigation.navigate('LastRowImagesView')
    }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#3498db' }]} onPress={() => gotoemotionsummary()}>
        <Text style={styles.buttonText}>Emotion</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#2ecc71' }]} onPress={() => gotobehavioursummary()}>
        <Text style={styles.buttonText}>Behaviour</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#e74c3c' }]} onPress={() => gotolastrowimages()}>
        <Text style={styles.buttonText}>Last row</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Tasks;
