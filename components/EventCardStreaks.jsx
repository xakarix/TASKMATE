import { TouchableOpacity, Text, View, Image, ScrollView } from 'react-native'
import React from 'react'
import { FontAwesome, Ionicons, MaterialCommunityIcons, Octicons, AntDesign } from '@expo/vector-icons'
import Colors from '@/constants/Colors';


const EventCardStreaks = ({ avatar, streaks}) => {
    return (
        <View className='items-center relative '>
            <Image
                source={avatar}
                className="w-10 h-10 rounded-full"
                resizeMode='contain'
            />
            <View className='absolute bottom-0 right-0 h-8 w-8 rounded-full bg-base justify-center items-center '>
                <Text className=' text-b2r text-base-800 font-nunitoMedium'>{streaks}🔥</Text>
            </View>

        </View>
    );
};


export default EventCardStreaks