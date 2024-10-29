import { TouchableOpacity, Text, View, Image } from 'react-native'
import React from 'react'
import { FontAwesome, Ionicons, MaterialCommunityIcons,Octicons,AntDesign } from '@expo/vector-icons'
import Colors from '@/constants/Colors';


const FriendRemover = ({ avatar, name, bio, onReject}) => {
  return (
    <View className='w-full  bg-base rounded-[16px] mt-3 pl-6 pr-3'>
      <View className='justify-between flex-row'>
        <View className='items-center flex-row py-4 '> 

        <Image 
          source={avatar}
          className="w-14 h-14 rounded-full mr-4"
          resizeMode='contain'
          />
        <View className='items-start justify-center space-y-1 w-[150px]'>
            <Text className='text-l1b text-base-800 font-nunitoBold'>{name}</Text>
            <Text className='text-b3r text-base-600 font-nunitoRegular '
           
            >{bio}</Text>
        </View>
          </View>
        <View className='flex-row items-end mb-3 pl-4'>
        <TouchableOpacity 
        onPress={onReject}
        >
            <AntDesign name="closecircleo" size={32} color={Colors.primary}  />
        </TouchableOpacity>   
       
        </View>

          </View>
    </View>
  )
}

export default FriendRemover