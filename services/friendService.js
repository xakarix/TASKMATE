import { supabase } from '../lib/supabase';


export const addFriend = async (receiverId) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error fetching user data:', userError);
      return;
    }
    
    const senderId = userData?.user?.id;
    if (!senderId) {
      console.error('No user ID found');
      return;
    }

    const { data, error } = await supabase
      .from('friends')
      .insert([
        {
          sender_id: senderId,
          receiver_id: receiverId,
          status: 'pending',
        }
      ]);

    if (error) {
      console.error('Error sending friend request:', error);
      return;
    }

    console.log('Friend request sent successfully:', data);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};


export const removeFriend = async (userId, friendId) => {
  try {
    const { error: error1 } = await supabase
      .from('friends')
      .delete()
      .match({ sender_id: userId, receiver_id: friendId });

    if (error1) throw error1;

    const { error: error2 } = await supabase
      .from('friends')
      .delete()
      .match({ sender_id: friendId, receiver_id: userId });

    if (error2) throw error2;

    console.log('Friend removed successfully');
  } catch (error) {
    console.error('Error removing friend:', error.message || error);
  }
};


export const getPendingFriendRequests = async () => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    console.log('User Data:', userData);
    if (userError) {
      console.error('Error fetching user data:', userError);
      return [];
    }

    const userId = userData?.user?.id;
    console.log('User ID:', userId); // Sprawdź, czy userId jest poprawne
    if (!userId) {
      console.error('No user ID found');
      return [];
    }

    const { data: pendingRequests, error: requestsError } = await supabase
      .from('friends')
      .select('*')
      .eq('receiver_id', userId)
      .eq('status', 'pending');

    if (requestsError) {
      console.error('Error fetching pending friend requests:', requestsError);
      return [];
    }

    console.log('Pending Requests:', pendingRequests);
    return pendingRequests;
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
};


export const updateRequestStatus = async (requestId, status) => {
  try {
    const { data, error } = await supabase
      .from('friends')
      .update({ status })
      .match({ id: requestId });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating request status:', error);
  }
};

export const getPendingRequests = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('friends')
      .select('id, sender_id, receiver_id, status, users(name, image)')
      .eq('receiver_id', userId)
      .eq('status', 'pending');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    return [];
  }
};



export const getAcceptedFriendRequests = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('friends')
      .select(`
                id,
                sender_id,
                receiver_id,
                status,
                sender:users!friends_sender_id_fkey(name, image, bio),
                receiver:users!friends_receiver_id_fkey(name, image, bio)
            `)
      .eq('status', 'accepted');

    if (error) {
      console.error('Error fetching accepted requests:', error);
      return [];
    }

    console.log('Accepted Requests Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching accepted requests:', error);
    return [];
  }
};



export const loadFriends = async (userId, setGetFriends) => {
  try {

    const acceptedRequests = await getAcceptedFriendRequests(userId);

    const friends = acceptedRequests
      .filter(request => request.sender_id === userId || request.receiver_id === userId)
      .map(request => {

        const isReceiver = request.receiver_id === userId;
        const relevantUser = isReceiver ? request.sender : request.receiver;

        return {
          id: isReceiver ? request.sender_id : request.receiver_id,
          name: relevantUser ? relevantUser.name : 'Unknown',
          image: relevantUser ? relevantUser.image : null,
          bio: relevantUser ? relevantUser.bio : '',
          status: request.status
        };
      });

    setGetFriends(friends);
  } catch (error) {
    console.error('Error loading friends:', error);
  }
};

