import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaBookOpen, FaLightbulb } from "react-icons/fa";
import styles from "./GroupView.module.css";

export default function GroupView({ groupId }) {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Activity Sheets",
      description: "View, evaluate, and download student activity sheets.",
      icon: <FaFileAlt />,
      path: `/guides/group/${groupId}/activity-sheets`,
      color: "#4F46E5", // Indigo
    },
    {
      title: "Publications",
      description: "Browse and review research papers or journals.",
      icon: <FaBookOpen />,
      path: `/guides/group/${groupId}/publications`,
      color: "#059669", // Emerald
    },
    {
      title: "Patents",
      description: "Explore submitted or approved patents and details.",
      icon: <FaLightbulb />,
      path: `/guides/group/${groupId}/patents`,
      color: "#F59E0B", // Amber
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Student Work for <span>Group {groupId}</span>
      </h2>

      <div className={styles.grid}>
        {sections.map((section, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={() => navigate(section.path)}
          >
            <div
              className={styles.icon}
              style={{ backgroundColor: section.color }}
            >
              {section.icon}
            </div>
            <h3 className={styles.cardTitle}>{section.title}</h3>
            <p className={styles.cardDesc}>{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
