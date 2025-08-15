import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust if deployed
});

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
