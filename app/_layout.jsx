import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Slot, SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';


import { AuthProvider, useAuth } from '../context/AuthContext';
import {supabase} from '../lib/supabase';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const [fontsLoaded, error] = useFonts({
        "Nunito-Regular": require("../assets/fonts/Nunito-Regular.ttf"),
        "Nunito-Medium": require("../assets/fonts/Nunito-Medium.ttf"),
        "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
        "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
        "Nunito-ExtraBold": require("../assets/fonts/Nunito-ExtraBold.ttf"),
        "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
        "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
        "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
        
    });
    
    useEffect(() => {
        if(error) throw error;
        
        if(fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded,error])
    
    if(!fontsLoaded && !error) return null;
    

    return (

        <AuthProvider>

        <Stack>
        <Stack.Screen name="index" options={{headerShown: false}} />
            <Stack.Screen name="(auth)" options={{headerShown: false}} />
            <Stack.Screen name="(tabs)" options={{headerShown: false}} />
            <Stack.Screen name="friends" options={{headerShown: false}} />
            <Stack.Screen name="editProfile" options={{headerShown: false}} />
            <Stack.Screen name="addUsers" options={{headerShown: false, gestureEnabled: false}} />
            <Stack.Screen name="createdEvent" options={{headerShown: false, gestureEnabled: false}} />
            <Stack.Screen name="useCamera" options={{headerShown: false}} />

        </Stack>

        </AuthProvider>
    )
}

export default RootLayout
