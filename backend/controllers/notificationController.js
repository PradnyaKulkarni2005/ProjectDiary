const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// ✅ 1. Get users by role
exports.getUsersByRole = async (req, res) => {
  const { role } = req.query;

  try {
    console.log("Fetching users for role:", role);

    const result = await pool.query(
      'SELECT id, email FROM users WHERE role = $1',
      [role]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Fetch Users By Role Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ 2. Send notification to selected users
exports.sendNotification = async (req, res) => {
  const { senderId, receiverIds, message } = req.body;

  console.log('🔥 Request Body:', req.body);

  if (!receiverIds || receiverIds.length === 0 || !message.trim()) {
    console.log('❌ Missing receivers or message');
    return res.status(400).json({ error: 'Receiver(s) and message required' });
  }

  try {
    const query = `
      INSERT INTO coord_notifications (sender_id, receiver_id, message)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const notifications = [];

    for (const receiverId of receiverIds) {
      const values = [parseInt(senderId), parseInt(receiverId), message];
      console.log('📤 Inserting:', values);
      const result = await pool.query(query, values);
      notifications.push(result.rows[0]);
    }

    console.log('✅ Notifications sent');
    res.status(201).json({ message: 'Notifications sent successfully', notifications });
  } catch (err) {
    console.error('🔥 Notification Error:', err);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
};

// ✅ 3. Get notifications received by a user
exports.getNotificationsForUser = async (req, res) => {
  const { receiverId } = req.params;

  try {
    const parsedId = parseInt(receiverId);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: 'Invalid receiver ID' });
    }

    const result = await pool.query(
      `SELECT * FROM coord_notifications WHERE receiver_id = $1 ORDER BY created_at DESC`,
      [parsedId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Fetch Notification Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
