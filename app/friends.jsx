import { StatusBar } from 'expo-status-bar';
import { Image, Text, View, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { NotFound, FriendRemover } from '../components';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { loadFriends, removeFriend } from '../services/friendService';
import { getUserImageSource } from '../services/imageService';
import { useAuth } from '../context/AuthContext';

const Friends = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [getFriends, setGetFriends] = useState([]); 
  const [refreshing, setRefreshing] = useState(false);


  const fetchFriends = async () => {
    if (user && user.id) {
      try {
        await loadFriends(user.id, setGetFriends); 
      } catch (error) {
        console.error('Błąd ładowania przyjaciół:', error);
      }
    }
  };

  const handleReject = async (friendId) => {
    try {
      await removeFriend(user.id, friendId); 
      setGetFriends(prevFriends => prevFriends.filter(friend => friend.id !== friendId));
      Alert.alert('Sukces', 'Znajomy został usunięty');
    } catch (error) {
      console.error('Błąd usuwania znajomego:', error.message || error);
      Alert.alert('Błąd', `Nie udało się usunąć znajomego: ${error.message || error}`);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFriends();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFriends();
  }, [user]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="h-full w-full bg-base-100 mb-6 px-6">
      <View className='w-full items-end'>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name='arrow-back' size={24} color={Colors.n400} />
        </TouchableOpacity>
      </View>
      <View className='items-center'>
        <Text className="text-base-800 font-nunitoBold text-h2">ZNAJOMI</Text>
      </View>
      <FlatList
        data={getFriends} 
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FriendRemover
            avatar={getUserImageSource(item.image)}
            name={item.name}
            bio={item.bio}
            onReject={() => handleReject(item.id)}
          />
        )}
        ListEmptyComponent={() => (
          <NotFound
            image="Friends"
            title="Brak znajomych."
            subtitle="Nie posiadasz jeszcze żadnego znajomego."
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
  );
};

export default Friends;
