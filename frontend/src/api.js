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
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

// ✅ Create Group
export const createGroup = async (groupData) => {
  try {
    const response = await API.post('/groups/create', groupData);
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

// ✅ Respond to a group invitation
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
