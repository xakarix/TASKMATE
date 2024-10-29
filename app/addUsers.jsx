import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton, EventUser, NotFound } from '../components';
import { useAuth } from '../context/AuthContext';
import { loadFriends } from '../services/friendService';
import { getUserImageSource } from '../services/imageService';

import { supabase } from '../lib/supabase';


const AddUsers = () => {

    const { user } = useAuth();
    const router = useRouter();
    const [getFriends, setGetFriends] = useState([]);
    const [participants, setParticipants] = useState([]);
    const { eventId } = useLocalSearchParams();
    
    useEffect(() => {
        loadFriends(user.id, setGetFriends);
    }, [user?.id]);

    const handlePress = async () => {
        try {
            // Dla każdego uczestnika dodaj wiersz do tabeli event_participant_details
            const inserts = participants.map(participantId => ({
                event_id: eventId,
                user_id: participantId,
               
            }));
            console.log('Dane do wstawienia:', inserts); 
            const { error } = await supabase
                .from('event_participants_details')
                .insert(inserts);
    
            if (error) throw error;
    
            // Przejdź do strony `createdEvent`
            router.push(`/createdEvent?eventId=${eventId}`);
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };


    const handleAddParticipant = async (userId) => {
        try {
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('id', userId)
                .single();

            if (userError || !user) {
                console.error('User does not exist.');
                return;
            }

            const { error } = await supabase
                .from('event_participants')
                .insert([{ participant_id: userId, event_id: eventId }]);

            if (error) throw error;

            setParticipants([...participants, userId]);
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };


    const handleRemoveParticipant = async (userId) => {
        try {
            const { error } = await supabase
                .from('event_participants')
                .delete()
                .match({ participant_id: userId, event_id: eventId });

            if (error) throw error;

            setParticipants(participants.filter(id => id !== userId));
        } catch (error) {
            console.error('Unexpected error::', error);
        }
    };


    return (
        <SafeAreaView className="h-full bg-base-100 px-6 pb-4">
            <Text className="text-l3r text-base-800 font-nunitoSemiBold mb-1">Krok 2</Text>
            <View className='flex-row justify-between items-center self-center'>
                <View className=' flex-1 h-[2px] bg-base-300 m-1 rounded-[16px]'></View>
                <View className=' flex-1 h-[2px] bg-secondary m-1 rounded-[16px]'></View>
                <View className=' flex-1 h-[2px] bg-base-300 m-1 rounded-[16px]'></View>
            </View>

            <Text className='mt-6 mb-2 text-l3r text-base-700 font-nunitoRegular'>Dodaj swoich towarzyszy!</Text>
            <View className={'space-y-2 items-center flex-1 justify-center'}>
                <FlatList
                     data={getFriends}
                     keyExtractor={(item) => item.id}
                     renderItem={({ item }) => (
                         <EventUser
                             avatar={getUserImageSource(item.image)}
                             name={item.name}
                             isAdded={participants.includes(item.id)}
                             onToggle={() => {
                                 if (participants.includes(item.id)) {
                                     handleRemoveParticipant(item.id);
                                 } else {
                                     handleAddParticipant(item.id); 
                                 }
                             }}
                         />
                     )}
                    
                    ListEmptyComponent={() => (
                        <NotFound
                            image="Users"
                            title="Brak użytkowników."
                            subtitle="Nie znaleziono użytkowników."
                        />
                    )}
                />
            </View>
            <View className=' flex-row items-end justify-center mt-4 pb-[20px]'>
                <CustomButton
                    title="DALEJ"
                    handlePress={handlePress}
                    containerStyles={"w-5/6 "}
                >
                </CustomButton>
            </View>
        </SafeAreaView>
    );
};

export default AddUsers

