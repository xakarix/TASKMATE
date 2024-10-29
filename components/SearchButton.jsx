import { View, Text, TextInput, TouchableOpacity , Image} from 'react-native'
import React from 'react'
import { useState } from "react";
import { FontAwesome, Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import Colors from '@/constants/Colors';
import { Avatar } from './Avatar';
import { Redirect, router } from 'expo-router'



const SearchButton = ({ avatar, name, bio, onPress, status, ...props }) => {
  const renderButton = () => {
    if (status === 'pending') {
      // Button for 'pending' status
      return (
        <TouchableOpacity
          onPress={null} 
          className='h-6 px-4 mr-2 items-center justify-center bg-primary rounded-[24px]'
          disabled
        >
          <Text className='text-base text-[12px] font-nunitoMedium'>OCZEKUJE</Text>
        </TouchableOpacity>
      );
    } else if (status === 'accepted') {
      // Button for 'accepted' status
      return (
        <TouchableOpacity
          onPress={null} 
          className='h-6 px-4 mr-2 items-center justify-center bg-base border-[1px] border-secondary rounded-[24px]'
          disabled
        >
          <Text className='text-secondary text-[12px] font-nunitoMedium'>ZNAJOMI</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={onPress} 
          className='h-6 px-4 mr-2 items-center justify-center bg-secondary rounded-[24px]'
        >
          <Text className='text-base text-[12px] font-nunitoMedium'>DODAJ</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View className="w-full py-2 bg-base rounded-[16px] mb-4 ">
      <View className='px-6 flex-row items-center pt-2'>
        <Image 
          source={avatar}
          className="w-16 h-16 rounded-full"
          resizeMode='contain'
        />

        <View className='items pl-4 flex-1'>
          <Text className='font-nunitoBold text-l1b text-base-800 mb-1'>{name}</Text>
          <Text className='font-nunitoRegular text-b3r text-base-800  '
            numberOfLines={2} 
            ellipsizeMode='tail'
          >{bio}</Text>
        </View>
      </View>
      <View className='items-end mt-1'>
        {renderButton()}
      </View>
    </View>
  );
}

export default SearchButton;