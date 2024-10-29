import React, { useState, useEffect } from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Redirect, router } from 'expo-router'
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { fetchEventParticipants, fetchParticipantsDetails, fetchEventDetails, fetchEventParticipantDetails, updateStreaks } from '../services/eventService';
import { CustomButton, ParticipantButtonDetails } from '../components';
import { getUserImageSource } from '../services/imageService'

import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const EventButtonDetails = ({ visible, onClose, eventId }) => {
    const { user } = useAuth();
    const [eventDetails, setEventDetails] = useState(null);
    const [participantDetails, setParticipantDetails] = useState([]);
    const [isTaskCompleted, setIsTaskCompleted] = useState(false);

    useEffect(() => {
        if (eventId) {
            const loadEventData = async () => {
                try {
                    const participantIds = await fetchEventParticipants(eventId);
                    const eventParticipantDetails = await fetchEventParticipantDetails(eventId, participantIds);
                    const participantsInfo = await fetchParticipantsDetails(participantIds);


                    const combinedDetails = participantsInfo.map(user => {
                        const eventDetail = eventParticipantDetails.find(detail => detail.user_id === user.id);
                        return {
                            ...user,
                            streaks: eventDetail?.streaks || 0,
                            task_completed: eventDetail?.task_completed || false,
                        };
                    });

                    setParticipantDetails(combinedDetails);
                    const details = await fetchEventDetails(eventId);
                    setEventDetails(details);

                    const userDetail = combinedDetails.find(detail => detail.id === user.id);
                    if (userDetail) {
                        setIsTaskCompleted(userDetail.task_completed);
                    }
                } catch (error) {
                    console.error('Error loading event data:', error);
                }
            };

            loadEventData();
        }
    }, [eventId]);


    const handleLeaveEvent = async () => {
        Alert.alert(
            "Potwierdzenie",
            "Czy na pewno chcesz opuścić wyzwanie?",
            [
                {
                    text: "Anuluj",
                    style: "cancel"
                },
                {
                    text: "Tak",
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('event_participants')
                                .delete()
                                .eq('event_id', eventId)
                                .eq('participant_id', user.id);
                            if (error) {
                                throw new Error(error.message);
                            }

                            console.log("Wyzwanie opuszczone");
                            onClose();
                        } catch (error) {
                            console.error("Error leaving the event:", error);
                            Alert.alert("Błąd", "Wystąpił problem podczas opuszczania wyzwania.");
                        }
                    }
                }
            ]
        );
    };

    const handleCompleteChallenge = () => {
        onClose();
        router.push(`/useCamera?eventId=${eventId}`);
    };


    if (!eventDetails) {
        return null; 
    }


    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className='h-full justify-center items-center bg-base-900 px-6' style={styles.overlay}>
                <View className='w-full  bg-base rounded-[16px] px-2 pt-3 pb-4 items-start'>
                    <View className='flex-row justify-between items-center w-full pr-2 pl-4 pb-3 mt-2'>
                        <Text className='text-h3 font-nunitoSemiBold text-secondary'>{eventDetails.title}</Text>
                        <View className='items-end  ml-2'>
                            <TouchableOpacity
                                onPress={onClose}
                            >
                                <Ionicons name='close' size={32} color={Colors.n400} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className='px-6 w-full space-y-4 '>

                        <ScrollView className='h-[196px] '>
                            {participantDetails.length > 0 ? (
                                participantDetails.map((participant, index) => (
                                    <ParticipantButtonDetails
                                        key={index}
                                        image={getUserImageSource(participant.image)}
                                        name={participant.name}
                                        streaks={participant.streaks}
                                    />
                                ))
                            ) : (
                                <Text>Brak uczestników.</Text>
                            )}

                        </ScrollView>

                    

                        <TouchableOpacity
                            onPress={handleCompleteChallenge}
                            activeOpacity={0.7}
                            className={`rounded-[24px] min-h-[40px] justify-center items-center mt-4 w-full ${isTaskCompleted ? 'bg-base border-[1px] border-secondary' : 'bg-secondary'}`}
                            disabled={isTaskCompleted}
                        >
                            <Text className={`${isTaskCompleted ? 'text-secondary' : 'text-base'} font-nunitoMedium text-[16px]`}>
                                {isTaskCompleted ? 'UKOŃCZONO WYZWANIE' : 'UKOŃCZ WYZWANIE'}
                            </Text>
                        </TouchableOpacity>

                        <View className='items-center'>

                            <TouchableOpacity
                                onPress={handleLeaveEvent} 
                            >
                                <Text className='text-secondary font-nunitoRegular text-b3r'>Opuść wyzwanie</Text>
                            </TouchableOpacity>
                        </View>


                    </View>

                </View>

            </View>


        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

});

export default EventButtonDetails