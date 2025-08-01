import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust if deployed
});

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    const token = response.data.token;

    if (!token) {
      throw new Error('No token received');
    }

    localStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error?.response?.data?.message || 'Login failed';
  }
};


// ✅ Create Group
export const createGroup = async (groupData) => {
  try {
    const response = await API.post('/groups/create', groupData);
    console.log("API request sent");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create group';
  }
};

// ✅ Check if user is in a group
export const checkUserGroupStatus = async (userId) => {
  try {
    const response = await API.get(`/groups/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking group status:', error);
    throw error.response?.data?.message || 'Unable to check group status';
  }
};

// ✅ Fetch invitations for user
export const getInvitations = async (userId) => {
  try {
    const response = await API.get(`/groups/invitations/${userId}`);
    return response.data;
    
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch invitations';
  }
};

// ✅ Respond to a group invitation'
export const respondToInvitation = async ({ userId, groupId, action }) => {
  try {
    const response = await API.post('/groups/respond', {
      userId,
      groupId,
      action,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to respond to invitation';
  }
};

// ✅ Get group member statuses for a leader
export const getGroupMemberStatuses = async (leaderId) => {
  try {
    const response = await API.get(`/groups/leader/members/${leaderId}`);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching group member statuses:', error);
    throw error.response?.data?.message || 'Failed to get group member statuses';
  }
};
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
// ✅ Submit Activity Sheet
export const submitActivitySheet = async (activityData) => {
  try {
    const response = await API.post('/activities/submit', activityData);
    return response.data;
  } catch (error) {
    console.error('Error submitting activity sheet:', error);
    throw error.response?.data?.message || 'Failed to submit activity sheet';
  }
};

// ✅ Get Project Group by ID
export const getProjectGroup = async (groupId) => {
  try {
    const response = await API.get(`/activities/group/${groupId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project group:', error);
    throw error.response?.data?.message || 'Failed to fetch project group';
  }
};

// ✅ Get Activity Sheet by ID
export const getActivitySheet = async (sheetId) => {
  const token = localStorage.getItem('token');

  try {
    const response = await API.get(`/activities/sheet/${sheetId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Required for protected route
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching activity sheet:', error);
    throw error.response?.data?.message || 'Failed to fetch activity sheet';
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

//check pending invites
export const checkPendingInvites = async (userId) => {
  try {
    const response = await API.get(`/groups/pending/${userId}`);
    return {
      hasPendingInvites: !!response.data?.hasPendingInvites,
      pendingInvites: response.data?.pendingInvites || [],
    };
  } catch (error) {
    console.error('Error checking pending invites:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Failed to check pending invites';
  }
};

//  post patent details
export const postPatentDetails = async (patentData) =>{
  try{
    const response = await API.post('/activities/subpatent', patentData);
    return response.data;
  }
  catch(error){
    throw error.response?.data?.message || 'Failed to post patent details';

  }
};

// Fetch guides for a department
// FIXED: Pass userId, not department
export const fetchGuidesByUserId = async (userId) => {
  try {
    const response = await API.get(`/guides/by-department/${userId}`);
    return response.data; // Expected: { guides: [...] }
  } catch (error) {
    console.error('Error fetching guides:', error);
    throw error.response?.data?.message || 'Failed to fetch guide list';
  }
};


// ✅ Submit guide preferences for a group
export const submitGuidePreferences = async ({ groupId, preferences }) => {
  try {
    const response = await API.post('/groups/submit-guide-preferences', {
      groupId,
      preferences, // Expected: [guideId1, guideId2, guideId3]
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting guide preferences:', error);
    throw error.response?.data?.message || 'Failed to submit guide preferences';
  }
};
