import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from "react";
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors';

const SearchInput = ({ value, placeholder, handleChangeText, handleSerach, otherStyles, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
  return (
        <View className="w-full h-[48px] px-4 bg-base-100 rounded-[24px] border-base-300 focus:border-primary border-2 items-center flex-row">
            <TextInput 
                className="flex-1 text-base-900 font-nunitoRegular text-[14px] "
                value={value}
                placeholder="Szukaj..."
                placeholderTextColor="#7B7B8B"
                onChangeText={handleChangeText}
                autoCapitalize="none"


            />

            <TouchableOpacity
            onPress={handleSerach}>
                <Ionicons name="search" size={24} color={Colors.n600}  />
            </TouchableOpacity>

        </View>
  )
}

export default SearchInput