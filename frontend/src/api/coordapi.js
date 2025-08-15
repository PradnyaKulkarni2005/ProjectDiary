import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust if deployed
});
 
// ✅ Send Notification
export const sendNotification = async (notificationData) => {
  try {
    const response = await API.post('/notifications/send', notificationData);
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error.response?.data?.message || 'Failed to send notification';
  }
};

// ✅ Fetch Received Notifications (for a specific user)
export const fetchNotificationsForUser = async (userId) => {
  try {
    const response = await API.get(`/notifications/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error.response?.data?.message || 'Failed to fetch notifications';
  }
};

export const getNotificationsByUserId = async (userId) => {
  try {
    const response = await API.get(`/notifications/${userId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("API error fetching notifications:", error);
    throw error;
  }
};

// ✅ Get current valid spotlight (for homepage)
export const getSpotlightContent = async () => {
  try {
    const response = await API.get('/spotlight');
    return response.data;
  } catch (error) {
    console.error('Error fetching spotlight:', error);
    return { message: '🚀 Welcome to Final Year Project Portal | PCCOE Pune | AY 2024–25' }; // fallback
  }
};

// ✅ Coordinator: Add or update new spotlight
export const updateSpotlightContent = async (spotlightData) => {
  try {
    const response = await API.post('/spotlight', spotlightData);
    return response.data;
  } catch (error) {
    console.error('Error updating spotlight:', error);
    throw error.response?.data?.message || 'Failed to update spotlight';
  }
};
