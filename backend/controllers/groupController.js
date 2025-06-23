const db = require('../config/db');

// Create a new project group
exports.createGroup = async (req, res) => {
  const { leaderId, members } = req.body;

  try {
    // 1. Create the group
    const groupResult = await db.query(
      'INSERT INTO project_groups (leader_id, status) VALUES ($1, $2) RETURNING id',
      [leaderId, 'pending']
    );
    const groupId = groupResult.rows[0].id;

    // 2. Add leader to the group as accepted
    await db.query(
      'INSERT INTO group_members (group_id, user_id, status) VALUES ($1, $2, $3)',
      [groupId, leaderId, 'accepted']
    );

    // 3. Add members and send notifications
    for (const member of members) {
      const userResult = await db.query(
        'SELECT id FROM users WHERE email = $1',
        [member.email]
      );

      if (userResult.rows.length === 0) {
        console.warn(`Member with email ${member.email} not found. Skipping.`);
        continue;
      }

      const userId = userResult.rows[0].id;

      await db.query(
        'INSERT INTO group_members (group_id, user_id, status) VALUES ($1, $2, $3)',
        [groupId, userId, 'pending']
      );

      await db.query(
        'INSERT INTO notifications (user_id, message, type, seen) VALUES ($1, $2, $3, $4)',
        [
          userId,
          `You are invited to join a group by user ID ${leaderId}`,
          'group_invite',
          false,
        ]
      );
    }

    res.status(201).json({ message: 'Group created and invites sent' });

  } catch (err) {
    console.error('Group creation error:', err);
    res.status(500).json({ error: 'Failed to create group' });
  }
};

// Respond to a group invitation
exports.respondToInvite = async (req, res) => {
  const { userId, groupId, action } = req.body;

  if (!userId || !groupId || !action) {
    return res.status(400).json({ message: 'Missing userId, groupId, or action' });
  }

  try {
    const update = await db.query(
      `UPDATE group_members 
       SET status = $1 
       WHERE user_id = $2 AND group_id = $3 
       RETURNING *`,
      [action, userId, groupId]
    );

    if (update.rowCount === 0) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    res.json({ message: `Invitation ${action}`, data: update.rows[0] });

  } catch (err) {
    console.error('Error in respondToInvite:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Check if a user is already in a group or has a pending invitation
exports.checkUserGroupStatus = async (req, res) => {
  const userId = req.params.userId;

  try {
    const leaderCheck = await db.query(
      'SELECT * FROM project_groups WHERE leader_id = $1 AND status = $2',
      [userId, 'formed']
    );

    const memberCheck = await db.query(
      'SELECT * FROM group_members WHERE user_id = $1 AND status = $2',
      [userId, 'accepted']
    );

    const pendingCheck = await db.query(
      'SELECT * FROM group_members WHERE user_id = $1 AND status = $2',
      [userId, 'pending']
    );

    const hasGroup = leaderCheck.rows.length > 0 || memberCheck.rows.length > 0;
    const hasPendingInvitation = pendingCheck.rows.length > 0;

    return res.json({
      hasGroup,
      hasPendingInvitation
    });

  } catch (err) {
    console.error('Error checking group status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get pending invitations for a user
exports.getInvitations = async (req, res) => {
  const userId = req.params.userId;

  try {
    const invitations = await db.query(
      `SELECT gm.group_id, gm.status, u.email AS leader_email
       FROM group_members gm
       JOIN project_groups pg ON gm.group_id = pg.id
       JOIN users u ON pg.leader_id = u.id
       WHERE gm.user_id = $1 AND gm.status = 'pending'`,
      [userId]
    );

    res.json({ invitations: invitations.rows });

  } catch (err) {
    console.error('Error fetching invitations:', err);
    res.status(500).json({ message: 'Failed to fetch invitations' });
  }
};

// Get group members and their statuses for a leader
exports.getGroupMemberStatuses = async (req, res) => {
  const leaderId = parseInt(req.params.leaderId, 10);

  if (!leaderId) return res.status(400).json({ message: 'Invalid leader ID' });

  try {
    const groupRes = await db.query(
      'SELECT id FROM project_groups WHERE leader_id = $1',
      [leaderId]
    );

    if (groupRes.rows.length === 0) {
      return res.json({ members: [] });
    }

    const groupId = groupRes.rows[0].id;

    const membersRes = await db.query(
      `SELECT 
         s.name, 
         s.prn, 
         s.department, 
         gm.status
       FROM group_members gm
       JOIN users u ON gm.user_id = u.id
       JOIN student s ON s.email = u.email
       WHERE gm.group_id = $1`,
      [groupId]
    );

    res.json({ members: membersRes.rows });

  } catch (err) {
    console.error('Error fetching group member statuses:', err);
    res.status(500).json({ message: 'Failed to fetch member statuses' });
  }
};

// pending invites for user
exports.getPendingInvites = async (req, res) => {
  const userId = Number(req.params.userId);

  if (!Number.isInteger(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const result = await db.query(
      `SELECT pg.id AS group_id, pg.status, u.email AS leader_email
       FROM group_members gm
       JOIN project_groups pg ON gm.group_id = pg.id
       LEFT JOIN users u ON pg.leader_id = u.id
       WHERE gm.user_id = $1 AND gm.status = 'pending'`,
      [userId]
    );

    return res.json({
      hasPendingInvites: result.rows.length > 0,
      pendingInvites: result.rows,
    });
  } catch (err) {
    console.error('🔥 Error fetching pending invites:', err.message);
    return res.status(500).json({ message: 'Failed to fetch pending invites' });
  }
};
