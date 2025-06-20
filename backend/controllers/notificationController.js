const pool = require('../config/db');

// ✅ Get users by role (with names + department from role table)
exports.getUsersByRole = async (req, res) => {
  const { role } = req.query;

  try {
    console.log("Fetching users for role:", role);

    // Role-based table and field mapping
    let table = '';
    switch (role) {
      case 'student':
        table = 'student';
        break;
      case 'coordinator':
        table = 'coordinators';
        break;
      case 'guide':
        table = 'guides';
        break;
      case 'hod':
        table = 'hods';
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    const query = `
      SELECT u.id, u.email, r.name, r.department
      FROM users u
      JOIN ${table} r ON u.email = r.email
      WHERE u.role = $1
    `;

    const result = await pool.query(query, [role]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('❌ Fetch Users By Role Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Send notification to selected users
// ✅ Send notification to selected users
exports.sendNotification = async (req, res) => {
  const { senderId, receiverIds, message } = req.body;

  console.log('🔥 Request Body:', req.body);

  if (!receiverIds || !Array.isArray(receiverIds) || receiverIds.length === 0 || !message.trim()) {
    return res.status(400).json({ error: 'Receiver(s) and message required' });
  }

  try {
    const query = `
      INSERT INTO coord_notifications (sender_id, receiver_id, message, created_at)
      VALUES ($1, $2, $3, NOW() AT TIME ZONE 'Asia/Kolkata')
      RETURNING *;
    `;

    const notifications = [];

    for (const receiverId of receiverIds) {
      const parsedSenderId = parseInt(senderId, 10);
      const parsedReceiverId = parseInt(receiverId, 10);

      if (isNaN(parsedSenderId) || isNaN(parsedReceiverId)) {
        console.log("❌ Skipping invalid ID: sender =", senderId, "receiver =", receiverId);
        continue;
      }

      const values = [parsedSenderId, parsedReceiverId, message];
      const result = await pool.query(query, values);
      notifications.push(result.rows[0]);
    }

    if (notifications.length === 0) {
      return res.status(400).json({ error: 'No valid recipients. Notification not sent.' });
    }

    res.status(201).json({ message: 'Notifications sent successfully', notifications });
  } catch (err) {
    console.error('🔥 Notification Error:', err);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
};


// ✅ Get notifications received by a user
exports.getNotificationsForUser = async (req, res) => {
  const { receiverId } = req.params;

  try {
    const parsedId = parseInt(receiverId);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: 'Invalid receiver ID' });
    }

    const result = await pool.query(
      `SELECT n.id, n.message, n.created_at AS timestamp,
              COALESCE(c.name, 'Unknown') AS coordinator_name
       FROM coord_notifications n
       JOIN users u ON n.sender_id = u.id
       LEFT JOIN coordinators c ON u.email = c.email
       WHERE n.receiver_id = $1
       ORDER BY n.created_at DESC`,
      [parsedId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Fetch Notification Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// ✅ Get sent notifications by coordinator
exports.getSentNotifications = async (req, res) => {
  const { senderId } = req.params;

  try {
    const parsedId = parseInt(senderId, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: 'Invalid sender ID' });
    }

    const result = await pool.query(
      `SELECT 
          n.id, 
          n.message, 
          n.created_at,
          COALESCE(s.name, g.name, h.name, c.name, u.email) AS receiver_name
       FROM coord_notifications n
       JOIN users u ON u.id = n.receiver_id
       LEFT JOIN student s ON s.email = u.email
       LEFT JOIN guides g ON g.email = u.email
       LEFT JOIN hod h ON h.email = u.email
       LEFT JOIN coordinators c ON c.email = u.email
       WHERE n.sender_id = $1
       ORDER BY n.created_at DESC`,
      [parsedId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Fetch Sent Notifications Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ✅ Delete a notification by ID
exports.deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: 'Invalid notification ID' });
    }

    const result = await pool.query(
      `DELETE FROM coord_notifications WHERE id = $1 RETURNING *;`,
      [parsedId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete Notification Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
