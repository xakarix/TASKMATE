import { StatusBar } from 'expo-status-bar';
import { Text, View, FlatList, TouchableOpacity, RefreshControl, Alert, Image, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Redirect, router, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';

import { NotFound, ProfileCard, FriendsButton, Avatar, FormField, CustomButton, SearchButton,SearchInput } from '../../components';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors';
import { getUserImageSource, uploadFile } from '../../services/imageService'
import * as ImagePicker from 'expo-image-picker';


import { useAuth } from '../../context/AuthContext';
import { updateUser } from '../../services/userService';
import {supabase} from '../../lib/supabase';
import { addFriend } from '../../services/friendService'
import {searchUsers} from '../../services/serchingService';


const Search = () => {

  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);



  const handleSearch = async () => {
    const data = await searchUsers(searchTerm, user.id);

    if (data) {
      setSearchResults(data);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddFriend = async (receiverId) => {
    try {
      await addFriend(receiverId);  
      const updatedResults = await searchUsers(searchTerm, user.id);
      setSearchResults(updatedResults || []);
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request.');
    }
  };



  return (
    <SafeAreaView className='h-full bg-base-100 px-6'>
    <View className='items-center mt-6 mb-8'>
      <SearchInput
        value={searchTerm}
        handleChangeText={setSearchTerm}
        handleSerach={handleSearch}
      />
     
    </View>

    <FlatList
      data={searchResults}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (

        <SearchButton
        avatar = {getUserImageSource(item.image)}
        name = {item.name}
        bio = {item.bio}
        onPress={() => handleAddFriend(item.id)} 
        status={item.status}
        >
        </SearchButton>
      )}
      ListEmptyComponent={() => (
        <NotFound
          image="Users"
          title="Brak użytkowników."
          subtitle="Jeszcze nie powstało konto o takiej nazwie."
        />
      )}

      
      />
  </SafeAreaView>
  )
}

export default Search