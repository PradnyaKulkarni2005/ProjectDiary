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

