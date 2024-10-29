import { View, Text } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors';


const TabsLayout = () => {
  return (
    <>
      <Tabs screenOptions={{
      tabBarStyle: {
        backgroundColor: Colors.white,
        borderTopWidth: 2,
        borderTopColor: Colors.secondary,
        padding: 12,
        height: 80,
        
      },
      tabBarShowLabel: false,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.icon
    }}>
      <Tabs.Screen 
        name="home"
        options={{
          headerShown:false,
          tabBarIcon: ({color}) => (
            <Ionicons name="home" size={24} color={color} />
      )}} />
      <Tabs.Screen
        name="search" 
        options={{
          headerShown:false,
          tabBarIcon: ({color}) => (
            <Ionicons name="search" size={24} color={color} />
     )}} />
      <Tabs.Screen name="add"
        options={{
          headerShown:false,
          tabBarIcon: ({color}) => (
            <View
              style={{
               height:50
              }}
            >
            <Ionicons name="add-circle" size={48} color={Colors.secondary} />
            </View>
      )}} />
      <Tabs.Screen name="notifications"
        options={{
          headerShown:false,
          tabBarIcon: ({color}) => (
            <Ionicons name="notifications" size={24} color={color} />
      )}} />
      <Tabs.Screen name="profile"
        options={{
          headerShown:false,
          tabBarIcon: ({color}) => (
            <FontAwesome name="user" size={24} color={color} />
      )}} />

    </Tabs>
    </>
  )
}

export default TabsLayout