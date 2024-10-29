import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../constants';

const NotFound = ({image, title, subtitle}) => {
  return (
    <View className='justify-center items-center h-full mt-6'>
        <Image
        source={images[image]}
        className="w-[256px] h-[192px] mb-8"
        resizeMode='contain'/>
        <Text className="text-h3 text-base-800 font-nunitoBold mt-4">{title}</Text>
        <Text className="text-b3r text-base-500 font-nunitoSemiBold">{subtitle}</Text>

    </View>
  )
}

export default NotFound