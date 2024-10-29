import React, { useState, useEffect } from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Image } from 'react-native';
import { fetchEventParticipants, fetchParticipantsDetails, fetchEventDetails } from '../services/eventService';



const ParticipantButtonDetails = ({ image, name, streaks }) => {


    return (
       <View className='h-[48px] px-2 my-2 justify-between items-center flex-row'>
        <View className='flex-row items-center'>
        <Image 
            source={image}
            className="w-11 h-11 rounded-full"
            resizeMode='contain'
            />
        <Text className='ml-4 text-b1b text-base-800 font-nunitoSemiBold'>{name}</Text>
        </View>
        <View className='flex-row items-center'>

        {/* <Text className='text-l2r text-base-800 font-nunitoMedium'>14</Text> */}
        <Text className='text-l2r text-base-800 font-nunitoMedium'>{streaks}</Text>
        <Text className='text-l1r text-base-800 font-nunitoRegular'>🔥</Text>
        </View>

       </View>
    )
}

export default ParticipantButtonDetails