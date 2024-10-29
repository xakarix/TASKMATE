import Colors from '@/constants/Colors';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { router, useLocalSearchParams } from 'expo-router';
import StreaksCard from '../components/StreaksCard';
import moment from 'moment-timezone';

import { updateStreaks } from '../services/eventService'
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { uploadFile } from '../services/imageService';

const UseCamera = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraType, setCameraType] = useState('back');
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const cameraRef = useRef(null);

    const [showStreaksCard, setShowStreaksCard] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [streaks, setStreaks] = useState(0);

    const { user } = useAuth();
    const { eventId } = useLocalSearchParams();

    if (!permission) {
        return (
            <View className='flex-1 justify-center items-center'>
                <Text className='font-nunitoMedium text-b2r text-base-600'>Potrzebujemy Twojej zgody na użycie kamery</Text>
                <Button onPress={requestPermission} title="Przyznaj zgodę" />
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View className='flex-1 justify-center items-center'>
                <Text className='font-nunitoMedium text-b2r text-base-600'>Proszę czekać, uzyskiwanie dostępu do kamery...</Text>
            </View>
        );
    }

    const toggleCameraType = () => {
        setCameraType(prevType => (prevType === 'back' ? 'front' : 'back'));
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({ quality: 1, base64: true });
                // Jeśli przednia kamera, odwracamy zdjecie
                if (cameraType === 'front') {
                    const mirroredPhoto = await ImageManipulator.manipulateAsync(
                        photo.uri,
                        [{ flip: ImageManipulator.FlipType.Horizontal }],
                        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
                    );
                    setCapturedPhoto(mirroredPhoto.uri);
                } else {
                    setCapturedPhoto(photo.uri);
                }
            } catch (error) {
                console.error('Błąd robienia zdjęcia:', error);
            }
        }
    };

    const retakePicture = () => {
        setCapturedPhoto(null);
    };

    const savePhotoDetails = async () => {
        try {
            if (!capturedPhoto) {
                Alert.alert('Błąd', 'Nie zrobiono zdjęcia.');
                return;
            }
            // Pobierz tytuł wydarzenia
            const { data: eventDetails, error: eventError } = await supabase
                .from('event')
                .select('title')
                .eq('id', eventId)
                .single();

            if (eventError) {
                throw new Error(eventError.message);
            }
            // const fileName = `${eventId}/${(new Date()).getTime()}.jpg`;
            const { success, data: uploadedFilePath, msg } = await uploadFile('events', capturedPhoto);
            if (!success) {
                throw new Error(`Błąd przesyłania zdjęcia: ${msg}`);
            }
            //  dane uczestnika
            const { data: participantDetails, error: participantError } = await supabase
                .from('event_participants_details')
                .select('streaks')
                .eq('event_id', eventId)
                .eq('user_id', user.id)
                .single();

            if (participantError) {
                throw new Error(participantError.message);
            }
            const currentTime = moment().tz('Europe/Warsaw').format();
            const { error } = await supabase
                .from('event_participants_details')
                .update({
                    event_image: uploadedFilePath,
                    streaks: participantDetails.streaks + 1, // Dodaj 1 do streaks
                    last_upload_date: currentTime, 
                    task_completed: true 
                })
                .eq('event_id', eventId)
                .eq('user_id', user.id);

            if (error) {
                throw new Error(error.message);
            }
            // Pobierz zaktualizowane wartości streaks
            const { data: updatedData, error: updatedDataError } = await supabase
                .from('event_participants_details')
                .select('streaks')
                .eq('event_id', eventId)
                .eq('user_id', user.id)
                .single();

            if (updatedDataError) {
                throw new Error(updatedDataError.message);
            }
            setEventTitle(eventDetails.title);
            setStreaks(updatedData.streaks);
            setShowStreaksCard(true);
        } catch (error) {
            console.error('Błąd zapisywania danych:', error);
            Alert.alert('Błąd', 'Wystąpił problem podczas zapisywania danych.');
        }
    };

 
   

    return (
        <View className='h-full bg-base' >

            {capturedPhoto ? (
                <View className='flex-1'>
                    <View className='flex-1'>
                        <Image
                            className='flex-1 overflow-hidden'
                            source={{ uri: capturedPhoto }}
                        />
                    </View>
                    <View className='h-[96px] flex-row w-full  justify-between items-center mb-4 bg-base'>
                        <View className='flex-1 items-center justify-center'>

                            <TouchableOpacity
                                className='h-10 w-40 border-[2px] border-secondary rounded-[24px] items-center justify-center'
                                onPress={retakePicture}
                            >
                                <Text className='text-l1r font-semibold text-secondary'>PONÓW</Text>
                            </TouchableOpacity>
                        </View>
                        <View className='flex-1 items-center justify-center'>

                            <TouchableOpacity
                                className='h-10 w-40 bg-secondary rounded-[24px] items-center justify-center'
                                onPress={savePhotoDetails}
                            >
                                <Text className='text-l1r font-semibold text-base'>DODAJ</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            ) : (
                <CameraView
                    className='flex-1'
                    facing={cameraType}
                    ref={cameraRef}
                />
            )}
            {!capturedPhoto && (
                <View className='h-[96px] flex-row w-full px-10 justify-between items-center mb-4'>

                    <TouchableOpacity
                        onPress={() => router.back()}
                    >
                        <Ionicons name='arrow-back' size={32} color={Colors.n400} />

                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={takePicture}
                    >
                        <Entypo name='circle' size={64} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className=''
                        onPress={toggleCameraType}
                    >
                        <Ionicons name='camera-reverse' size={32} color={Colors.secondary} />
                    </TouchableOpacity>
                </View>
            )}
            <StreaksCard
                visible={showStreaksCard}
                onClose={() => setShowStreaksCard(false)}
                eventTitle={eventTitle}
                streaks={streaks}
            />
        </View>
    );
};



export default UseCamera;
