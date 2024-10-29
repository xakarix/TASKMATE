import { StatusBar } from 'expo-status-bar';
import { Image, Text, View, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Redirect, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import { NotFound, ProfileCard, FriendsButton, FriendNotification } from '../../components';
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors';
import { getUserImageSource } from '../../services/imageService'
import { loadNotifications, handleReject, handleAccept } from '../../services/notificationsService';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { searchUsers } from '../../services/serchingService';

const Notifications = () => {

  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      await loadNotifications(setNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (

    <SafeAreaView className="h-full w-full bg-base-100 space-y-4 mt-6 px-4">
      
      <Text className="text-base-800 font-nunitoBold text-h2 text-center">POWIADOMIENIA</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (

          <FriendNotification
            avatar={getUserImageSource(item.image)}
            name={item.name}
            onReject={() => handleReject(item.id, fetchNotifications)}
            onAccept={() => handleAccept(item.id, fetchNotifications)}
          />

        )}

        ListEmptyComponent={() => (
          <NotFound
            image="Notifications"
            title="Brak powiadomień."
            subtitle="Nie otrzymałeś żadnego powiadomienia."
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      />

    </SafeAreaView>
  )
}

export default Notifications