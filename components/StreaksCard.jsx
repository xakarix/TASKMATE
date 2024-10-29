import React, { useState, useEffect } from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Redirect, router } from 'expo-router'
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { fetchEventParticipants, fetchParticipantsDetails, fetchEventDetails, fetchEventParticipantDetails } from '../services/eventService';
import { CustomButton, ParticipantButtonDetails } from '../components';
import { getUserImageSource } from '../services/imageService'

import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';



const StreaksCard = ({visible, onClose,  eventTitle, streaks, ...props }) => {

    const handlePress = () => {
        onClose();
        router.push('/home');
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className='flex-1 justify-center  items-center bg-base-900 px-6' style={styles.overlay}>

                <View className='justify-center items-center flex-1 space-y-4 max-h-[600px] bg-base w-full rounded-[24px] '>

                    <Text className=' text-h2 text-base-800 font-nunitoBold'>To Twój</Text>
                    <Text className=' text-[96px] text-base-800 font-nunitoBold '>🔥</Text>
                    <Text className=' text-[48px] text-base-800 font-nunitoBold '>{streaks}</Text>
                    <Text className=' text-l2r text-base-700 font-nunitoSemiBold'>DZIEŃ</Text>
                    <Text className=' text-l2r text-base-600 font-nunitoSemiBold '>osiągnięty w kategorii</Text>
                    <Text className=' text-h1 text-base-800 font-nunitoBold '>{eventTitle}</Text>

                    <CustomButton
                            title="SUPER!" 
                            handlePress={handlePress}
                            containerStyles={"mt-10 w-3/6"}
                        />
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },

});

export default StreaksCard