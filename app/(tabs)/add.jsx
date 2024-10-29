import React, { useState } from 'react';
import { Text, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton, FormField } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { handleSaveEvent } from '../../services/eventService';

const Add = () => {
  const {user} = useAuth();
  const ownerId = user?.id;
  const [form, setForm] = useState({
    eventTitle: '',
  });
  const router = useRouter();

  const onNextPress = async () => {
    if (!form.eventTitle) {
      Alert.alert("Error", "Wypisz nazwę wydarzenia");
      return;
    }
    await handleSaveEvent(form, ownerId);
  };

  return (
    <SafeAreaView className="h-full bg-base px-6">
      <Text className="text-l3r text-base-800 font-nunitoSemiBold mb-1">Krok 1</Text>
      <View className='flex-row justify-between items-center self-center'>
        <View className=' flex-1 h-[2px] bg-secondary m-1 rounded-[16px]'></View>
        <View className=' flex-1 h-[2px] bg-base-300 m-1 rounded-[16px]'></View>
        <View className=' flex-1 h-[2px] bg-base-300 m-1 rounded-[16px]'></View>
      </View>

      <View className='px-8 rounded-[16px] mt-12 items-center '>
        <Text className='mt-8 text-[48px]'>👋🏻</Text>
        <Text className='mt-6 text-l3r text-base-500 font-nunitoRegular'>Utworzenie celu to pierwszy krok w jego realizacji!</Text>
        <Text className='mt-2 text-l3r text-base-500 font-nunitoRegular'>Nadaj mu unikalną nazwę.</Text>
      </View>

      <View className='items-center flex-1 justify-center px-8'>
        <FormField
          title="Nazwa"
          value={form.eventTitle}
          handleChangeText={(e) => setForm({ ...form, eventTitle: e })}
          otherStyles=" mb-4"
        />
      </View>

      <View className=' flex-row items-end justify-center  pb-[20px]'>
        <CustomButton
          title="DALEJ"
          handlePress={onNextPress}  // Zaktualizowane, aby używać onNextPress
          containerStyles={"w-5/6 "}
        />
      </View>
    </SafeAreaView>
  );
};

export default Add;
