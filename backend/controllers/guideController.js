const db = require('../config/db');
exports.getGuidesByStudentUserId = async (req, res) => {
  
  const { userId } = req.params;
  console.log("userId param:", userId);


  try {
    // Step 1: Get student's department
    const studentResult = await db.query(
      `SELECT s.department
       FROM student s
       JOIN users u ON u.email = s.email
       WHERE u.id = $1`,
      [userId]
    );

    if (studentResult.rowCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const department = studentResult.rows[0].department;

    // Step 2: Get guides from that department
    const guidesResult = await db.query(
      'SELECT id, name, email, contact FROM guides WHERE department = $1',
      [department]
    );
    console.log('Guides fetched:', guidesResult);

    res.status(200).json({ guides: guidesResult.rows });
  } catch (error) {
    console.error('Error fetching guides by userId:', error);
    res.status(500).json({ message: 'Failed to fetch guides' });
  }
};


// get group invitations to guide
exports.getGuideInvites = async (req, res) => {
  try {
    // Step 1: get guide.id for this logged-in user
    const guideResult = await db.query(
      `SELECT id FROM guides WHERE email = (SELECT email FROM users WHERE id = $1)`,
      [req.user.id]
    );

    if (guideResult.rowCount === 0) {
      return res.status(404).json({ message: 'Guide profile not found' });
    }

    const guideId = guideResult.rows[0].id;

    // Step 2: fetch invites using guideId
    const invites = await db.query(
      `SELECT gp.id as preference_id, gp.group_id, gp.status,
              json_agg(json_build_object('id', u.id, 'email', u.email)) as members
       FROM guide_preferences gp
       JOIN group_members gm ON gm.group_id = gp.group_id
       JOIN users u ON u.id = gm.user_id
       WHERE gp.guide_id = $1 AND gp.status = 'pending'
       GROUP BY gp.id, gp.group_id, gp.status`,
      [guideId]
    );

    res.json({ invites: invites.rows });
  } catch (err) {
    console.error('Error fetching guide invites:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// accepting or rejecting the invite
exports.respondToInvite = async (req, res) => {
  const { preferenceId, action } = req.body;

  try {
    // Get the preference and related group
    const prefResult = await db.query(
      `SELECT group_id, guide_id FROM guide_preferences WHERE id = $1`,
      [preferenceId]
    );

    if (prefResult.rows.length === 0) {
      return res.status(404).json({ message: 'Preference not found' });
    }

    const { group_id, guide_id } = prefResult.rows[0];

    if (action === 'accept') {
      // Check if a guide is already accepted for this group
      const alreadyAccepted = await db.query(
        `SELECT 1 FROM guide_preferences 
         WHERE group_id = $1 AND status = 'accepted'`,
        [group_id]
      );

      if (alreadyAccepted.rows.length > 0) {
        return res.status(400).json({ message: 'Another guide has already accepted this group' });
      }

      await db.query('BEGIN');

      // Accept for current guide
      await db.query(
        `UPDATE guide_preferences SET status = 'accepted' WHERE id = $1`,
        [preferenceId]
      );

      // Reject all others for this group
      await db.query(
        `UPDATE guide_preferences SET status = 'rejected' 
         WHERE group_id = $1 AND id <> $2`,
        [group_id, preferenceId]
      );

      // Mark group as having a guide
      await db.query(
        `UPDATE project_groups SET guide_selected = true, status = 'formed' WHERE id = $1`,
        [group_id]
      );

      await db.query('COMMIT');
    } else if (action === 'reject') {
      await db.query(
        `UPDATE guide_preferences SET status = 'rejected' WHERE id = $1`,
        [preferenceId]
      );
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    res.json({ message: `Invite ${action}ed successfully` });

  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Error responding to invite:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
