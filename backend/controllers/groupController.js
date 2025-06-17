const db = require('../config/db');

exports.createGroup = async (req, res) => {
  const { leaderId, members } = req.body;

  try {
    // 1. Create the group
    const groupResult = await db.query(
      'INSERT INTO project_groups (leader_id, status) VALUES ($1, $2) RETURNING id',
      [leaderId, 'pending']
    );
    const groupId = groupResult.rows[0].id;

    // 2. Add the team leader to the group
    await db.query(
      'INSERT INTO group_members (group_id, user_id, status) VALUES ($1, $2, $3)',
      [groupId, leaderId, 'accepted']
    );

    // 3. Loop over members
    for (const member of members) {
      const userRows = await db.query(
        'SELECT id, name FROM users WHERE email = $1',
        [member.email]
      );

      if (userRows.rows.length === 0) {
        console.warn(`Member with email ${member.email} not found. Skipping.`);
        continue;
      }

      const userId = userRows.rows[0].id;

      // Add to group_members
      await db.query(
        'INSERT INTO group_members (group_id, user_id, status) VALUES ($1, $2, $3)',
        [groupId, userId, 'pending']
      );

      // Send notification
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

exports.respondToInvite = async (req, res) => {
  const { groupId, response } = req.body;
  const userId = req.user.id;

  try {
    const memberRows = await db.query(
      'SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    );
    if (memberRows.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found in group' });
    }

    await db.query(
      'UPDATE group_members SET status = $1 WHERE group_id = $2 AND user_id = $3',
      [response, groupId, userId]
    );

    const allMembers = await db.query(
      'SELECT status FROM group_members WHERE group_id = $1',
      [groupId]
    );

    const accepted = allMembers.rows.filter(m => m.status === 'accepted');
    const rejected = allMembers.rows.filter(m => m.status === 'rejected');

    if (rejected.length > 0) {
      await db.query(
        'UPDATE project_groups SET status = $1 WHERE id = $2',
        ['pending', groupId]
      );
    } else if (accepted.length >= 3) {
      await db.query(
        'UPDATE project_groups SET status = $1 WHERE id = $2',
        ['formed', groupId]
      );
    }

    res.json({ message: `You have ${response}ed the group invite.` });
  } catch (err) {
    console.error('Error responding to invite:', err);
    res.status(500).json({ error: 'Failed to respond to invite' });
  }
};

exports.checkUserGroupStatus = async (req, res) => {
  const userId = req.params.userId;

  try {
    const leader = await db.query(
      'SELECT * FROM project_groups WHERE leader_id = $1 AND status = $2',
      [userId, 'formed']
    );
    if (leader.rows.length > 0) {
      return res.json({ hasGroup: true });
    }

    const member = await db.query(
      'SELECT * FROM group_members WHERE user_id = $1 AND status = $2',
      [userId, 'accepted']
    );
    if (member.rows.length > 0) {
      return res.json({ hasGroup: true });
    }

    return res.json({ hasGroup: false });
  } catch (err) {
    console.error('Error checking group status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getInvitations = async (req, res) => {
  const userId = req.params.userId;
  console.log('Fetching invitations for userId:', userId);

  try {
    const invitations = await db.query(
      `SELECT gm.group_id, gm.status, u.email AS leader_email
       FROM group_members gm
       JOIN project_groups pg ON gm.group_id = pg.id
       JOIN users u ON pg.leader_id = u.id
       WHERE gm.user_id = $1 AND gm.status = 'pending'`,
      [userId]
    );

    console.log('Query result:', invitations.rows);
    res.json({ invitations: invitations.rows });
  } catch (err) {
    console.error('Error fetching invitations:', err);
    res.status(500).json({ message: 'Failed to fetch invitations' });
  }
};

// Get group members’ invitation statuses for the leader
exports.getGroupMemberStatuses = async (req, res) => {
  const leaderId = parseInt(req.params.leaderId, 10);

  if (!leaderId) return res.status(400).json({ message: 'Invalid leader ID' });

  try {
    // Get leader's group ID
    const group = await db.query(
      `SELECT id FROM project_groups WHERE leader_id = $1`,
      [leaderId]
    );

    if (group.rows.length === 0) {
      return res.json({ members: [] });
    }

    const members = await db.query(
      `SELECT u.name, u.prn, gm.status
       FROM group_members gm
       JOIN users u ON gm.user_id = u.id
       WHERE gm.group_id = $1`,
      [group.rows[0].id]
    );

    res.json({ members: members.rows });
  } catch (err) {
    console.error('Error fetching group member statuses:', err);
    res.status(500).json({ message: 'Failed to fetch member statuses' });
  }
};
