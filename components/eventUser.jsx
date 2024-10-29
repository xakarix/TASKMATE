import { TouchableOpacity, Text, View, Image } from 'react-native'
import React from 'react'
import { FontAwesome, Ionicons, MaterialCommunityIcons,Octicons,AntDesign } from '@expo/vector-icons'
import Colors from '@/constants/Colors';


const EventUser = ({ avatar, name, isAdded, onToggle }) => {
  return (
    <View className='w-full bg-base rounded-[16px] mt-3 px-4 '>
      <View className='justify-between items-center flex-row w-full'>
        <View className='items-center flex-row py-4'>
          <Image
            source={avatar}
            className="w-10 h-10 rounded-full mr-4"
            resizeMode='contain'
          />
          <View className='items-start justify-center space-y-1'>
            <Text className='text-l1b text-base-800 font-nunitoBold'>{name}</Text>
          </View>
        </View>
        <View className='flex-row items-end'>
          <TouchableOpacity onPress={onToggle}>
            <AntDesign
              name={isAdded ? "minuscircleo" : "pluscircle"}
              size={32}
              color={isAdded ? Colors.primary : Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


export default EventUser