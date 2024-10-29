import { TouchableOpacity, Text, View, Image } from 'react-native'
import React from 'react'
import { FontAwesome, Ionicons, MaterialCommunityIcons,Octicons,AntDesign } from '@expo/vector-icons'
import Colors from '@/constants/Colors';


const FriendNotification = ({ avatar, name, onReject, onAccept }) => {
  return (
    <View className='w-full bg-base rounded-[16px] mt-3 '>
      
      <View className='flex-row px-4 justify-between'>

        <View className='items-center flex-row py-4'> 
        <Image 
          source={avatar}
          className="w-14 h-14 rounded-full mr-2"
          resizeMode='contain'
          />
        <View className='items-start justify-center mr-2 space-y-1'>
            <Text className='text-b3r text-base-600 font-nunitoRegular '>Chce zostać twoim znajomym!</Text>
            <Text className='text-l1b text-base-800 font-nunitoBold'>{name}</Text>
        </View>
          </View>
        <View className='flex-row items-end space-x-2 mb-3'>
        <TouchableOpacity 
        onPress={onReject}
        >
            <AntDesign name="closecircleo" size={32} color={Colors.secondary}  />
        </TouchableOpacity>   
        <TouchableOpacity
        onPress={onAccept}
        >
            <AntDesign name="checkcircle" size={32} color={Colors.secondary}  />
        </TouchableOpacity>
        </View>

          </View>
    </View>
  )
}

export default FriendNotification