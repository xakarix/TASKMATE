import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, ScrollView, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Redirect, router, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import { CustomButton } from "../components";
import { AuthProvider, useAuth } from '../context/AuthContext';
import {supabase} from '../lib/supabase';
import { getUserData } from '../services/userService'



export default function App() {

  const router = useRouter();
  const {setAuth, setUserData} = useAuth(); 

  
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
     // console.log('session user: ', session?.user);
      if(session){
        setAuth(session?.user);
        updateUserData(session?.user);
        router.replace('/home');
      }
      else{
        setAuth(null);

      }
    })

  },[]);

  const updateUserData = async (user) =>{
    let res = await getUserData(user?.id);
    if(res.success) setUserData(res.data); 

  }

  return (
    <SafeAreaView className='bg-base-200 h-full'>
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View className='w-full justify-center items-center min-h-[85vh] px-6'>
          <View className='flex-row items-center bottom-10 mt-[96px]'>
              <Text className='text-[48px] text-base-800 font-nunitoExtraBold'>TASK</Text>
              <Text className='text-[48px] text-secondary font-nunitoExtraBold'>Mate</Text>
          </View>
          <Image
            source={images.Welcome}
            className='mb-8'
          />
          <Text className='text-h3 font-robotoMedium text-base-800 mb-2 '>Dzień Dobry!</Text>
          <Text className='text-l3r font-nunitoRegular text-base-500 text-center  mb-12'>Zacznij realizować swoje cele, codziennie stając się lepszą wersją siebie razem z innymi! Dołącz do nas i odkryj, jak krok po kroku osiągnąć sukces. Razem zbudujemy przyszłość, o której zawsze marzyłeś!</Text>
          
          <CustomButton
            title="Rozpocznij!"
            handlePress={() => router.push('/sign-up')}
            containerStyles="w-5/6 "
            />


        </View>

      </ScrollView>

    </SafeAreaView>
  );
}




