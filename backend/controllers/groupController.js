const db = require('../config/db');

// Create a new project group
exports.createGroup = async (req, res) => {
  const { leaderId, members } = req.body;

  console.log('🔵 Received request to create group');
  console.log('➡️ Leader ID:', leaderId);
  console.log('➡️ Members:', members);

  try {
    // Step 1: Create the group
    const groupResult = await db.query(
      'INSERT INTO project_groups (leader_id, status) VALUES ($1, $2) RETURNING id',
      [leaderId, 'pending']
    );
    const groupId = groupResult.rows[0].id;
    console.log(`✅ Group created with ID: ${groupId}`);

    // Step 2: Add leader to the group with accepted status
    await db.query(
      'INSERT INTO group_members (group_id, user_id, status) VALUES ($1, $2, $3)',
      [groupId, leaderId, 'accepted']
    );
    console.log(`✅ Leader (ID: ${leaderId}) added to group_members`);

    const skippedEmails = [];
    const successEmails = [];

    // Step 3: Process each member
    for (const member of members) {
      console.log(`🔍 Looking for user with email: ${member.email}`);
      const userResult = await db.query(
        'SELECT id FROM users WHERE email = $1',
        [member.email]
      );

      if (userResult.rows.length === 0) {
        console.warn(`⚠️ Member with email ${member.email} not found. Skipping.`);
        skippedEmails.push(member.email);
        continue;
      }

      const userId = userResult.rows[0].id;
      console.log(`✅ Found userId ${userId} for email ${member.email}`);

      // Add member to group with 'pending' status
      await db.query(
        'INSERT INTO group_members (group_id, user_id, status) VALUES ($1, $2, $3)',
        [groupId, userId, 'pending']
      );
      console.log(`✅ Added userId ${userId} to group_members`);

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
      console.log(`📬 Notification sent to userId ${userId}`);

      successEmails.push(member.email);
    }

    return res.status(201).json({
      message: 'Group created and invitations sent',
      groupId,
      successEmails,
      skippedEmails,
    });

  } catch (err) {
    console.error('❌ Group creation error:', err);
    return res.status(500).json({ error: 'Failed to create group' });
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
    // 1. Check if user is a leader of any group
    const leaderRes = await db.query(
      `SELECT id, status FROM project_groups WHERE leader_id = $1`,
      [userId]
    );

    if (leaderRes.rows.length > 0) {
      const groupId = leaderRes.rows[0].id;
      const groupStatus = leaderRes.rows[0].status;

      // 2. Count how many members are in the group and how many accepted
      const memberCountRes = await db.query(
        `SELECT COUNT(*) FILTER (WHERE status = 'accepted') AS accepted,
                COUNT(*) AS total
         FROM group_members
         WHERE group_id = $1`,
        [groupId]
      );

      // 3. Check if guide is selected
      const guidePrefRes = await db.query(
        `SELECT COUNT(*) FROM guide_preferences WHERE group_id = $1`,
        [groupId]
      );

      const accepted = parseInt(memberCountRes.rows[0].accepted, 10);
      const total = parseInt(memberCountRes.rows[0].total, 10);
      const guideSelected = parseInt(guidePrefRes.rows[0].count, 10) > 0;

      // 4. NEW: Determine eligibility to submit guide preferences
      const eligibleForGuidePreferences =
        groupStatus === 'pending' && // project_groups.status is pending
        accepted === total &&   // all members accepted
        !guideSelected;         // guide prefs not submitted yet

      return res.json({
        hasGroup: true,
        hasPendingInvitation: false,
        isLeader: true,
        groupId,
        allMembersAccepted: accepted === total,
        guideSelected,
        eligibleForGuidePreferences // <-- added
      });
    }

    // 5. Check if user is a group member (not leader)
    const memberGroupRes = await db.query(
      `SELECT gm.group_id
       FROM group_members gm
       WHERE gm.user_id = $1 AND gm.status = 'accepted'`,
      [userId]
    );

    if (memberGroupRes.rows.length > 0) {
      const groupId = memberGroupRes.rows[0].group_id;

      // Check if guide preferences submitted
      const guidePrefRes = await db.query(
        `SELECT COUNT(*) FROM guide_preferences WHERE group_id = $1`,
        [groupId]
      );

      const guideSelected = parseInt(guidePrefRes.rows[0].count, 10) > 0;

      return res.json({
        hasGroup: true,
        hasPendingInvitation: false,
        isLeader: false,
        groupId,
        guideSelected
      });
    }

    // 6. Check if user has pending invitation
    const pendingRes = await db.query(
      `SELECT 1 FROM group_members WHERE user_id = $1 AND status = 'pending'`,
      [userId]
    );

    return res.json({
      hasGroup: false,
      hasPendingInvitation: pendingRes.rows.length > 0
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


// Submit Guide Preferences
exports.submitGuidePreferences = async (req, res) => {
  // body should contain groupId and an array of preferences
  const { groupId, preferences } = req.body;
// validating the groupId and preferences , preferences should be an array of exactly 3 guide IDs
  if (!groupId || !preferences || !Array.isArray(preferences) || preferences.length !== 3) {
    return res.status(400).json({ message: 'Exactly 3 guide preferences are required' });
  }

  try {
    // Check if group exists
    const groupCheck = await db.query('SELECT * FROM project_groups WHERE id = $1', [groupId]);
    if (groupCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Prevent resubmission
    // Check if preferences already exist for this group
    const prefCheck = await db.query(
      'SELECT * FROM guide_preferences WHERE group_id = $1',
      [groupId]
    );
    // If preferences already exist, return conflict status
    if (prefCheck.rows.length > 0) {
      return res.status(409).json({ message: 'Preferences already submitted' });
    }

    // Insert preferences
    for (let i = 0; i < preferences.length; i++) {
      await db.query(
        `INSERT INTO guide_preferences (group_id, guide_id, preference_order,status) VALUES ($1, $2, $3,'pending')`,
        [groupId, preferences[i], i + 1]
      );
    }

    res.status(201).json({ message: 'Guide preferences submitted successfully' });
  } catch (error) {
    console.error('Error submitting guide preferences:', error);
    res.status(500).json({ message: 'Server error while submitting preferences' });
  }
};