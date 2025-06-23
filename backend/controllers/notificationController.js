const pool = require('../config/db');

// ✅ Format to Asia/Kolkata
const formatIST = (utcDate) => {
  const date = new Date(utcDate);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: true,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ✅ Fetch sender's name from respective role table
// COALESCE is used to get the first non-null value from the joined tables
// This allows us to get the sender's name from the correct role table (coordinator, guide, hod, student) based on their email
// If no match is found, it defaults to the user's email  
// senderId is expected to be the user's ID
const getSenderDetails = async (senderId) => {
  const result = await pool.query(`
    SELECT 
      COALESCE(c.name, g.name, h.name, s.name, u.email) AS sender_name
    FROM users u
    LEFT JOIN coordinators c ON c.email = u.email
    LEFT JOIN guides g ON g.email = u.email
    LEFT JOIN hod h ON h.email = u.email
    LEFT JOIN student s ON s.email = u.email
    WHERE u.id = $1
  `, [senderId]);

  return result.rows[0]?.sender_name || 'Unknown';
};

// ✅ Enrich notifications with sender name + formatted date
// This function takes an array of notifications and a type (broadcast or direct)
// It fetches the sender's name for each notification and formats the created_at date to IST
const enrichWithSender = async (notifs, type) => {
  return Promise.all(
    notifs.map(async (n) => {
      const senderName = await getSenderDetails(n.sender_id);
      return {
        ...n,
        sender_name: senderName,
        created_at: formatIST(n.created_at),
        type
      };
    })
  );
};

// ✅ Get users by role and coordinator department
// This function takes a role and a department and returns an array of users with that role and department .means coordinator can see only students in their department
exports.getUsersByRole = async (req, res) => {
  const { role, coordinatorId } = req.query;

  try {
    const deptResult = await pool.query(
      `SELECT c.department
       FROM coordinators c
       JOIN users u ON u.email = c.email
       WHERE u.id = $1`,
      [coordinatorId]
    );

    if (deptResult.rowCount === 0) {
      return res.status(404).json({ message: 'Coordinator not found' });
    }

    const coordinatorDept = deptResult.rows[0].department;

    let table = '';
    switch (role) {
      case 'student':
        table = 'student';
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }
console.log("Coordinator dept:", coordinatorDept);
console.log("Role:", role);
// fetch users based on role and coordinator department
// Using TRIM and LOWER to ensure case-insensitive comparison and remove any leading/trailing spaces
    const query = `
  SELECT u.id, u.email, r.name, r.department AS dept
  FROM users u
  JOIN ${table} r ON u.email = r.email
  WHERE u.role = $1 AND TRIM(LOWER(r.department)) = TRIM(LOWER($2))
`;


    const result = await pool.query(query, [role, coordinatorDept]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('❌ Fetch Users By Role Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Send notification (to all OR selected users)

exports.sendNotification = async (req, res) => {
  const { senderId, receiverIds, message, isForAll } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    if (isForAll === true) {
      // ✅ Get coordinator department
      const deptRes = await pool.query(`
        SELECT department FROM coordinators c
        JOIN users u ON u.email = c.email
        WHERE u.id = $1
      `, [senderId]);

      if (deptRes.rowCount === 0) {
        return res.status(400).json({ error: 'Coordinator department not found' });
      }

      const dept = deptRes.rows[0].department;

      // ✅ Send department-limited broadcast
      await pool.query(
  `INSERT INTO broadcast_notifications (sender_id, message, is_for_all, created_at)
   VALUES ($1, $2, TRUE, NOW())`,
  [senderId, message]
);

    } else {
      // ✅ Only runs if isForAll === false
      // Check if receiverIds is an array and not empty
      if (!Array.isArray(receiverIds) || receiverIds.length === 0) {
        return res.status(400).json({ error: 'No receivers selected' });
      }
// values - receiverIds is an array of user IDs to send notifications to
      // Insert notifications for each receiver
      const insertQuery = `
        INSERT INTO user_notifications (user_id, sender_id, message, created_at)
        VALUES ${receiverIds.map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`).join(',')}
      `;
      // Flatten  the values array to match the placeholders in the query
      const values = receiverIds.flatMap(id => [id, senderId, message, new Date()]);
      await pool.query(insertQuery, values);
    }

    res.status(201).json({ message: 'Notification sent successfully' });
  } catch (err) {
    console.error('❌ Send Notification Error:', err.stack);
    res.status(500).json({ error: 'Failed to send notification' });
  }
};


// ✅ Get all notifications for a specific user
exports.getNotificationsForUser = async (req, res) => {
  const userId = parseInt(req.params.receiverId, 10);
if (isNaN(userId)) {
  return res.status(400).json({ error: 'Invalid user ID' });
}


  try {
    // Broadcasts sent to all
    const broadcastResult = await pool.query(`
  SELECT b.id, b.sender_id, b.message, b.created_at
  FROM broadcast_notifications b
  JOIN coordinators c ON c.email = (SELECT email FROM users WHERE id = b.sender_id)
  JOIN student s ON s.email = (SELECT email FROM users WHERE id = $1)
  WHERE b.is_for_all = TRUE AND TRIM(LOWER(c.department)) = TRIM(LOWER(s.department))
`, [userId]);

    // Direct user notifications
    const directResult = await pool.query(`
      SELECT id, sender_id, message, created_at
      FROM user_notifications
      WHERE user_id = $1
    `, [userId]);

    const broadcast = await enrichWithSender(broadcastResult.rows, 'broadcast');
    const direct = await enrichWithSender(directResult.rows, 'direct');

    const all = [...broadcast, ...direct].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.status(200).json(all);
  } catch (error) {
    console.error("Fetch Notifications Error:", error);
    res.status(500).json({ error: "Server error fetching notifications" });
  }
};

// ✅ Get notifications sent by coordinator
exports.getSentNotifications = async (req, res) => {
  const { senderId } = req.params;

  try {
    // Validate senderId
    const parsedId = parseInt(senderId, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: 'Invalid sender ID' });
    }

    const result = await pool.query(
      `
      (
        SELECT 
          n.id, 
          n.message, 
          n.created_at,
          'All students' AS receiver_name
        FROM broadcast_notifications n
        WHERE n.sender_id = $1 AND n.is_for_all = TRUE
      )
      UNION
      (
        SELECT 
          un.id, 
          un.message, 
          un.created_at,
          COALESCE(s.name, g.name, h.name, c.name, u.email) AS receiver_name
        FROM user_notifications un
        JOIN users u ON u.id = un.user_id
        LEFT JOIN student s ON s.email = u.email
        LEFT JOIN guides g ON g.email = u.email
        LEFT JOIN hod h ON h.email = u.email
        LEFT JOIN coordinators c ON c.email = u.email
        WHERE un.sender_id = $1
      )
      ORDER BY created_at DESC
      `,
      [parsedId]
    );

    res.status(200).json(result.rows.map(r => ({
      ...r,
      created_at: formatIST(r.created_at)
    })));
  } catch (error) {
    console.error("Fetch Sent Notifications Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete notification
exports.deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: 'Invalid notification ID' });
    }

    const result = await pool.query(
      `DELETE FROM user_notifications WHERE id = $1 RETURNING *;`,
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
