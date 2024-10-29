import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';
import { Redirect, router, useRouter } from 'expo-router'
import moment from 'moment-timezone';

export const fetchEvents = async (userId) => {
  try {
    const { data: participantData, error: participantError } = await supabase
      .from('event_participants')
      .select('event_id')
      .eq('participant_id', userId);

    if (participantError) {
      throw new Error(participantError.message);
    }

    const eventIds = participantData.map(participant => participant.event_id);
    if (eventIds.length === 0) {
      return [];
    }

    // pobanie tytulu
    const { data: eventData, error: eventError } = await supabase
      .from('event')
      .select('*')
      .in('id', eventIds);

    if (eventError) {
      throw new Error(eventError.message);
    }
    // status userId dla kadego wyzwania w jakim bierze udzial
    const { data: participantsDetails, error: participantsDetailsError } = await supabase
      .from('event_participants_details')
      .select('event_id, task_completed')
      .eq('user_id', userId)
      .in('event_id', eventIds);

    if (participantsDetailsError) {
      throw new Error(participantsDetailsError.message);
    }

    const participantTask = participantsDetails.reduce((acc, participant) => {
      acc[participant.event_id] = participant.task_completed;
      return acc;
    }, {});
    // pobranie liczby uczestników
    const { data: participantsData, error: participantsError } = await supabase
      .from('event_participants')
      .select('event_id, participant_id')
      .in('event_id', eventIds);

    if (participantsError) {
      throw new Error(participantsError.message);
    }

    const participantCount = participantsData.reduce((acc, participant) => {
      acc[participant.event_id] = (acc[participant.event_id] || 0) + 1;
      return acc;
    }, {});

    //połaczenie tablic
    const eventsWithDetails = eventData.map(event => ({
      ...event,
      participants: participantCount[event.id] || 0,
      task_completed: participantTask[event.id] || false 
    }));

    return eventsWithDetails;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// export const fetchEvents = async (userId) => {
//   try {
//     const { data: eventData, error: eventError } = await supabase
//       .from('event')
//       .select('*');

//     if (eventError) {
//       throw new Error(eventError.message);
//     }

//     const { data: participantsDetails, error: participantsDetailsError } = await supabase
//       .from('event_participants_details')
//       .select('event_id, task_completed')
//       .eq('user_id', userId);

//     if (participantsDetailsError) {
//       throw new Error(participantsDetailsError.message);
//     }

//     const participantTask = participantsDetails.reduce((acc, participant) => {
//       acc[participant.event_id] = participant.task_completed;
//       return acc;
//     }, {});

//     // Pobierz uczestników wydarzeń
//     const { data: participantsData, error: participantsError } = await supabase
//       .from('event_participants')
//       .select('event_id, participant_id');

//     if (participantsError) {
//       throw new Error(participantsError.message);
//     }

//     const participantCount = participantsData.reduce((acc, participant) => {
//       acc[participant.event_id] = (acc[participant.event_id] || 0) + 1;
//       return acc;
//     }, {});

//     // Filtruj wydarzenia na podstawie uczestnictwa zalogowanego użytkownika
//     const filteredEvents = eventData.filter(event => {
//       const isUserParticipant = participantsData.some(
//         (participant) => participant.event_id === event.id && participant.participant_id === userId
//       );
//       return isUserParticipant;
//     });

//     // Uzupełnij dane o uczestnikach i task_completed
//     const eventsWithDetails = filteredEvents.map(event => ({
//       ...event,
//       participants: participantCount[event.id] || 0,
//       task_completed: participantTask[event.id] || false 
//     }));

//     return eventsWithDetails;
//   } catch (error) {
//     console.error('Error fetching events:', error);
//     return [];
//   }
// };



export const fetchEventDetails = async (eventId) => {
  try {
    // Wykonaj zapytanie do tabeli "events", filtrując po ID wydarzenia
    let { data, error } = await supabase
      .from('event')
      .select('*')
      .eq('id', eventId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching event details:', error);
      return null;
    }

    return data; // Zwraca dane wydarzenia
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};



export const handleSaveEvent = async (form, ownerId) => {
  try {
    // Dodanie tytułu wydarzenia
    const { data, error } = await supabase
      .from('event')
      .insert([{ title: form.eventTitle }])
      .select('id');

    if (error) throw error;

    // Pobranie id nowo utworzonego wydarzenia
    const eventId = data[0]?.id;
    if (!eventId) throw new Error('Event ID is undefined');

    // Dodanie właściciela jako uczestnika
    const { error: participantError } = await supabase
      .from('event_participants')
      .insert([{ event_id: eventId, participant_id: ownerId }]);

    if (participantError) throw participantError;

    //Dodania właścicela do szczegółowych informacji
    const { error: detailsError } = await supabase
      .from('event_participants_details')
      .insert([{
        event_id: eventId,
        user_id: ownerId,
      }]);

    if (detailsError) throw detailsError;
    
    router.push(`/addUsers?eventId=${eventId}`);
  } catch (error) {
    console.error('Error creating event:', error);
  }
};



export const fetchEventParticipants = async (eventId) => {
  try {

    let { data, error } = await supabase
      .from('event_participants')
      .select('participant_id')
      .eq('event_id', eventId);

    if (error) {
      console.error('Error fetching event participants:', error);
      return [];
    }

    return data.map((row) => row.participant_id); 
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
};


export const fetchParticipantsDetails = async (participantIds) => {
  try {
    if (participantIds.length === 0) return [];

    let { data, error } = await supabase
      .from('users')
      .select('id, name, image')
      .in('id', participantIds); 

    if (error) {
      console.error('Error fetching participants details:', error);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
};

export const fetchEventParticipantDetails = async (eventId, participantIds) => {
  try {
    if (participantIds.length === 0) return [];


    const { data, error } = await supabase
      .from('event_participants_details')
      .select('event_id, user_id, event_image, streaks, last_upload_date, task_completed')
      .eq('event_id', eventId)
      .in('user_id', participantIds); 

    if (error) {
      console.error('Error fetching event participant details:', error);
      return [];
    }

    return data; 
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
};


export const fetchEventIdsByUserId = async (userId) => {
  try {

    let { data: eventIds, error: eventIdsError } = await supabase
      .from('event_participants_details')
      .select('event_id')
      .eq('user_id', userId);

    if (eventIdsError) {
      console.error('Error fetching event_id:', eventIdsError);
      return [];
    }

    const uniqueEventIds = [...new Set(eventIds.map(event => event.event_id))];
    return uniqueEventIds;
  } catch (error) {
    console.error('unexpected error:', error);
    return [];
  }
};

export const fetchCardDetails = async (eventId) => {
  try {

    // Pobierz szczegóły uczestników
    let { data: participants, error: participantsError } = await supabase
      .from('event_participants_details')
      .select('id, user_id, event_image, streaks, last_upload_date')
      .eq('event_id', eventId);

    if (participantsError) {
      console.error('error fetching participants:', participantsError);
      return { participants: [], title: '' };
    }

    // Pobierz tytuł wydarzenia
    let { data: event, error: eventError } = await supabase
      .from('event') 
      .select('title')
      .eq('id', eventId)
      .single();

    if (eventError) {
      console.error('error fetching title:', eventError);
      return { participants: [], title: '' };
    }

    // Pobierz dane użytkowników na podstawie user_id
    const userIds = participants.map(p => p.user_id);
    let { data: users, error: usersError } = await supabase
      .from('users') 
      .select('id, name, image')
      .in('id', userIds);

    if (usersError) {
      console.error('Error fetching user details:', usersError);
      return { participants: [], title: '' };
    }

    // Mapuj dane użytkowników do uczestników
    const userMap = new Map(users.map(user => [user.id, user]));
    const enrichedParticipants = participants.map(participant => ({
      ...participant,
      user_name: userMap.get(participant.user_id)?.name || '',
      user_image: userMap.get(participant.user_id)?.image || ''
    }));


    return { participants: enrichedParticipants || [], title: event.title || '' };
  } catch (error) {
    console.error('unexpeted error:', error);
    return { participants: [], title: '' };
  }
};


export const updateTaskCompletionStatus = async () => {
  try {

    const todayStart = moment().tz('Europe/Warsaw').startOf('day');
    const { data: participantsDetails, error: fetchError } = await supabase
      .from('event_participants_details')
      .select('event_id, user_id, last_upload_date, streaks');

    if (fetchError) {
      console.error('unexpected error:', fetchError.message);
      throw new Error(fetchError.message);
    }

    for (const participant of participantsDetails) {
      const { event_id, user_id, last_upload_date, streaks } = participant;

      let lastUploadDate;
      try {
        if (last_upload_date) {
          lastUploadDate = moment(last_upload_date).tz('Europe/Warsaw').startOf('day');

          // czy data jest prawidłowa
          if (!lastUploadDate.isValid()) {
            console.error('Nieprawidłowy format daty:', last_upload_date);
            continue;
          }
        } else {
          continue; // Pomijamy, jeśli brak last_upload_date
        }
      } catch (err) {
        console.error('Błąd podczas parsowania daty:', last_upload_date, 'Error:', err);
        continue;
      }

      // Oblicz różnicę dni
      const daysDifference = todayStart.diff(lastUploadDate, 'days');
      if (daysDifference > 1) {
        // Jeśli różnica dni jest większa niż jeden, streaks ustawione na 0

        const { error: resetStreakError } = await supabase
          .from('event_participants_details')
          .update({ streaks: 0, task_completed: false }) 
          .eq('event_id', event_id)
          .eq('user_id', user_id);

        if (resetStreakError) {
          console.error('Błąd podczas resetowania streaks:', resetStreakError.message);
          throw new Error(resetStreakError.message);
        }
      } else if (!lastUploadDate.isSame(todayStart, 'day')) {
        const { error: updateError } = await supabase
          .from('event_participants_details')
          .update({ task_completed: false })
          .eq('event_id', event_id)
          .eq('user_id', user_id);

        if (updateError) {
          console.error('Błąd podczas aktualizacji task_completed:', updateError.message);
          throw new Error(updateError.message);
        }
      } else {

      }
    }
  } catch (error) {
  }
};


