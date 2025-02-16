// LastRowImagesView.js
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
  Modal,
} from 'react-native';
import { callurl } from '../apifile';
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

const LastRowImagesView = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLastRowImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${callurl}images/last-row?held_id=1052`,
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
        setImages(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch last row images');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLastRowImages();
  }, []);

  const renderImageCard = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => setSelectedImage(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Attendance Image {index + 1}</Text>
        <View style={styles.indexBadge}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
      </View>
      {item.encoded_image ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.encoded_image}` }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>Image not available</Text>
        </View>
      )}
      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>Attendance ID: {item.attendance_id}</Text>
      </View>
    </TouchableOpacity>
  );

  const ImageModal = () => (
    <Modal
      visible={selectedImage !== null}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setSelectedImage(null)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setSelectedImage(null)}
      >
        <View style={styles.modalContent}>
          {selectedImage?.encoded_image && (
            <Image
              source={{ uri: `data:image/jpeg;base64,${selectedImage.encoded_image}` }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (loading && !refreshing) {
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchLastRowImages}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Last Row Attendance</Text>
      <FlatList
        data={images}
        renderItem={renderImageCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No last row images available</Text>
        }
      />
      <ImageModal />
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
  listContainer: {
    padding: 16,
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  indexBadge: {
    backgroundColor: '#6C63FF',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#F8F9FA',
  },
  noImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 16,
    color: '#636E72',
  },
  cardFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerText: {
    fontSize: 14,
    color: '#636E72',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  modalImage: {
    width: '100%',
    height: 400,
    borderRadius: 8,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#6C63FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
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
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#636E72',
    marginTop: 24,
  },
});

export default LastRowImagesView;