const pool = require('../config/db');
exports.getGuidesByStudentUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Step 1: Get student's department
    const studentResult = await pool.query(
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
    const guidesResult = await pool.query(
      'SELECT id, name, email, contact FROM guides WHERE department = $1',
      [department]
    );

    res.status(200).json({ guides: guidesResult.rows });
  } catch (error) {
    console.error('Error fetching guides by userId:', error);
    res.status(500).json({ message: 'Failed to fetch guides' });
  }
};
