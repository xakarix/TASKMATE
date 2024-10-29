import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.7}
        className={`bg-secondary rounded-[24px] min-h-[40px] 
        justify-center items-center 
        ${containerStyles}
        ${isLoading ? 'opacity-50' : ''}`}
        disabled={isLoading}
        
        >
        

      <Text className={`text-base font-nunitoMedium text-[16px] ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton