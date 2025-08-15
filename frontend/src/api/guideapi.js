// Fetch guides for a department
// FIXED: Pass userId, not department
export const fetchGuidesByUserId = async (userId) => {
  try {
    console.log('Fetching guides for userId:', userId);
    const response = await API.get(`/guides/by-department/${userId}`);
    console.log("Sent request");
    return response.data; // Expected: { guides: [...] }
  } catch (error) {
    console.error('Error fetching guides:', error);
    throw error.response?.data?.message || 'Failed to fetch guide list';
  }
};

export const getGuideInvites = async () => {
  const token = localStorage.getItem('token'); // assuming JWT
  const res = await API.get('/guides/invites', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // { invites: [...] }
};

export const respondToInvite = async (preferenceId, action) => {
  const token = localStorage.getItem('token');
  const res = await API.post(
    '/guides/respond-invite',
    { preferenceId, action },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data; // { message: "..."}
};
