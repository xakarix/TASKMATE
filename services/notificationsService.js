import { supabase } from '../lib/supabase';

import { getPendingFriendRequests, updateRequestStatus } from './friendService';
import { fetchUserDetails } from './serchingService';


export const loadNotifications = async (setNotifications) => {
    try {
        const pendingRequests = await getPendingFriendRequests(); 
        if (pendingRequests.length === 0) {
            setNotifications([]);
            return;
        }

        const senderIds = pendingRequests.map(request => request.sender_id);
        const users = await fetchUserDetails(senderIds);

        const notifications = pendingRequests.map(request => {
            const user = users.find(u => u.id === request.sender_id);
            return {
                id: request.id,
                name: user ? user.name : 'Unknown',
                image: user ? user.image : null,
                status: request.status
            };
        });

        setNotifications(notifications);
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
};

export const handleReject = async (requestId, fetchNotifications) => {
    try {
        const { error } = await supabase
            .from('friends')
            .delete()
            .eq('id', requestId);

        if (error) {
            console.error('Error deleting request:', error);
            return;
        }

        fetchNotifications(); 
    } catch (error) {
        console.error('Unexpected error:', error);
    }
};


export const handleAccept = async (requestId, fetchNotifications) => {
    try {
        await updateRequestStatus(requestId, 'accepted'); 
        fetchNotifications();
    } catch (error) {
        console.error('Error accepting request:', error);
    }
};