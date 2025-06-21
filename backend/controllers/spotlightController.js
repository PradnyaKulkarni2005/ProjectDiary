const db = require('../config/db');

// ✅ Update spotlight with logging
exports.updateSpotlight = async (req, res) => {
  const { text, expiry_at } = req.body;

  try {
    console.log('👉 New Spotlight Request:', { text, expiry_at });

    // Fetch existing active spotlights
    const existing = await db.query(`
      SELECT content FROM spotlight
      WHERE expiry_at > NOW()
      ORDER BY created_at DESC
    `);

    console.log('🗃 Existing Active Spotlights:', existing.rows);

    let combinedContent = text;
    if (existing.rows.length > 0) {
      const currentActiveTexts = existing.rows.map(row => row.content).join(' | ');
      combinedContent = `${text} | ${currentActiveTexts}`;
    }

    console.log('📝 Final Combined Spotlight:', combinedContent);

    await db.query(
      `INSERT INTO spotlight (content, expiry_at) VALUES ($1, $2)`,
      [combinedContent, expiry_at]
    );

    res.status(201).json({ message: 'Spotlight updated successfully' });
  } catch (error) {
    console.error('❌ Error updating spotlight:', error);
    res.status(500).json({ message: 'Server error updating spotlight' });
  }
};

// ✅ Fetch valid spotlights
exports.getValidSpotlights = async (req, res) => {
  try {
    console.log('📢 Fetching valid spotlights...');

    const result = await db.query(`
      SELECT content FROM spotlight
      WHERE expiry_at > NOW()
      ORDER BY created_at DESC
    `);

    console.log('✅ Spotlights fetched from DB:', result.rows);

    const texts = result.rows.map(row => row.content);
    res.json({ spotlights: texts });
  } catch (error) {
    console.error('❌ Error fetching spotlights:', error);
    res.status(500).json({ message: 'Error fetching spotlights' });
  }
};
