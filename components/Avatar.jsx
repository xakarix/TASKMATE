import { StyleSheet, Text, resizeMode, Image } from 'react-native'
import React from 'react'
//import { Image } from 'expo-image';
import { getUserImageSource } from '../services/imageService'

const Avatar = ({ uri }) => {
  return (
    <Image
        source={getUserImageSource(uri)}
    
            className="w-16 h-16 rounded-full"
            resizeMode='contain'
        />
  )
}

export default Avatar

