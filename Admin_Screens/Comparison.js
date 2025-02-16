import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';

const ComparisonChartScreen = () => {
  // ----- Data Initialization -----
  const classAData = {
    timeline: { start: 0, end: 10 },
    structuredData: {
      0: { happy: 2, sad: 5, angry: 1, neutral: 3 },
      1: { happy: 3, sad: 4, angry: 2, neutral: 4 },
      2: { happy: 6, sad: 3, angry: 2, neutral: 5 },
      3: { happy: 8, sad: 1, angry: 5, neutral: 2 },
      4: { happy: 10, sad: 2, angry: 3, neutral: 6 },
      5: { happy: 9, sad: 3, angry: 4, neutral: 7 },
      6: { happy: 7, sad: 6, angry: 2, neutral: 4 },
      7: { happy: 11, sad: 3, angry: 1, neutral: 5 },
      8: { happy: 5, sad: 4, angry: 2, neutral: 3 },
      9: { happy: 8, sad: 1, angry: 4, neutral: 6 },
      10: { happy: 4, sad: 2, angry: 3, neutral: 4 },
    },
  };

  const classBData = {
    timeline: { start: 0, end: 8 },
    structuredData: {
      0: { happy: 1, sad: 7, angry: 0, neutral: 2 },
      1: { happy: 5, sad: 3, angry: 1, neutral: 3 },
      2: { happy: 2, sad: 5, angry: 2, neutral: 4 },
      3: { happy: 6, sad: 2, angry: 2, neutral: 3 },
      4: { happy: 9, sad: 4, angry: 1, neutral: 5 },
      5: { happy: 7, sad: 2, angry: 5, neutral: 4 },
      6: { happy: 5, sad: 1, angry: 3, neutral: 2 },
      7: { happy: 11, sad: 6, angry: 4, neutral: 3 },
      8: { happy: 10, sad: 3, angry: 2, neutral: 4 },
    },
  };

  const [emotionToggles, setEmotionToggles] = useState({
    happy: true,
    sad: true,
    angry: true,
    neutral: true,
  });

  // Chart dimensions and padding
  const CHART_WIDTH = Dimensions.get('window').width * 1.5;
  const CHART_HEIGHT = 300;
  const PADDING = 40;
  const USABLE_WIDTH = CHART_WIDTH - (PADDING * 2);
  const USABLE_HEIGHT = CHART_HEIGHT - (PADDING * 2);

  // Get the maximum timeline and value
  const maxTimeline = Math.max(classAData.timeline.end, classBData.timeline.end);
  const getMaxValue = () => {
    let max = 0;
    [classAData, classBData].forEach(classData => {
      Object.values(classData.structuredData).forEach(minute => {
        Object.entries(minute).forEach(([emotion, value]) => {
          if (emotionToggles[emotion] && value > max) max = value;
        });
      });
    });
    return max;
  };

  // Scale helpers
  const scaleX = (value) => (value / maxTimeline) * USABLE_WIDTH + PADDING;
  const scaleY = (value) => CHART_HEIGHT - (value / getMaxValue() * USABLE_HEIGHT) - PADDING;

  // Generate path for a line
  const generatePath = (classData, emotion) => {
    let pathData = '';
    for (let i = 0; i <= classData.timeline.end; i++) {
      const value = classData.structuredData[i]?.[emotion] || 0;
      const x = scaleX(i);
      const y = scaleY(value);
      pathData += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
    }
    return pathData;
  };

  // Color helpers
  const getEmotionColor = (emotion, isClassA) => {
    const colors = {
      happy: isClassA ? '#FF6B6B' : '#FF8787',
      sad: isClassA ? '#4D96FF' : '#6BA6FF',
      angry: isClassA ? '#FFA94D' : '#FFB969',
      neutral: isClassA ? '#868E96' : '#ADB5BD',
    };
    return colors[emotion] || '#000000';
  };

  // Generate grid lines
  const gridLines = () => {
    const lines = [];
    // Vertical lines
    for (let i = 0; i <= maxTimeline; i++) {
      const x = scaleX(i);
      lines.push(
        <Line
          key={`v-${i}`}
          x1={x}
          y1={PADDING}
          x2={x}
          y2={CHART_HEIGHT - PADDING}
          stroke="#E9ECEF"
          strokeWidth="1"
        />
      );
      // X-axis labels
      lines.push(
        <SvgText
          key={`x-label-${i}`}
          x={x}
          y={CHART_HEIGHT - 10}
          fontSize="12"
          fill="#495057"
          textAnchor="middle"
        >
          {i}
        </SvgText>
      );
    }

    // Horizontal lines
    const maxVal = getMaxValue();
    for (let i = 0; i <= 5; i++) {
      const y = scaleY((maxVal / 5) * i);
      lines.push(
        <Line
          key={`h-${i}`}
          x1={PADDING}
          y1={y}
          x2={CHART_WIDTH - PADDING}
          y2={y}
          stroke="#E9ECEF"
          strokeWidth="1"
        />
      );
      // Y-axis labels
      lines.push(
        <SvgText
          key={`y-label-${i}`}
          x={PADDING - 10}
          y={y + 4}
          fontSize="12"
          fill="#495057"
          textAnchor="end"
        >
          {Math.round((maxVal / 5) * i)}
        </SvgText>
      );
    }
    return lines;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Emotion Comparison Across Classes</Text>

      <View style={styles.toggleContainer}>
        {Object.keys(emotionToggles).map((emotion) => (
          <View key={emotion} style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{emotion.toUpperCase()}</Text>
            <Switch
              value={emotionToggles[emotion]}
              onValueChange={(value) =>
                setEmotionToggles((prev) => ({ ...prev, [emotion]: value }))
              }
            />
          </View>
        ))}
      </View>

      <ScrollView horizontal>
        <View>
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            {/* Grid lines */}
            {gridLines()}

            {/* Data lines */}
            {Object.keys(emotionToggles).map((emotion) => {
              if (!emotionToggles[emotion]) return null;
              return (
                <React.Fragment key={emotion}>
                  {/* Class A line */}
                  <Path
                    d={generatePath(classAData, emotion)}
                    stroke={getEmotionColor(emotion, true)}
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Class B line */}
                  <Path
                    d={generatePath(classBData, emotion)}
                    stroke={getEmotionColor(emotion, false)}
                    strokeWidth="2"
                    fill="none"
                  />
                </React.Fragment>
              );
            })}
          </Svg>
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {Object.keys(emotionToggles).map((emotion) => (
          <View key={emotion} style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColor,
                  { backgroundColor: getEmotionColor(emotion, true) }
                ]}
              />
              <Text style={styles.legendText}>Class A - {emotion}</Text>
            </View>
            <View style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColor,
                  { backgroundColor: getEmotionColor(emotion, false) }
                ]}
              />
              <Text style={styles.legendText}>Class B - {emotion}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  toggleContainer: {
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  toggleLabel: {
    fontSize: 16,
  },
  legendContainer: {
    marginTop: 16,
    paddingHorizontal: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
  },
});

export default ComparisonChartScreen;