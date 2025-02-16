// BehaviorSummaryView.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';
import { callurl } from '../apifile';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const BehaviorSummaryView = () => {
  const [behaviorData, setBehaviorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMinute, setSelectedMinute] = useState(null);

  const fetchBehaviorSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${callurl}images/behavior-summary?held_id=1052`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (result.status === 'success') {
        // Convert object to array for FlatList
        const dataArray = Object.entries(result.data).map(([minute, data]) => ({
          minute: parseInt(minute),
          ...data,
        }));
        setBehaviorData(dataArray);
        setSelectedMinute(dataArray[0]?.minute || null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch behavior summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBehaviorSummary();
  }, []);

  const formatMinutes = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m`;
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const renderBehaviorStat = (label, value, color) => (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={[styles.statBar, { backgroundColor: '#F0F0F0' }]}>
        <View 
          style={[
            styles.statFill, 
            { width: `${value * 50}%`, backgroundColor: color }
          ]}
        />
      </View>
      <Text style={styles.statValue}>{formatPercentage(value)}</Text>
    </View>
  );

  const renderFrameItem = ({ item }) => (
    <View style={styles.frameCard}>
      <Image
        source={{ uri: `data:image/jpeg;base64,${item.encoded_image}` }}
        style={styles.frameImage}
        resizeMode="cover"
      />
      <View style={styles.frameBehaviors}>
        {Object.entries(item.behaviors).map(([key, value]) => (
          <Text key={key} style={styles.behaviorText}>
            {key.replace('_count', '').replace('_', ' ')}: {value}
          </Text>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBehaviorSummary}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const selectedData = behaviorData.find(data => data.minute === selectedMinute);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Behavior Summary</Text>
      
      {/* Timeline */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeline}>
        {behaviorData.map((data) => (
          <TouchableOpacity
            key={data.minute}
            style={[
              styles.timelineItem,
              selectedMinute === data.minute && styles.timelineItemSelected
            ]}
            onPress={() => setSelectedMinute(data.minute)}
          >
            <Text style={[
              styles.timelineText,
              selectedMinute === data.minute && styles.timelineTextSelected
            ]}>
              {formatMinutes(data.minute)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedData && (
        <ScrollView style={styles.contentContainer}>
          {/* Frame Images */}
          <Text style={styles.sectionTitle}>Frame Details</Text>
          <FlatList
            data={selectedData.frames}
            renderItem={renderFrameItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    padding: 16,
    textAlign: 'center',
  },
  timeline: {
    flexGrow: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  timelineItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  timelineItemSelected: {
    backgroundColor: '#6C63FF',
  },
  timelineText: {
    fontSize: 14,
    color: '#636E72',
  },
  timelineTextSelected: {
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: {
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#2D3436',
    marginBottom: 4,
  },
  statBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statFill: {
    height: '100%',
    borderRadius: 4,
  },
  statValue: {
    fontSize: 12,
    color: '#636E72',
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 12,
  },
  frameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  frameImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  frameBehaviors: {
    padding: 16,
  },
  behaviorText: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default BehaviorSummaryView;