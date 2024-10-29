import { View, Text, ScrollView, Dimensions, Alert, Image } from 'react-native'
import React from 'react'
import { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'


import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { supabase } from '../../lib/supabase';


const SignUp = () => {

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const register = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Wypełnij wszystkie okna.");
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.username,
        }
      }

    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      router.replace('/home')
    }
  }

  return (
    <SafeAreaView className="bg-base-200 h-full">
      <ScrollView>
        <View className="w-full justify-start min-h-[85hv] px-12 top-[96px]">
          <View className='flex-row items-center justify-center '>
            <Text className='text-[48px] text-base-800 font-nunitoExtraBold'>TASK</Text>
            <Text className='text-[48px] text-secondary font-nunitoExtraBold'>Mate</Text>
          </View>
          <View className='top-[80px]'>
            <Text className='text-h3 text-base-800 font-nunitoSemiBold text-[24px] '>Rejestracja</Text>
            <FormField
              title="Nazwa Użytkownika"
              value={form.username}
              handleChangeText={(e) => setForm({
                ...form,
                username: e
              })}
              otherStyles="mt-6"
            />

            <FormField
              title="E-mail"
              value={form.email}
              handleChangeText={(e) => setForm({
                ...form,
                email: e
              })}
              keyboardType="email-address"
              otherStyles="mt-2"
            />

            <FormField
              title="Hasło"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-2"
            />

            <View className="items-center">
              <CustomButton
                title="Zarejestruj się"
                handlePress={register}
                containerStyles={"mt-6 w-5/6 "}
                isLoading={loading}
              />
            </View>

            <View className="justify-center flex-row pt-4 gap-1">
              <Text className="text-l3r text-base-700 font-nunitoRegular">Posiadasz konto?</Text>
              <Link href="/sign-in" className="text-l3r text-secondary font-nunitoBold">Zaloguj się.</Link>
            </View>
          </View> 
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp