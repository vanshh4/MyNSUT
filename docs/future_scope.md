# MyNSUT — Future Scope

## 1. Document Purpose

This document defines features that are intentionally deferred beyond the MVP.

The purpose is to prevent scope creep while keeping the long-term product vision clear.

---

## 2. Future Scope Strategy

Future features should be added only after the MVP is stable and actively used.

Recommended decision criteria:

1. Does the feature solve a real student problem?
2. Does it increase repeated usage?
3. Does it respect privacy and security?
4. Can it be built without destabilizing the MVP?
5. Is there enough admin capacity to moderate or maintain it?

---

## 3. Future Phase 1: Notifications

## 3.1 Push Notifications

Add browser/PWA push notifications for:

1. New class announcements.
2. Urgent notices.
3. Event reminders.
4. Registration confirmation.
5. Gazette result updates.

## 3.2 Email Notifications

Optional email notifications for:

1. Event registration confirmation.
2. Society invite.
3. Admin role assignment.
4. Important official notices.

## 3.3 Notification Preferences

Students should control notification types:

```text
Class announcements: on/off
Society events: on/off
Official notices: on/off
Academic updates: on/off
Event reminders: on/off
```

---

## 4. Future Phase 2: Campus Map

The campus map should be added after core community features are stable.

## 4.1 Features

1. Interactive campus map.
2. Search for buildings, classrooms, labs, hostels, canteens, and departments.
3. Map markers for event venues.
4. Route guidance between locations.
5. Fest/event temporary stalls.
6. Accessibility-friendly routes, if data is available.
7. Location images and descriptions.

## 4.2 Possible Tables

```text
campus_locations
campus_buildings
campus_routes
campus_map_assets
event_location_markers
```

## 4.3 Suggested Implementation

Start with a static SVG/map image with clickable markers, then evolve to a full interactive map.

---

## 5. Future Phase 3: Society Recruitment Workflow

## 5.1 Recruitment Drive Creation

Societies should be able to create structured recruitment drives.

Fields:

1. Role/team name.
2. Eligibility.
3. Application deadline.
4. Form questions.
5. Round structure.
6. Result status.

## 5.2 Student Applications

Students should be able to:

1. Apply to society roles.
2. Upload resume/portfolio links.
3. Track application status.
4. Receive round updates.

## 5.3 Society Review Dashboard

Societies should be able to:

1. View applicants.
2. Shortlist applicants.
3. Move applicants across rounds.
4. Export applications.
5. Publish selected candidates.

---

## 6. Future Phase 4: Advanced Event Management

## 6.1 Ticketing

Features:

1. QR-based event passes.
2. Check-in scanning.
3. Attendance records.
4. Duplicate entry prevention.

## 6.2 Event Feedback

Features:

1. Feedback forms.
2. Ratings.
3. Society analytics.
4. Anonymous feedback, if allowed.

## 6.3 Event Certificates

Features:

1. Auto-generated participation certificates.
2. Certificate verification page.
3. Downloadable PDF certificates.

---

## 7. Future Phase 5: Academic Enhancements

## 7.1 Subject-Wise Results

If Gazette format supports it reliably, show:

1. Subject names.
2. Credits.
3. Grades.
4. Semester-wise transcript.

## 7.2 CGPA Trends

Show analytics such as:

1. Semester-wise SGPA chart.
2. CGPA progression.
3. Best semester.
4. Academic improvement trends.

## 7.3 Rank History

Show:

1. Branch rank by semester.
2. College rank by semester.
3. Rank movement.

All academic features must remain privacy-controlled.

---

## 8. Future Phase 6: Advanced Profiles and Badges

## 8.1 Badges

Possible badges:

1. Society President.
2. Event Organizer.
3. Hackathon Winner.
4. Academic Excellence.
5. Volunteer.
6. Core Team Member.

## 8.2 Portfolio Features

Student profiles may later include:

1. Projects.
2. GitHub link.
3. LinkedIn link.
4. Resume link.
5. Achievements.
6. Skills.

## 8.3 Verification System

Some achievements or roles may be admin/society verified.

---

## 9. Future Phase 7: Search and Discovery

## 9.1 Global Search

Search across:

1. Students.
2. Societies.
3. Events.
4. Notices.
5. Classes, if permitted.

## 9.2 Smart Filters

Filters for:

1. Event type.
2. Society category.
3. Date.
4. Branch.
5. Batch.
6. Recruitment status.

## 9.3 Recommendations

Optional future feature:

1. Recommended events.
2. Recommended societies.
3. Similar interest groups.

Recommendations should be transparent and privacy-safe.

---

## 10. Future Phase 8: Moderation and Reporting

## 10.1 Content Reports

Students should be able to report:

1. Incorrect notice.
2. Misleading event.
3. Inappropriate society content.
4. Incorrect profile information.

## 10.2 Moderation Queue

Super Admin should be able to:

1. Review reports.
2. Hide content.
3. Restore content.
4. Warn users.
5. Suspend repeat offenders.

---

## 11. Future Phase 9: Analytics Dashboards

## 11.1 Society Analytics

For society managers:

1. Event interest count.
2. Registration count.
3. Attendance count.
4. Profile views.
5. Recruitment applications.

## 11.2 Admin Analytics

For Super Admin:

1. Active users.
2. Signups by branch/batch.
3. Events created.
4. Most active societies.
5. Notice engagement.
6. Parser success rate.

---

## 12. Future Phase 10: Communication Features

These should be added carefully to avoid moderation burden.

Possible features:

1. Class discussion threads.
2. Society discussion threads.
3. Event Q&A.
4. Admin announcements.

Avoid real-time chat until moderation strategy is clear.

---

## 13. Future Phase 11: Integrations

Potential integrations:

1. Google Calendar export for events.
2. Calendar subscription feed.
3. Instagram/social previews for societies.
4. University notice import, if permitted.
5. QR scanner for event check-ins.

---

## 14. Future Phase 12: Mobile App

A native mobile app should be considered only after the PWA is validated.

Possible stacks:

1. React Native.
2. Expo.
3. Flutter.

Do not build native apps before the product’s core usage is proven.

---

## 15. Features Explicitly Deferred from MVP

The following are not part of MVP:

```text
Campus map
Native mobile app
Push notifications
Payments
Ticket QR scanning
Certificates
Advanced recruitment workflow
Chat system
Subject-wise transcript viewer
Advanced analytics
Recommendation engine
Global search
Faculty module
Placement module
Attendance module
```

---

## 16. Long-Term Product Direction

If MyNSUT succeeds, it can evolve into a campus operating system with:

1. Verified student identity.
2. Class communication.
3. Society and event discovery.
4. Academic profile and privacy settings.
5. Recruitment workflows.
6. Campus navigation.
7. Student portfolio.
8. Event participation history.
9. Verified achievement badges.

The correct approach is to first build a stable community and event platform, then add advanced campus utilities gradually.
