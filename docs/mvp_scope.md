# MyNSUT — MVP Scope

## 1. Document Purpose

This document defines the Minimum Viable Product scope for MyNSUT.

The MVP should prove the core value of the platform without trying to build every proposed feature at once.

---

## 2. MVP Objective

The MVP should allow verified NSUT students to:

1. Log in securely.
2. Complete student onboarding.
3. View and manage a basic profile.
4. Join their class space.
5. Receive class announcements and checklist tasks.
6. View notices.
7. Discover societies.
8. View and register interest in events.
9. Use privacy controls for academic data.

The MVP should allow authorized admins/role holders to:

1. Assign CRs.
2. Create societies.
3. Assign society presidents.
4. Create official notices.
5. Upload and process Gazette PDFs, if parser is included in MVP.
6. Moderate basic role and content actions.

---

## 3. MVP User Roles

The MVP shall include the following roles:

1. SUPER_ADMIN
2. STUDENT
3. CLASS_CR
4. SOCIETY_PRESIDENT
5. SOCIETY_VICE_PRESIDENT
6. SOCIETY_MEMBER

---

## 4. MVP Feature List

## 4.1 Authentication and Onboarding

Included:

1. Google OAuth login.
2. Restriction to `@nsut.ac.in` email addresses.
3. First-time onboarding.
4. UMS roll number capture.
5. Unique roll number enforcement.
6. Basic session handling.
7. Protected routes.

Not included:

1. Custom passwords.
2. Password reset.
3. Multi-factor authentication.
4. Parent/faculty login.

---

## 4.2 Student Dashboard

Included:

1. Basic dashboard after login.
2. Quick cards for class, notices, societies, events, and profile.
3. Recent class announcements.
4. Upcoming events.
5. Important notices.

Not included:

1. Personalized recommendation engine.
2. Analytics dashboard.
3. Real-time widgets.

---

## 4.3 Student Profile and Privacy

Included:

1. Own profile page.
2. Public profile page.
3. Branch, batch, roll number, graduation year.
4. Society membership display.
5. POR display.
6. Academic data placeholders.
7. Privacy toggles for CGPA, SGPA, branch rank, college rank, societies, and PORs.

Not included:

1. Resume builder.
2. Portfolio builder.
3. Verification badges beyond basic roles.
4. Achievement certificates.

---

## 4.4 Class System

Included:

1. Class page.
2. Class member list.
3. CR assignment by Super Admin.
4. CR-created announcements.
5. Checklist tasks.
6. Student task completion.
7. Basic completion summary for CR.

Not included:

1. Attendance.
2. Timetable.
3. Faculty communication.
4. Subject-wise classroom groups.
5. Class chat.

---

## 4.5 Notices and Circulars

Included:

1. Notice listing page.
2. Category filtering.
3. Search by title/body.
4. Admin-created official notices.
5. Society-created notices.
6. Pinned notices.
7. Attachment links.

Not included:

1. Automated university notice scraping.
2. Push notifications.
3. Email notifications.
4. Approval workflow for all notices.

---

## 4.6 Society System

Included:

1. Public society listing.
2. Public society profile page.
3. Society description, logo, social links.
4. POR holders and members.
5. Manual society creation by Super Admin.
6. Manual President assignment by Super Admin.
7. Invite-based society membership.
8. Basic society management page for President/VP.

Not included:

1. Open public join requests.
2. Advanced recruitment workflow.
3. Internal file repository.
4. Society chat.
5. Election/voting module.

---

## 4.7 Events

Included:

1. Events listing page.
2. Event details page.
3. Event creation by Society President/VP.
4. Event poster upload.
5. Interested button.
6. Register or book seat button.
7. Capacity field.
8. Transaction-safe booking.
9. Registration list visible to event managers.

Not included:

1. Ticket QR codes.
2. Payment collection.
3. Attendance scanning.
4. Complex custom forms.
5. Certificates.
6. Event feedback forms.

---

## 4.8 Gazette Parser and Academic Data

Recommended MVP approach:

Include a basic admin Gazette import pipeline if feasible, but keep it operationally simple.

Included:

1. Admin-only Gazette upload.
2. Parser script triggered by admin.
3. SGPA storage.
4. CGPA calculation.
5. Branch and college rank calculation.
6. Parser error logging.
7. Manual review status for failed records.
8. Academic privacy enforcement.

Optional for MVP if parser becomes too complex:

1. Start with manual CSV import generated from Gazette extraction.
2. Add PDF parser in MVP+1.

Not included:

1. Parsing on each login.
2. Real-time rank recalculation on every page load.
3. Fully automated correction of ambiguous records.
4. Subject-wise transcript viewer, unless Gazette format is stable.

---

## 4.9 Super Admin Dashboard

Included:

1. Basic admin dashboard.
2. User search.
3. Role assignment.
4. Class creation.
5. CR assignment.
6. Society creation.
7. Society President assignment.
8. Notice creation.
9. Gazette upload and parser error view.
10. Audit log view for sensitive actions.

Not included:

1. Advanced analytics.
2. Bulk moderation workflows.
3. Complex approval queues.
4. Admin mobile app.

---

## 4.10 PWA Support

Included:

1. Web app manifest.
2. App icons.
3. Installable web app behavior.
4. Mobile responsive UI.

Not included:

1. Full offline mode.
2. Offline form submission.
3. Native push notifications.

---

## 5. MVP Page List

Public/auth pages:

```text
/
/auth/signin
/onboarding
```

Protected student pages:

```text
/dashboard
/profile/me
/profile/[rollNumber]
/settings/privacy
/classes/[classId]
/notices
/societies
/societies/[societySlug]
/events
/events/[eventId]
```

Role-protected pages:

```text
/classes/[classId]/announcements/new
/societies/[societySlug]/manage
/societies/[societySlug]/events/new
```

Admin pages:

```text
/admin
/admin/users
/admin/classes
/admin/societies
/admin/roles
/admin/notices
/admin/gazette
/admin/gazette/errors
/admin/audit-logs
```

---

## 6. MVP Data Models

MVP should minimally implement:

```text
users
students
roles
permissions
role_permissions
user_global_roles
classes
class_roles
class_announcements
announcement_tasks
task_completions
notices
notice_attachments
societies
society_members
society_roles
society_invites
events
event_interest
event_registrations
student_privacy_settings
files
audit_logs
```

If Gazette parser is included:

```text
gazette_uploads
semester_results
student_academic_summary
student_ranks
gazette_parser_errors
```

---

## 7. MVP Acceptance Criteria

## 7.1 Authentication

1. A user with `@nsut.ac.in` email can log in.
2. A user without `@nsut.ac.in` email is rejected.
3. A new student must complete onboarding before using the dashboard.
4. Duplicate roll numbers are rejected.

## 7.2 RBAC

1. Student cannot access admin pages.
2. Student cannot create class announcements unless CR.
3. CR can create announcements only for assigned class.
4. Society President can manage only assigned society.
5. Super Admin can assign roles.

## 7.3 Class Announcements

1. CR can create announcement with checklist.
2. Student can view announcement.
3. Student can mark checklist item complete.
4. CR can view completion summary.

## 7.4 Notices

1. Notices render by category.
2. Pinned notices appear prominently.
3. Attachments open through stored URLs.

## 7.5 Societies

1. Super Admin can create society.
2. Super Admin can assign President.
3. President can edit society profile.
4. President can invite members.
5. Public society page is visible to all verified users.

## 7.6 Events

1. President/VP can create event.
2. Student can mark interested.
3. Student can register/book seat.
4. Limited-seat events cannot exceed capacity.
5. Event manager can view registrations.

## 7.7 Privacy

1. Student can hide CGPA.
2. Other users cannot view hidden CGPA.
3. Student can still view own academic data.
4. Super Admin can view data if operationally needed.

## 7.8 Gazette, if included

1. Admin can upload Gazette.
2. Parser processes valid records.
3. Failed records are logged.
4. Parser does not crash on individual record failure.

---

## 8. MVP Development Order

Recommended implementation sequence:

```text
1. Project setup
2. Database schema and migrations
3. Authentication
4. Onboarding
5. RBAC foundation
6. Student profile and privacy
7. Admin dashboard base
8. Class system
9. Announcements and checklist tasks
10. Notices
11. Society system
12. Events
13. Gazette import/parser
14. PWA setup
15. Testing and deployment
```

---

## 9. MVP Risks

## 9.1 Risk: Feature Overload

Mitigation:

Build only the listed MVP features. Push map, chat, notifications, payments, and recruitment workflows to later versions.

## 9.2 Risk: Academic Privacy Concerns

Mitigation:

Make academic visibility private by default and user-controlled.

## 9.3 Risk: Gazette Parser Complexity

Mitigation:

Start with parser error logs and optional manual CSV fallback.

## 9.4 Risk: Role Abuse

Mitigation:

Use audit logs and Super Admin controls.

## 9.5 Risk: Event Overbooking

Mitigation:

Use database transactions and row-level locks.

---

## 10. MVP Completion Definition

MVP is considered complete when:

1. Verified student login works.
2. Onboarding works.
3. RBAC works server-side.
4. Student profile and privacy work.
5. CRs can create announcements and checklist tasks.
6. Students can complete tasks.
7. Notices can be created and viewed.
8. Societies can be created and managed.
9. Events can be created and registered for.
10. Event capacity is concurrency-safe.
11. Admin can manage users, roles, societies, and notices.
12. Application is deployable and installable as a PWA.
