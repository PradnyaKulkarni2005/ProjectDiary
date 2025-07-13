const pool = require('../config/db');

// Get guides by department
exports.getGuidesByDepartment = async (req, res) => {
    // Extract department from query parameters
  const { department } = req.query;
// Validate department
  if (!department) {
    return res.status(400).json({ message: 'Department is required' });
  }
// Fetch guides from the database
  try {
    const result = await pool.query(
      'SELECT id, name, email FROM users WHERE role = $1 AND department = $2',
      ['guide', department]
    );

    res.status(200).json({ guides: result.rows });
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ message: 'Failed to fetch guides' });
  }
};
