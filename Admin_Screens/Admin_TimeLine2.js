import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { callurl } from '../apifile';

const EMOTIONS = {
  ANGRY: { color: '#FF4B4B', key: 'angry' },
  HAPPY: { color: '#4CAF50', key: 'happy' },
  NEUTRAL: { color: '#9E9E9E', key: 'neutral' },
  SAD: { color: '#2196F3', key: 'sad' },
  SURPRISE: { color: '#FF9800', key: 'surprise' }
};

const EmotionalAnalysis = ({route}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interval, setInterval] = useState(1);
  const navigation = useNavigation();
  const windowWidth = Dimensions.get('window').width;
  const { heldid } = route.params;

  useEffect(() => {
    fetchData();
  }, [heldid]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${callurl}emotions/structured?held_id=${heldid}`);
      const result = await response.json();
      
      if (result.status === "success" && result.data) {
        setData(result.data);
        const mid = Math.floor((result.data.timeline.end - result.data.timeline.start) / 2);
        setInterval(mid);
      } else {
        setError(result.message || 'Failed to load data');
      }
    } catch (error) {
      setError('Failed to fetch emotional data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHighestEmotion = (timeData) => {
    if (!timeData) return { emotion: '', percentage: 0 };
    
    let highest = { emotion: '', count: 0 };
    Object.entries(timeData).forEach(([emotion, count]) => {
      if (count > highest.count) {
        highest = { emotion, count };
      }
    });
    
    const total = Object.values(timeData).reduce((sum, count) => sum + count, 0);
    const percentage = total ? (highest.count / total) * 100 : 0;
    
    return { emotion: highest.emotion, percentage };
  };

  const calculatePointsWithPercentages = (emotionKey) => {
    if (!data) return { points: [], highestPoint: null };
    
    const points = Object.entries(data.structured_data)
      .filter(([minute]) => parseInt(minute) >= interval - 2 && parseInt(minute) <= interval + 2)
      .map(([minute, emotions]) => {
        const total = Object.values(emotions).reduce((sum, count) => sum + count, 0);
        const percentage = total ? (emotions[emotionKey] / total) * 100 : 0;
        return {
          x: ((parseInt(minute) - (interval - 2)) / 4) * (windowWidth - 40),
          y: 150 - (emotions[emotionKey] * 20),
          percentage
        };
      });

    if (points.length < 2) return { points: [], highestPoint: null };

    const highestPoint = points.reduce((max, point) => 
      point.percentage > (max?.percentage || 0) ? point : max
    , null);

    return { points, highestPoint };
  };

  const createPath = (points) => {
    if (points.length === 0) return '';
    return points.reduce((path, point, i) => {
      return path + `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    }, '');
  };

  const renderEmotionLabels = () => (
    <View style={styles.emotionLabels}>
      {Object.entries(EMOTIONS).map(([name, { color }]) => (
        <View key={name} style={styles.emotionLabel}>
          <View style={[styles.colorDot, { backgroundColor: color }]} />
          <Text style={styles.emotionText}>{name}</Text>
        </View>
      ))}
    </View>
  );

  const renderGraph = () => (
    <Svg width={windowWidth - 40} height={200}>
      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Line
          key={`grid-${i}`}
          x1={0}
          y1={i * 40}
          x2={windowWidth - 40}
          y2={i * 40}
          stroke="#E0E0E0"
          strokeWidth="1"
        />
      ))}
      
      {/* Time labels */}
      {[interval - 2, interval - 1, interval, interval + 1, interval + 2].map((time, i) => (
        <SvgText
          key={`time-${i}`}
          x={(i * (windowWidth - 40) / 4)}
          y={190}
          fontSize="12"
          fill="#666"
          textAnchor="middle"
        >
          {time}
        </SvgText>
      ))}
      
      {/* Emotion lines and dots */}
      {Object.entries(EMOTIONS).map(([_, { color, key }]) => {
        const { points, highestPoint } = calculatePointsWithPercentages(key);
        return (
          <React.Fragment key={key}>
            <Path
              d={createPath(points)}
              stroke={color}
              strokeWidth="4"
              fill="none"
            />
            {highestPoint && (
              <>
                <Circle
                  cx={highestPoint.x}
                  cy={highestPoint.y}
                  r="6"
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                />
                <SvgText
                  x={highestPoint.x}
                  y={highestPoint.y - 10}
                  fontSize="12"
                  fill={color}
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {highestPoint.percentage.toFixed(1)}%
                </SvgText>
              </>
            )}
          </React.Fragment>
        );
      })}
    </Svg>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentTimeData = data?.structured_data?.[interval];
  const highestEmotion = getHighestEmotion(currentTimeData);

  return (
    <View style={styles.container}>
      {renderEmotionLabels()}
      
      <Text style={styles.title}>Timeline Graph</Text>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>{interval} min</Text>
        <Text style={[styles.statText, { color: EMOTIONS[highestEmotion.emotion.toUpperCase()]?.color }]}>
          {highestEmotion.emotion.toUpperCase()}: {highestEmotion.percentage.toFixed(1)}%
        </Text>
      </View>

      <View style={styles.graphContainer}>
        {renderGraph()}
      </View>

      <Slider
        style={styles.slider}
        minimumValue={data?.timeline?.start || 0}
        maximumValue={data?.timeline?.end || 30}
        value={interval}
        onValueChange={setInterval}
        step={1}
        minimumTrackTintColor="#4CAF50"
        maximumTrackTintColor="#E0E0E0"
        thumbTintColor="#4CAF50"
      />

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('StudentEmotionAnalysis', { heldid })}
      >
        <Text style={styles.buttonText}>Detailed Analysis of Students</Text>
      </TouchableOpacity>

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  emotionLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  emotionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  emotionText: {
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  statText: {
    fontSize: 16,
    fontWeight: '500',
  },
  graphContainer: {
    height: 200,
    marginBottom: 20,
  },
  slider: {
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  orangeButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF4B4B',
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
});

export default EmotionalAnalysis;