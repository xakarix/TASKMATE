import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Redirect, router, useRouter,useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton, EventUser, FormField, NotFound } from '../components';
import { useAuth } from '../context/AuthContext';
import { getAcceptedFriendRequests } from '../services/friendService';
import { getUserImageSource } from '../services/imageService';

import { supabase } from '../lib/supabase';


const CreatedEvent = () => {

  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const [eventTitle, setEventTitle] = useState('');

  useEffect(() => {
    const fetchEventTitle = async () => {
      try {
        // Pobierz tytuł wydarzenia na podstawie eventId
        const { data, error } = await supabase
          .from('event')
          .select('title')
          .eq('id', eventId)
          .single();


        if (error) {
          console.error('Error fetching event titile:', error);
          return;
        }

        // Ustaw tytuł wydarzenia
        setEventTitle(data.title);
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchEventTitle();
  }, [eventId]);


  return (
    <SafeAreaView className="h-full bg-base px-6 pb-4">
        <Text className="text-l3r text-base-800 font-nunitoSemiBold mb-1">Krok 3</Text>
            <View className='flex-row justify-between items-center self-center'>
                <View className=' flex-1 h-[2px] bg-base-300 m-1 rounded-[16px] '></View>
                <View className=' flex-1 h-[2px] bg-base-300 m-1 rounded-[16px]'></View>
                <View className=' flex-1 h-[2px] bg-secondary m-1 rounded-[16px]'></View>

            </View>

    <View className='justify-center items-center flex-1 space-y-6'>
    <Text className=' text-h2 text-base-800 font-nunitoBold mb-3'>Gratulacje!</Text>
    <Text className=' text-[96px] text-base-800 font-nunitoBold '>🎉</Text>
    <Text className=' text-l2r text-base-600 font-nunitoSemiBold '>Właśnie utowrzyłeś nowe wyzwanie!</Text>
    <Text className=' text-h1 text-base-800 font-nunitoBold '>{eventTitle}</Text>
    <Text className=' text-l2r text-base-600 font-nunitoSemiBold'>Miłej zabawy!</Text>

    
    </View>
    <View className=' flex-row items-end justify-center  pb-[20px]'>
        <CustomButton
          title="SUPER!"
          handlePress={() => router.push('/profile')}
          containerStyles={"w-5/6 "}
        >
        </CustomButton>
      </View>
    </SafeAreaView>
  )
}

export default CreatedEvent

