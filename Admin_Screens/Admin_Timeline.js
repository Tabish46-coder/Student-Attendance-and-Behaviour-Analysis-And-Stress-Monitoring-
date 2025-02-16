import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg';
import { callurl } from '../apifile';

const Admin_Timeline = ({ route }) => {
  const { heldid } = route.params;
  console.log(heldid)
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClassEmotionsGraph();
  }, []); // Fetch data when component mounts

  const fetchClassEmotionsGraph = async () => {
    try {
      const response = await fetch(`${callurl}admin/classEmotions/graph?held_id=${heldid}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        return;
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data!');
      console.error(err);
    }
  };

  // Graph constants
  const PADDING = 40;
  const WIDTH = Dimensions.get('window').width - 40;
  const HEIGHT = 300;
  const GRAPH_HEIGHT = HEIGHT - PADDING * 2;
  const GRAPH_WIDTH = WIDTH - PADDING * 2;

  // Helper functions for graph
  const getX = (value, maxTime) => {
    return PADDING + (value / maxTime) * GRAPH_WIDTH;
  };

  const getY = (value) => {
    return HEIGHT - PADDING - (value / 100) * GRAPH_HEIGHT;
  };

  const createLinePath = (values, timeline) => {
    const maxTime = Math.max(...timeline);
    return values.map((value, index) => {
      const x = getX(timeline[index], maxTime);
      const y = getY(value);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const emotionColors = {
    angry: '#FF4B4B',
    fear: '#00A676',
    happy: '#4CAF50',
    neutral: '#2196F3',
    sad: '#9C27B0',
    surprise: '#FFA726'
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Create grid lines
  const gridLines = [];
  for (let i = 0; i <= 10; i++) {
    const y = getY(i * 10);
    gridLines.push(
      <Line
        key={`horizontal-${i}`}
        x1={PADDING}
        y1={y}
        x2={WIDTH - PADDING}
        y2={y}
        stroke="rgba(0,0,0,0.1)"
        strokeDasharray="4,4"
      />
    );
  }

  data.timeline.forEach((time) => {
    const x = getX(time, Math.max(...data.timeline));
    gridLines.push(
      <Line
        key={`vertical-${time}`}
        x1={x}
        y1={PADDING}
        x2={x}
        y2={HEIGHT - PADDING}
        stroke="rgba(0,0,0,0.1)"
        strokeDasharray="4,4"
      />
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timeline Graph</Text>
      <View style={styles.chartContainer}>
        <Svg width={WIDTH} height={HEIGHT}>
          {/* Grid */}
          {gridLines}

          {/* Y-axis labels */}
          {Array.from({ length: 11 }).map((_, i) => (
            <SvgText
              key={`y-label-${i}`}
              x={PADDING - 5}
              y={getY(i * 10) + 4}
              fontSize="10"
              textAnchor="end"
            >
              {`${i * 10}%`}
            </SvgText>
          ))}

          {/* X-axis labels */}
          {data.timeline.map((time) => (
            <SvgText
              key={`x-label-${time}`}
              x={getX(time, Math.max(...data.timeline))}
              y={HEIGHT - PADDING + 20}
              fontSize="10"
              textAnchor="middle"
            >
              {`${time}s`}
            </SvgText>
          ))}

          {/* Emotion lines */}
          {Object.entries(data.emotions).map(([emotion, values]) => (
            <Path
              key={emotion}
              d={createLinePath(values, data.timeline)}
              stroke={emotionColors[emotion]}
              strokeWidth="2"
              fill="none"
            />
          ))}
        </Svg>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {Object.entries(data.emotions).map(([emotion, values]) => (
          <View key={emotion} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: emotionColors[emotion] }]} />
            <Text style={styles.legendText}>{emotion.toUpperCase()}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.durationText}>Total Duration: {data.total_duration}s</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
  durationText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  }
});

export default Admin_Timeline;