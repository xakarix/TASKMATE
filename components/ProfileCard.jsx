import { View, Text, TextInput, TouchableOpacity , Image} from 'react-native'
import React from 'react'
import { useState } from "react";
import { FontAwesome, Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import Colors from '@/constants/Colors';
import { Avatar } from './Avatar';
import { Redirect, router } from 'expo-router'



const ProfileCard = ({ avatar, name, description, otherStyles, ...props }) => {

  return (
        <View className="w-full pb-6 bg-base rounded-[16px]">
            <View className='items-end mt-2'>
            <TouchableOpacity
              onPress={() => router.push('/editProfile')}
              >
              <MaterialCommunityIcons name='square-edit-outline' size={24} color={Colors.primary} style={{ paddingRight: 8 }} />
            </TouchableOpacity>
            </View>
            <View className='px-6 flex-row items-center '>
            <Image 
            source={avatar}
            className="w-16 h-16 rounded-full"
            resizeMode='contain'
            />

            <View className='items-start pl-4 flex-1 '>
                <Text className='font-nunitoBold text-l2b text-base-800 mb-2'>{name}</Text> 
                <Text className='font-nunitoRegular text-b3r text-base-800 '
                numberOfLines={2} 
                ellipsizeMode='tail'
                >{description}</Text> 

            </View>

            </View>

        </View>
  )
}

export default ProfileCard