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

    const department = studentResult.rows[0].department.trim();
console.log("Cleaned department:", JSON.stringify(department));

const guidesResult = await db.query(
  `SELECT id, name, email, contact 
   FROM guides 
   WHERE department = $1`,
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

    // Step 2: fetch invites with team details
    const invites = await db.query(
      `SELECT 
          gp.id AS preference_id,
          gp.status,
          pg.team_name,
          pg.project_title,
          pg.description,
          json_agg(
            json_build_object('id', u.id, 'email', u.email)
          ) AS members
       FROM guide_preferences gp
       JOIN project_groups pg ON pg.id = gp.group_id
       JOIN group_members gm ON gm.group_id = gp.group_id
       JOIN users u ON u.id = gm.user_id
       WHERE gp.guide_id = $1 
         AND gp.status = 'pending'
       GROUP BY gp.id, gp.status, pg.team_name, pg.project_title, pg.description`,
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

// Get all groups assigned to this guide
// backend/controllers/guideController.js
// backend/controllers/guideController.js
exports.getMyGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the guide's email from users table
    const userResult = await db.query(
      "SELECT email FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const guideEmail = userResult.rows[0].email;

    // Get the guide's actual guide ID from guides table
    const guideResult = await db.query(
      "SELECT id FROM guides WHERE email = $1",
      [guideEmail]
    );

    if (guideResult.rowCount === 0) {
      return res.status(404).json({ message: "Guide not found in guides table" });
    }

    const guideId = guideResult.rows[0].id;

    // Get all groups assigned to this guide
    const groupsResult = await db.query(
      `SELECT g.id AS group_id, g.team_name, g.project_title
       FROM project_groups g
       JOIN guide_preferences gp ON gp.group_id = g.id
       WHERE gp.guide_id = $1 AND gp.status = 'accepted'`,
      [guideId]
    );

    res.json(groupsResult.rows);
  } catch (err) {
    console.error("Error fetching guide groups:", err);
    res.status(500).json({ message: "Failed to fetch guide groups" });
  }
};


exports.addReviewAssessment = async (req, res) => {
  const { stage_number, review_number, marks, comments } = req.body;
  const guideUserId = req.user.id;   // from token
  const team_id = req.body.group_id; // should come from frontend

  try {
    // find guide by joining users + guides on email
    const guideResult = await db.query(
      `SELECT g.id 
       FROM guides g
       JOIN users u ON g.email = u.email
       WHERE u.id = $1`,
      [guideUserId]
    );

    if (guideResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Guide profile not found." });
    }

    const guide_id = guideResult.rows[0].id;

    const query = `
      INSERT INTO review_assessments 
        (team_id, guide_id, stage_number, review_number, marks, comments, assessment_date) 
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (team_id, stage_number, review_number) 
      DO UPDATE SET 
        marks = EXCLUDED.marks,
        comments = EXCLUDED.comments,
        guide_id = EXCLUDED.guide_id,
        assessment_date = NOW()
      RETURNING *;
    `;

    const values = [team_id, guide_id, stage_number, review_number, marks, comments];
    const { rows } = await db.query(query, values);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("❌ Error saving review assessment:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};





// Get all reviews for a team, grouped by stage
// Controller
exports.getGroupReviews = async (req, res) => {
  const { groupId } = req.params;

  try {
    const result = await db.query(
      `SELECT ra.id, ra.review_number, ra.marks, ra.comments, 
              ra.assessment_date, ra.stage_number,
              g.name AS guide_name, g.email AS guide_email
       FROM review_assessments ra
       JOIN guides g ON ra.guide_id = g.id
       WHERE ra.team_id = $1
       ORDER BY ra.stage_number, ra.review_number`,
      [groupId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Update a review (in case guide wants to edit)
exports.updateReviewAssessment = async (req, res) => {
  const { id: reviewId } = req.params; // Renamed for clarity
  const { marks, comments } = req.body;
  const loggedInUserId = req.user.id; // From your 'protect' middleware token

  try {
    // 1. Get the 'guide_id' of the logged-in user from the 'guides' table
    const guideResult = await db.query(
      `SELECT id FROM guides WHERE user_id = $1`, 
      [loggedInUserId]
    );

    if (guideResult.rows.length === 0) {
      return res.status(403).json({ success: false, error: "Forbidden: User is not a guide." });
    }
    const loggedInGuideId = guideResult.rows[0].id;

    // 2. Modify the UPDATE query to include a check for the guide's ID
    const query = `
      UPDATE review_assessments 
      SET marks = $1, comments = $2, assessment_date = NOW()
      WHERE id = $3 AND guide_id = $4 -- <-- This is the crucial security check
      RETURNING *;
    `;
    const values = [marks, comments, reviewId, loggedInGuideId];

    const { rows } = await db.query(query, values);

    // 3. This check now handles both "Not Found" and "Forbidden"
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: "Review not found or you do not have permission to edit it." 
      });
    }

    res.status(200).json({ success: true, data: rows[0] });

  } catch (error) {
    console.error("❌ Error updating review:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// // Get activity sheets for a guide
// exports.getGuideActivitySheets = async (req, res) => {
//   try {
//     const { id, role } = req.user || {};

//     if (!id || role !== 'guide') {
//       return res.status(403).json({ message: 'Not authorized as guide' });
//     }

//     const { month } = req.query; 

//     let query = `
//       SELECT 
//         a.sheetid, a.groupid, a.month, a.task, a.scope_of_work, a.proposed_solution,
//         a.guide_remarks, a.submission_date,
//         pg.team_name, pg.project_title
//       FROM activity_sheets a
//       JOIN project_groups pg ON pg.id = a.groupid
//       JOIN guide_preferences gp ON gp.group_id = pg.id
//       WHERE gp.guide_id = $1 AND gp.status = 'accepted'
//     `;

//     const params = [id];
// // If month is provided, filter by it
//     if (month) {
//       query += ' AND a.month = $2';
//       params.push(month);
//     }
// // Order by submission date

//     query += ' ORDER BY a.submission_date DESC';

//     const result = await db.query(query, params);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'No activity sheets found for your groups' });
//     }

//     res.json(result.rows);
//   } catch (error) {
//     console.error('getGuideActivitySheets error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
