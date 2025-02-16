import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Searchbar, Menu, IconButton } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { callurl } from '../apifile';

const THEME_COLORS = {
  primary: '#078345',
  secondary: '#f39c12',
  success: '#2ecc71',
  danger: '#e74c3c',
  warning: '#f1c40f',
  info: '#3498db',
  light: '#f5f6fa',
  dark: '#2c3e50',
  gray: '#36B35F',
  white: '#ffffff'
};

const CMM_Voilations_Details = ({navigation, route}) => {
  const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');

  // Existing fetch, search, and sort functions remain the same...
  const fetchViolations = async () => {
    setLoading(true);
    try {
      const url = `${callurl}/violations`;
      const response = await fetch(url, {
        method: 'GET',
      });
      const data = await response.json();
      
      if (response.ok) {
        setViolations(data.violations || []);
        setFilteredViolations(data.violations || []);
        if (data.violations?.length === 0) {
          Alert.alert('Info', 'No violations found');
        }
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch violations');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = violations.filter(violation => 
      violation.violation_type.toLowerCase().includes(query.toLowerCase()) ||
      violation.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredViolations(filtered);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    setMenuVisible(false);
    
    const sorted = [...filteredViolations].sort((a, b) => {
      const dateA = new Date(a.reported_at);
      const dateB = new Date(b.reported_at);
      return order === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredViolations(sorted);
  };

  const Violation_Details = (id, type, desc, dates, reportby) => {
    navigation.navigate("CMM_Voilation_expand", {
      voilationid: id,
      voilationtype: type,
      voilationdesc: desc,
      voilationdate: dates,
      voilationby: reportby
    });
  };

 
  
  const getViolationConfig = (type) => {
    const configs = {
      'High': {
        color: THEME_COLORS.danger,
        icon: 'exclamation-triangle',
        backgroundColor: `${THEME_COLORS.danger}15`
      },
      'Medium': {
        color: THEME_COLORS.warning,
        icon: 'exclamation-circle',
        backgroundColor: `${THEME_COLORS.warning}15`
      },
      'Low': {
        color: THEME_COLORS.success,
        icon: 'info-circle',
        backgroundColor: `${THEME_COLORS.success}15`
      },
      'default': {
        color: THEME_COLORS.gray,
        icon: 'question-circle',
        backgroundColor: `${THEME_COLORS.gray}15`
      }
    };
    return configs[type] || configs.default;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderViolation = ({ item }) => {
    const config = getViolationConfig(item.violation_type);
    
    return (
      <TouchableOpacity
        onPress={() => Violation_Details(
          item.violation_id,
          item.violation_type,
          item.description,
          item.reported_at,
          item.reported_by
        )}
      >
        <View style={[styles.card, { backgroundColor: config.backgroundColor }]}>
          <View style={[styles.priorityIndicator, { backgroundColor: config.color }]} />
          <View style={styles.cardInner}>
            <View style={styles.cardHeader}>
              <View style={styles.headerLeft}>
                <FontAwesome5 
                  name={config.icon}
                  size={20}
                  color={config.color}
                  style={styles.violationIcon}
                />
                <View>
                  <Text style={[styles.violationType, { color: config.color }]}>
                    {item.violation_type}
                  </Text>
                  <Text style={styles.dateText}>
                    <FontAwesome5 name="calendar-alt" size={12} color={THEME_COLORS.gray} />
                    {' '}{formatDate(item.reported_at)}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.descriptionContainer}>
              <FontAwesome5 name="file-alt" size={14} color={THEME_COLORS.gray} style={styles.descriptionIcon} />
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            
            <View style={styles.footer}>
              <View style={styles.reportedByContainer}>
                <FontAwesome5 name="user-circle" size={16} color={THEME_COLORS.primary} />
                <Text style={styles.reportedByText}>{item.reported_by}</Text>
              </View>
              <View style={styles.actionButton}>
                <Text style={styles.actionButtonText}>View Details</Text>
                <FontAwesome5 name="chevron-right" size={12} color={THEME_COLORS.primary} />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <FontAwesome5 name="exclamation-circle" size={24} color={THEME_COLORS.primary} />
          <Text style={styles.title}>Violations</Text>
        </View>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search violations..."
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchBar}
            iconColor={THEME_COLORS.primary}
            placeholderTextColor={THEME_COLORS.gray}
            inputStyle={{ color: THEME_COLORS.dark }}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon={({ size, color }) => (
                  <FontAwesome5 
                    name={sortOrder === 'newest' ? 'sort-amount-down' : 'sort-amount-up'} 
                    size={18} 
                    color={THEME_COLORS.primary}
                  />
                )}
                size={24}
                onPress={() => setMenuVisible(true)}
                style={styles.sortButton}
              />
            }
          >
            <Menu.Item 
              onPress={() => handleSort('newest')} 
              title="Newest First"
              leadingIcon={() => <FontAwesome5 name="sort-amount-down" size={16} color={THEME_COLORS.primary} />}
            />
            <Menu.Item 
              onPress={() => handleSort('oldest')} 
              title="Oldest First"
              leadingIcon={() => <FontAwesome5 name="sort-amount-up" size={16} color={THEME_COLORS.primary} />}
            />
          </Menu>
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <Text style={styles.loadingText}>Loading violations...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredViolations}
          keyExtractor={(item) => item.violation_id.toString()}
          renderItem={renderViolation}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <View style={styles.noRecords}>
              <FontAwesome5 name="clipboard-check" size={48} color={THEME_COLORS.gray} />
              <Text style={styles.noRecordsText}>No violations found</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.light,
  },
  header: {
    padding: 16,
    backgroundColor: THEME_COLORS.white,
    elevation: 4,
    shadowColor: THEME_COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_COLORS.dark,
    marginLeft: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    elevation: 0,
    backgroundColor: THEME_COLORS.light,
    borderRadius: 12,
    marginRight: 8,
    height: 46,
  },
  sortButton: {
    backgroundColor: THEME_COLORS.light,
    borderRadius: 12,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: THEME_COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  priorityIndicator: {
    width: 4,
  },
  cardInner: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  violationIcon: {
    marginRight: 12,
  },
  violationType: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: THEME_COLORS.gray,
    marginTop: 4,
  },
  descriptionContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  descriptionIcon: {
    marginRight: 8,
    marginTop: 4,
  },
  description: {
    flex: 1,
    fontSize: 14,
    color: THEME_COLORS.dark,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  reportedByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportedByText: {
    fontSize: 13,
    color: THEME_COLORS.dark,
    marginLeft: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${THEME_COLORS.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  actionButtonText: {
    fontSize: 12,
    color: THEME_COLORS.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: THEME_COLORS.gray,
    fontSize: 14,
  },
  noRecords: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 48,
  },
  noRecordsText: {
    fontSize: 16,
    color: THEME_COLORS.gray,
    marginTop: 16,
  },
});

export default CMM_Voilations_Details;