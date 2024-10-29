import { TouchableOpacity, Text, View } from 'react-native'
import React from 'react'
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import Colors from '@/constants/Colors';


const EventButton = ({ title, handlePress, count, taskCompleted }) => {

  let statusEmoji = '';
  if (taskCompleted) {
    statusEmoji = '✅';
  } else {
    statusEmoji = '❌';
  }


  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-base rounded-[16px] min-h-[68px] w-full my-2 px-6 
        flex-row items-center justify-between`}

    >
      <View className='flex-row space-x-4  items-center justify-center '>
        <Text className={`text-base-800 font-nunitoBold text-l1b  py-2 text-center`}>{statusEmoji}</Text>
        <Text className={`text-base-700  font-nunitoBold text-h4  py-2`}>{title}</Text>
      </View>
      <View className='flex-row items-baseline '>
        <FontAwesome name='group' size={24} color={Colors.secondary} />
        <Text className={`text-secondary font-nunitoSemiBold text-l3r ml-1`}>{count}</Text>

      </View>

    </TouchableOpacity>
  )
}

export default EventButton