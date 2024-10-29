import { StatusBar } from 'expo-status-bar';
import { Image, Text, View, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import React, { useState,  useEffect  } from 'react';
import { Redirect, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import { NotFound, ProfileCard, FriendsButton, EventButton, EventButtonDetails } from '../../components';
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors';
import { getUserImageSource } from '../../services/imageService'
import { fetchEvents, updateTaskCompletionStatus } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import {supabase} from '../../lib/supabase';


const Profile = () => {
  
  const {user, setAuth} = useAuth();
  const name = user?.name || 'Guest';
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  let avatar = getUserImageSource(user?.image);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const description = user?.bio || 'No description available';

  
  const loadEvents = async () => {
    try {
      await updateTaskCompletionStatus();
      const eventsData = await fetchEvents(user?.id);
      setEvents(eventsData);
  
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  

  const handleEventPress = (eventId) => {
    setSelectedEventId(eventId);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedEventId(null);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error('Wylogowanie nie powiodło się.');
      }
  
      setAuth(null); 
      router.replace("/sign-in");
  
    } catch (error) {
      console.error('Error during logout:', error.message);
      Alert.alert('Błąd', 'Wystąpił problem podczas wylogowywania. Spróbuj ponownie później.');
    }
  };
 
  useEffect(() => {
    loadEvents();
  }, []);
  
  return (
    <SafeAreaView className="h-full bg-base-100 px-4">
     <View className='items-end '>
      <TouchableOpacity
              onPress={logout}
              className="mb-6"
              >
        <Ionicons name='log-out-outline' size={24} color={Colors.n400}  />
      </TouchableOpacity>
      </View>
      <ProfileCard
      avatar={avatar}
      name={name}
      description={description}>
        
      </ProfileCard>

      <FriendsButton
      handlePress={() => router.push('/friends')}
      />

      <Text className="text-h3 text-base-800 font-nunitoBold pl-6 mt-6 mb-2">WYZWANIA</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventButton
            title={item.title}
            count={item.participants}
            taskCompleted={item.task_completed}
            handlePress={() => handleEventPress(item.id)}
          />
        )}
        ListEmptyComponent={() => (
          <NotFound
            image="Events"
            title="Brak wyzwań."
            subtitle="Ukończ wyzwanie jako pierwszy!"
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
          {selectedEventId && (
            <EventButtonDetails
              visible={modalVisible}
              onClose={handleCloseModal}
              eventId={selectedEventId}
            />
          )}
    </SafeAreaView>
  )
}

export default Profile

