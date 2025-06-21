const db = require('../config/db');

// Submit an activity sheet
exports.submitActivitySheet = async (req, res) => {
  const { groupid, month, task, scope, solution, remarks } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO activity_sheets (groupid, month, task, scope_of_work, proposed_solution, guide_remarks)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [groupid, month, task, scope, solution, remarks]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to submit activity sheet', error: err.message });
  }
};
// GET /api/project-groups/:groupid
exports.getProjectGroup = async (req, res) => {
  try {
    const { groupid } = req.params;
    const result = await db.query('SELECT * FROM project_groups WHERE id = $1', [groupid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get activity sheets for a group (accessible to all group members)
exports.getActivitySheet = async (req, res) => {
  try {
    const { groupid } = req.user || {};
    const { sheetId } = req.params;

    if (!groupid) {
      return res.status(400).json({ message: 'Group ID missing in token' });
    }

    // Assuming sheetId is something like "4-Month1"
    const [groupFromSheet, month] = sheetId.split('-');

    if (groupFromSheet !== String(groupid)) {
      return res.status(403).json({ message: 'You are not authorized to access this sheet' });
    }

    const result = await db.query(
      'SELECT * FROM activity_sheets WHERE groupid = $1 AND month = $2 LIMIT 1',
      [groupid, month]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No activity sheet found for this month' });
    }
    console.log('getActivitySheet result:', result.rows[0]);
    res.json(result.rows[0]);

  } catch (error) {
    console.error('getActivitySheet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

