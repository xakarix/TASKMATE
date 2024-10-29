
import { supabase } from '../lib/supabase';

export const searchUsers = async (term, currentUserId) => {
    try {
        // Pobierz użytkowników pasujących do wyszukiwania
        const { data: users, error: userError } = await supabase
            .from('users') // zakładam, że masz tabelę użytkowników
            .select('*')
            .ilike('name', `%${term}%`)
            .neq('id', currentUserId);

        if (userError) {
            console.error('Error fetching users:', userError);
            return [];
        }

        if (!users) return [];

        // Pobierz statusy znajomych
        const { data: friendStatuses, error: statusError } = await supabase
            .from('friends')
            .select('receiver_id, sender_id, status')
            .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);

        if (statusError) {
            console.error('Error fetching friend statuses:', statusError);
            return users.map(user => ({ ...user, status: 'not friend' })); // domyślny status
        }

        // Mapowanie statusów do użytkowników
        return users.map(user => {
            const status = friendStatuses.find(f => 
                (f.sender_id === user.id && f.receiver_id === currentUserId) ||
                (f.receiver_id === user.id && f.sender_id === currentUserId)
            );
            return {
                ...user,
                status: status ? status.status : 'not friend' // domyślny status
            };
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return [];
    }
};

export const fetchUserDetails = async (senderIds) => {
    if (!Array.isArray(senderIds) || senderIds.length === 0) return [];

    const validSenderIds = senderIds.filter(id => typeof id === 'string' && id);

    if (validSenderIds.length === 0) return [];

    const { data: users, error } = await supabase
        .from('users')
        .select('id, name, image, bio')
        .in('id', validSenderIds);

    if (error) {
        console.error('Error fetching user details:', error);
        return [];
    }

    return users;
};

