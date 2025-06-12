# 🎓 Project Group Formation & Tracking System

An autonomous institute's complete project management solution — from group formation to final evaluation — for students, guides, coordinators, HODs, and directors.

---

## 🚀 Features at a Glance

- 🔐 **Role-based login** for Students, Guides, Coordinators, HOD, and Director
- 👥 **Project group creation**, member invitations, and guide selection
- 💬 **Notification system** between all roles
- 📅 **Meeting scheduling**, evaluation tracking, and feedback
- 📊 **Centralized dashboard** for real-time status monitoring
- 📢 **Spotlight updates** and deadline alerts for students

---

## 👩‍🎓 Student Flow

### 💡 Key Capabilities

- Create or join project group
- Enter guide preferences and project rough idea
- Track guide acceptance and team status
- Submit activity reports and review meeting schedules
- View evaluation schedule and feedback

### 🧭 Step-by-Step Flow

1. Login/Register
2. Create or join a group
3. Fill in student + group details
4. Invite members via PRN
5. Guide preferences & project info entry
6. Guide reviews and accepts/rejects
7. System generates group credentials
8. Access shared group dashboard
9. Submit reports, view schedules, and feedback

---

## 👨‍🏫 Guide Flow

### 💡 Key Capabilities

- Accept/reject incoming group requests
- Schedule meetings and post notes
- Evaluate projects (3-phase reviews)
- Submit final evaluations (marks per student)

### 🧭 Step-by-Step Flow

1. Register/Login
2. View pending and accepted group requests
3. Accept/reject requests with optional notes
4. Add meeting schedules & notes
5. Fill evaluation forms for reviews

---

## 🧑‍💼 Coordinator Flow

### 💡 Key Capabilities

- Monitor student and guide participation
- Send reminders and notifications
- Schedule evaluations and deadlines
- Post spotlight updates
- Track group formation and project progress

### 🧭 Step-by-Step Flow

1. Login as Coordinator
2. Access student/guide database
3. Track pending actions
4. Send reminders and broadcast announcements
5. Export group listings with guide/domain info

---

## 🧑‍🏫 HOD Flow

### 💡 Key Capabilities

- Monitor all department project groups
- Track evaluation and project status
- Communicate with coordinators, guides, or students

### 🧭 Step-by-Step Flow

1. Login with HOD credentials
2. View department-wise group progress
3. Identify bottlenecks
4. Notify concerned personnel

---

## 👨‍💼 Director Flow

### 💡 Key Capabilities

- View cross-departmental progress
- Search groups by domain
- Communicate with HODs for corrective actions

### 🧭 Step-by-Step Flow

1. Login as Director
2. Access all department project data
3. Filter and analyze progress
4. Notify HODs as needed

---

## 🔧 Technical Overview

- **JWT + Session-based Auth** (Role-specific routing)
- **Conditional UI** rendering via status flags
- **Notification System** (sender_id, receiver_id model)
- **CRUD APIs** for meetings, evaluations, and announcements
- **Database Relations**:
  - One-to-many: `Group → Members`, `Guide → Groups`
  - Group-centric login credentials after team is formed

---

## 🗃️ Database Schema (Simplified)

| Table          | Purpose                                             |
|----------------|-----------------------------------------------------|
| `users`        | Stores login info with roles                        |
| `groups`       | Group info: leader, guide, project details          |
| `group_members`| Maps students to a group                            |
| `notifications`| Messaging across roles                              |
| `guides`       | Extended guide info                                 |
| `meetings`     | Schedule + notes by guide                           |
| `evaluations`  | Marks + feedback for reviews                        |
| `spotlights`   | Announcement messages                               |
| `group_requests`| Tracks pending group-requests to guides            |

---

## 🧠 Implementation Highlights

- 🔄 Status tracking via DB flags (`pending`, `approved`, etc.)
- 📬 Notification trigger on key events (group requests, feedback)
- 🔒 Role-based access enforced via middleware
- 🧑‍🤝‍🧑 Co-authoring logic in group formation
- 📤 Final transition to group-level login credentials

---

## 📌 Future Enhancements

- PDF report generator for evaluations
- Real-time chat/messaging
- Admin analytics dashboard
- Attendance tracking for meetings

---

## 📃 License

This project is developed for academic and institutional use only.

---

