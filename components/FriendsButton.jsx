import { TouchableOpacity, Text, View } from 'react-native'
import React from 'react'
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import Colors from '@/constants/Colors';


const FriendsButton = ({ handlePress, count }) => {
  return (
    <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.7}
        className={`bg-base rounded-[16px] min-h-[68px] w-full mt-6 px-6
        flex-row items-center justify-between`}

        
        >
      <Text className={`text-primary text-center font-nunitoBold text-h3  `}>ZNAJOMI</Text>
      <View className='flex-row items-baseline'>
        <FontAwesome name='group' size={24} color={Colors.primary} />

      </View>

    </TouchableOpacity>
  )
}

export default FriendsButton