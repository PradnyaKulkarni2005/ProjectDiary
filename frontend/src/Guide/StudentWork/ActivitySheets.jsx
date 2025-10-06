import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getActivitySheets } from "../../api";
import styles from "./ActivitySheets.module.css";

export default function ActivitySheets() {
  const { groupId } = useParams();
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const data = await getActivitySheets(groupId);
        setSheets(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSheets();
  }, [groupId]);

  if (loading)
    return <div className={styles.loader}>Loading activity sheets...</div>;

  return (
    <div className={styles.container}>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={styles.title}
      >
        Activity Sheets for Group {groupId}
      </motion.h2>

      {sheets.length === 0 ? (
        <p className={styles.emptyText}>No activity sheets submitted yet.</p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={styles.tableWrapper}
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Task</th>
                <th>Scope of Work</th>
                <th>Proposed Solution</th>
                <th>Guide Remarks</th>
                <th>Submission Date</th>
              </tr>
            </thead>
            <tbody>
              {sheets.map((sheet) => (
                <tr key={sheet.sheetid}>
                  <td>{sheet.month}</td>
                  <td>{sheet.task}</td>
                  <td>{sheet.scope_of_work}</td>
                  <td>{sheet.proposed_solution}</td>
                  <td>{sheet.guide_remarks || "—"}</td>
                  <td>
                    {new Date(sheet.submission_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
