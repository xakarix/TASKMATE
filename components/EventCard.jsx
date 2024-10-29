import { TouchableOpacity, Text, View, Image, ScrollView } from 'react-native'
import React from 'react'
import { FontAwesome, Ionicons, MaterialCommunityIcons, Octicons, AntDesign } from '@expo/vector-icons'
import Colors from '@/constants/Colors';


const EventCard = ({ title, eventImage, name, streaks, userImage }) => {
    return (
        <View className='w-full bg-base rounded-[24px]  items-start mb-6 overflow-hidden'>
            <View className='px-4 pt-4 pb-2 w-full justify-center'>
                <Text className='text-h3 font-nunitoSemiBold text-base-800'>{title}</Text>

            </View>
            <Image
                source={eventImage}
                className="h-[416px] w-full"
                resizeMode='cover'
            />
            <View className='px-4 py-4 w-full flex-row items-start justify-between flex-1'>
                <Text className='text-h4 font-nunitoSemiBold text-base-700 pr-2'>{name}, wyzwanie ukończone!</Text>
                <View className='relative mr-2 '>
                    <Image
                        source={userImage}
                        className="h-12 w-12 rounded-full"
                        resizeMode='cover'
                    />

                    <View className='h-8 rounded-full pl-2 bg-base items-end justify-center bottom-[-10px] right-[-10px] absolute '>
                        <Text className='text-b2r text-start font-nunitoRegular text-base-900'>{streaks}🔥</Text>
                    </View>
                </View>
            </View>

        </View>
    );
};


export default EventCard