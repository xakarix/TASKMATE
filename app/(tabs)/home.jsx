import { StatusBar } from 'expo-status-bar';
import { Image, Text, View, FlatList, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { NotFound, EventCard } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { fetchCardDetails, fetchEventIdsByUserId } from '../../services/eventService';
import { getUserImageSource } from '../../services/imageService';
import moment from 'moment-timezone';

const Home = () => {
  const { user } = useAuth();
  const userID = user?.id;
  const name = user?.name || 'Guest';
  const avatar = user?.image;

  const [participantsDetails, setParticipantsDetails] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
//sortowanie uczestnikow
  const sortParticipants = (participants) => {
    return participants.sort((a, b) => new Date(b.last_upload_date) - new Date(a.last_upload_date));
  };

  const fetchParticipants = async () => {
    try {
      const eventIds = await fetchEventIdsByUserId(userID);
  
      if (eventIds.length > 0) {
        const allDetails = await Promise.all(
          eventIds.map(eventId => fetchCardDetails(eventId))
        );

          const flattenedParticipants = allDetails.flatMap(details => {
            return details.participants.map(participant => ({
              ...participant,
              eventTitle: details.title,
            }));
          });
  
        const todayStart = moment().tz('Europe/Warsaw').startOf('day');
        const todayEnd = moment().tz('Europe/Warsaw').endOf('day');
  
        const filteredParticipants = flattenedParticipants.filter(participant => {
          const uploadDate = moment(participant.last_upload_date);
          return uploadDate.isBetween(todayStart, todayEnd, null, '[]');
        });
  
        const sortedParticipants = sortParticipants(filteredParticipants);
  
        setParticipantsDetails(sortedParticipants);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };
  
  useEffect(() => {
    if (!userID) return;
    fetchParticipants();
  }, [userID]);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchParticipants();
    setRefreshing(false);
  };
  

  return (
    <SafeAreaView className="h-full bg-base-100 px-4">
      <FlatList
        data={participantsDetails}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventCard
            title={item.eventTitle || "Brak tytułu"}
            name={item.user_name}
            eventImage={getUserImageSource(item.event_image)}
            userImage={getUserImageSource(item.user_image)}
            streaks={item.streaks}
          />
        )}
        ListHeaderComponent={() => (
          <View className="mb-4 mt-2 px-6 py-6 space-y-6 bg-base rounded-[16px]">
            <View className="justify-between items-center flex-row">
              <View className="space-y-2 mt-2">
                <Text className="text-l3r text-base-700 font-nunitoMedium">
                  Witaj ponownie!🥰
                </Text>
                <Text className="text-h3 text-secondary font-nunitoSemiBold">
                  {name}
                </Text>
              </View>

              <View>
                <Image
                  source={getUserImageSource(avatar)}
                  className='w-16 h-16 rounded-full'
                  resizeMode='contain'
                />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <NotFound
            image="Waiting"
            title="Brak ukończonych wyzwań."
            subtitle="Ukończ wyzwanie jako pierwszy!"
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
