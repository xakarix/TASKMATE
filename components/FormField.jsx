import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from "react";
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors';

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
        <Text className="text-l3r text-base-700 font-nunitoRegular">{title}</Text>
        <View className="w-full h-[48px] px-4 bg-base-100 rounded-[24px] border-base-200 focus:border-primary border-2 items-center flex-row">
            <TextInput 
                className="flex-1 text-base-900 font-nunitoRegular text-[14px] "
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#7B7B8B"
                onChangeText={handleChangeText}
                maxLength={80}
                autoCapitalize="none"
                secureTextEntry={title === "Hasło" && !showPassword}

            />

            {title === 'Hasło' && (
              <TouchableOpacity onPress={() =>
              setShowPassword(!showPassword)}>
                <FontAwesome name={!showPassword ? 'eye' : 'eye-slash'} size={16} color={Colors.n700} />

              </TouchableOpacity>
            )}

        </View>
    </View>
  )
}

export default FormField