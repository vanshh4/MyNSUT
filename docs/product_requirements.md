# MyNSUT — Product Requirements Document

## 1. Document Purpose

This document defines the functional, non-functional, user, data, access-control, and product requirements for **MyNSUT**, a verified NSUT-only student platform.

The objective of Phase 0 is to convert the project idea into a clear blueprint before implementation starts.

---

## 2. Product Summary

**MyNSUT** is a web platform, installable as a Progressive Web App, built for NSUT students. It provides verified student access, class communication, society pages, event discovery, role-based management, academic profiles, notices, and future campus utilities.

### Product Vision

> To create a centralized, verified, NSUT-only digital platform where students can manage class updates, view official notices, discover society events, maintain student profiles, and interact with campus communities securely.

---

## 3. Primary Goals

1. Allow only verified NSUT students to access the platform.
2. Provide class-specific communication through announcements and checklist tasks.
3. Provide centralized notice and circular discovery.
4. Provide society pages with role-based management.
5. Support society-created events with interest, registration, seat booking, cancellation, and waitlisting.
6. Provide student profiles with academic data and privacy controls.
7. Support Gazette-based subject-wise grades, SGPA, CGPA, and rank import/calculation by admin.
8. Establish a scalable foundation for future features such as campus map, notifications, analytics, and mobile-first improvements.

---

## 4. Non-Goals for Initial Version

The following are intentionally excluded from the first MVP:

1. Real-time chat system.
2. Full campus navigation map.
3. Native Android/iOS app.
4. Automated scraping from university systems.
5. Payment collection for events.
6. Advanced recommendation engine.
7. Placement module.
8. Attendance management.
9. Faculty login.
10. Fully automated society verification.

---

## 5. Target Users

### 5.1 Student

A verified NSUT student who logs in using an official `@nsut.ac.in` email address.

Main needs:

- View class announcements.
- Complete assigned checklist tasks.
- View notices and circulars selected by admin.
- Discover societies and events.
- Register for events or join waitlists.
- Request society membership or accept society invites.
- Manage profile privacy.

### 5.2 Class Representative

A student with class-level elevated permissions.

Main needs:

- Create class announcements.
- Add checklist tasks.
- Track task completion.
- Communicate important class-level information.

### 5.3 Society President / Vice President

A student with society-level administrative permissions.

Main needs:

- Update society page.
- Add members through invite.
- Review society membership requests.
- Create and cancel events.
- View registrations, waitlists, and interested students.
- Manage society roles.

### 5.4 Society Member

A student who belongs to a society.

Main needs:

- View internal society information.
- Display society association on profile.
- Hold a POR or role within the society.

### 5.5 Super Admin

The platform owner or trusted admin.

Main needs:

- Assign roles.
- Create and manage societies.
- Assign society presidents.
- Select notices to display on the platform.
- Upload Gazette reports.
- Review Gazette parser errors.
- Manage official notice metadata and redirects.
- Moderate users and content.

---

## 6. Authentication Requirements

### 6.1 Login Method

The platform shall use Google OAuth for authentication.

Custom passwords shall not be used.

### 6.2 Email Restriction

Only users with email addresses ending in:

```text
@nsut.ac.in
```

shall be allowed to complete login.

### 6.3 First-Time Onboarding

On first successful Google OAuth login, the user must complete onboarding by providing:

1. UMS roll number.
2. Full name, if not available from Google profile.
3. Section.
4. Optional profile fields such as bio or profile image, if implemented.

The following fields should be auto-derived from UMS roll number wherever possible:

1. Admission year.
2. Branch code.
3. Base class group.

### 6.4 Roll Number Rules

1. One roll number can belong to only one account.
2. One NSUT email can belong to only one account.
3. Roll number cannot be freely edited after onboarding.
4. Roll number corrections must be handled by Super Admin.
5. Roll number should be normalized to uppercase before validation and storage.
6. The enforced UMS roll number format shall be:

```text
<admission_year><branch_code><roll_number>
```

Example:

```text
2023UIT3324
```

This represents:

```text
Admission year: 2023
Branch code: UIT
Roll number: 3324
```

7. The system should extract the admission year and branch code from the UMS roll number during onboarding.
8. The extracted admission year and branch code should be used to auto-allot the student's academic class group wherever possible.
9. The student shall manually select their section during onboarding.
10. Super Admin should be able to correct roll number, branch, class, or section mapping if required.

---

## 7. Authorization Requirements

The system shall implement Role-Based Access Control.

Authorization must be checked at both:

1. UI level, to hide unavailable actions.
2. Backend/API level, to prevent unauthorized operations.

UI hiding alone is not sufficient.

---

## 8. Core Functional Requirements

## 8.1 Student Dashboard

The dashboard shall show:

1. Class announcements.
2. Pending checklist tasks.
3. Important admin-selected notices.
4. Upcoming events.
5. Event registrations and waitlist status.
6. Society updates, if applicable.
7. Quick links to profile, notices, societies, and events.

---

## 8.2 Student Profile

Each student shall have a profile containing:

1. Name.
2. UMS roll number.
3. NSUT email.
4. Branch code extracted from UMS roll number.
5. Admission year extracted from UMS roll number.
6. Graduation year, if calculated or provided.
7. Section selected by student.
8. Class group.
9. Societies.
10. PORs.
11. Badges, if introduced later.
12. Subject-wise grades, if available.
13. SGPA semester-wise, if available.
14. CGPA, if available.
15. Branch rank, if calculated.
16. College rank, if calculated.

### Privacy Requirements

The following fields must be privacy-controlled:

1. CGPA visibility.
2. Semester-wise SGPA visibility.
3. Subject-wise grades visibility.
4. Branch rank visibility.
5. College rank visibility.
6. Society membership visibility.
7. POR visibility.

Recommended default:

```text
CGPA: Visible by default
Branch rank: Visible by default
College rank: Visible by default
Semester-wise SGPA: Visible by default
Subject-wise grades: Visible by default
Society membership: Public by default
PORs: Public by default
```

Students must still be able to hide academic data from their public profile through privacy settings.

---

## 8.3 Class System

The system shall support class groups.

Each class should represent a collection of students belonging to the same academic grouping, such as:

```text
Admission Year + Branch Code + Section/Semester
```

Example:

```text
2023 / UIT / Section 2 / Semester 5
```

Class allotment rule:

1. Admission year and branch code should be extracted from the UMS roll number.
2. The platform should auto-allot the student's base class group based on extracted admission year and branch code.
3. The student should manually select their section during onboarding.
4. Super Admin should be able to correct class/section mapping if needed.

### Class Features

1. Class page.
2. Class member list.
3. CR assignment.
4. Class announcements.
5. Checklist task creation.
6. Student-level task completion.
7. Important announcement tagging.

---

## 8.4 Class Announcements and Checklist Tasks

CRs shall be able to create announcements for their assigned class.

An announcement may contain:

1. Title.
2. Description.
3. Deadline.
4. Priority.
5. Attachments, optional.
6. Checklist tasks.

Students shall be able to mark their own checklist items as complete.

CRs shall be able to view aggregate completion status.

---

## 8.5 Notices and Circulars

The platform shall provide a central notice section for admin-selected notices.

Notice categories:

1. Official.
2. Academic.
3. Exam.
4. Holiday.
5. Result.
6. Society.
7. Event.
8. Recruitment.
9. General.

Notice features:

1. List admin-selected notices.
2. Filter by category.
3. Search notices by title, category, and short summary.
4. Pin important notices.
5. Display short text notifications directly on the website.
6. Redirect document/file-based notices to the official university website instead of storing full official notice documents in the platform database.
7. Store only metadata required for display, filtering, redirection, and auditing.
8. Display creation/source information.

Notice storage rule:

```text
Do not store full official notice document contents in the database.
For notices with files/documents, store title, category, short summary, official source URL, published date, selected-by-admin metadata, and timestamps.
```

---

## 8.6 Society System

The platform shall support public and private society spaces.

### Public Society Page

Anyone with platform access can view:

1. Society name.
2. Logo.
3. Description.
4. Current POR holders.
5. Members, if society chooses to display.
6. Events.
7. Recruitment status.
8. Social links.
9. Achievements or gallery, later.

### Private Society Space

Only approved society members can access:

1. Internal announcements.
2. Member management.
3. Role/POR management.
4. Internal event planning.
5. Recruitment applicant management, later.

### Society Membership Entry

The platform shall support both membership entry methods:

1. Invite-based joining, where society managers invite a student.
2. Request-based joining, where a student requests membership in a society.

For request-based joining:

1. Student submits a join request.
2. Society President/Vice President reviews the request.
3. Society manager accepts or rejects the request.
4. Accepted students become society members.
5. Rejected requests should be stored with status but should not expose unnecessary details publicly.

### Society Onboarding

Initial society onboarding shall be manual:

1. Society contacts Super Admin.
2. Super Admin creates society.
3. Super Admin assigns President role to a UMS roll number.
4. President invites other members or reviews join requests.

---

## 8.7 Events System

Society Presidents and Vice Presidents shall be able to create events.

Event fields:

1. Title.
2. Description.
3. Hosting society.
4. Event type.
5. Date and time.
6. Venue.
7. Poster image.
8. Capacity, optional.
9. Waitlist enabled/disabled.
10. Registration deadline, optional.
11. Visibility status.
12. Registration mode.

Event action types:

1. Interested.
2. Register.
3. Book seat.
4. Join waitlist.
5. Apply for recruitment.

### Event Capacity Requirement

For limited-seat events, booking must be handled using database transactions and row-level locking to prevent overbooking.

### Event Cancellation Requirement

Event creators must be able to cancel events they manage.

Cancellation rules:

1. Society President/Vice President can cancel events created under their society.
2. Super Admin can cancel any event.
3. Cancelled events should remain visible with a clear cancelled status unless archived by admin.
4. Existing registrations should be marked as cancelled or invalidated according to the event cancellation flow.
5. Cancellation should create an audit log.

### Event Waitlist Requirement

V1 shall support event waitlisting.

Waitlist rules:

1. If an event reaches full capacity, further registration attempts should be added to the waitlist if waitlisting is enabled.
2. Waitlisted users should not increase `booked_count`.
3. If a registered user cancels and waitlist promotion is enabled, the first eligible waitlisted user should be promoted.
4. Waitlist ordering should be based on request timestamp unless a future priority rule is added.
5. Waitlist movement should be transaction-safe.

---

## 8.8 Gazette Parser and Academic Records

The system shall support admin-uploaded Gazette PDFs.

The Gazette parser shall:

1. Run only when admin uploads or triggers processing.
2. Not run when a user logs in.
3. Extract roll number and academic data.
4. Extract subject-wise grades from the publicly published Gazette PDF.
5. Store subject-wise grades for each student and semester.
6. Calculate or store SGPA based on Gazette data.
7. Calculate CGPA.
8. Automatically calculate branch rank because it is not explicitly mentioned in the Gazette.
9. Automatically calculate college rank because it is not explicitly mentioned in the Gazette.
10. Store valid records in database.
11. Store problematic records in parser error logs.
12. Continue processing even if some records fail.

### Parser Error Handling

If a student record cannot be confidently parsed, the parser must:

1. Skip that record.
2. Add the issue to `gazette_parser_errors`.
3. Store the raw text fragment, if safe and useful.
4. Continue processing other records.

### Academic Data Requirements

Gazette data should include:

1. Subject-wise grades.
2. Semester-wise SGPA.
3. Calculated CGPA.
4. Automatically calculated branch rank.
5. Automatically calculated college rank.

Rank values are not explicitly mentioned in the Gazette and must therefore be calculated by the platform after parsing the Gazette data.

---

## 8.9 File Storage

The database shall not store large binary files directly.

Files shall be stored in object storage.

Database should store:

1. File URL.
2. File type.
3. Owner reference.
4. Upload timestamp.
5. Visibility metadata.

Files include:

1. Gazette PDFs.
2. Society logos.
3. Event posters.
4. Profile images.
5. Optional non-official attachments where platform storage is permitted.

Official notice files/documents should generally not be stored by MyNSUT; they should redirect to the official university website.

---

## 8.10 Super Admin Dashboard

The Super Admin dashboard shall provide:

1. User search.
2. Role assignment.
3. Class creation.
4. CR assignment.
5. Society creation.
6. Society president assignment.
7. Notice selection and metadata management.
8. Gazette upload.
9. Gazette parser error review.
10. Content moderation.
11. Audit log viewing.

---

## 9. Non-Functional Requirements

## 9.1 Security

1. Use OAuth instead of custom passwords.
2. Verify email domain on backend.
3. Use server-side role checks.
4. Validate all input using schemas.
5. Use database constraints for uniqueness.
6. Use audit logs for sensitive actions.
7. Use rate limiting on sensitive APIs.
8. Provide privacy controls even though CGPA/ranks are visible by default.
9. Do not store full official notice document contents in the database.

## 9.2 Performance

1. Dashboard should load important data quickly.
2. Gazette parsing should run as an admin process, not on normal page loads.
3. Use pagination for large member/event/notice lists.
4. Use indexes on frequently queried fields.
5. Precompute CGPA and ranks after Gazette parsing instead of recalculating on every profile visit.

## 9.3 Scalability

1. Database schema should support multiple batches, branches, sections, societies, and events.
2. Role system should support new roles later.
3. Privacy model should support new sensitive fields later.
4. Event system should support more event types later.
5. Academic model should support subject-wise grades, semester summaries, and computed rankings.

## 9.4 Reliability

1. Event booking must not exceed capacity.
2. Waitlist promotion must be transaction-safe.
3. Parser should not crash due to a few bad records.
4. Critical admin actions should be logged.
5. Failed file uploads should not create incomplete records.
6. Event cancellation should consistently update registration state.

## 9.5 Maintainability

1. Keep business logic separate from UI.
2. Use typed models.
3. Keep validation schemas centralized.
4. Keep route permissions documented.
5. Keep database migrations versioned.

---

## 10. Success Metrics

For MVP:

1. At least 100 verified student signups.
2. At least 5 active classes.
3. At least 3 societies onboarded.
4. At least 10 events/notices created.
5. Event booking works without overbooking.
6. Event waitlisting works correctly after capacity is full.
7. Event creators can cancel their events.
8. Privacy settings correctly hide academic data when changed by a student.
9. Gazette parser processes subject-wise grade records and logs failures cleanly.

---

## 11. Assumptions

1. NSUT students have access to `@nsut.ac.in` email accounts.
2. UMS roll number format follows `<admission_year><branch_code><roll_number>`, for example `2023UIT3324`.
3. Admission year and branch code can be extracted from the UMS roll number for class auto-allotment.
4. Students can correctly select their section during onboarding.
5. Society onboarding can be manually controlled in the first version.
6. Gazette PDFs are publicly available and contain subject-wise grades for students.
7. Students should control visibility of academic information, but CGPA and ranks are visible by default.
8. The platform starts as a web/PWA application, not a native mobile app.

---

## 12. Finalized Product Decisions

The following decisions resolve the Phase 0 open questions.

### 12.1 UMS Roll Number Format

The enforced format shall be:

```text
<admission_year><branch_code><roll_number>
```

Example:

```text
2023UIT3324
```

This example means:

```text
Admission year: 2023
Branch code: UIT
Roll number: 3324
```

The platform should normalize roll numbers to uppercase before validation and storage.

### 12.2 Class and Section Assignment

Class should be auto-allotted using the UMS roll number.

Rules:

1. Extract admission year from the first four digits.
2. Extract branch code from the alphabetic branch segment.
3. Extract student roll number from the trailing numeric segment.
4. Use admission year and branch code to auto-allot the base class group.
5. Ask the student to manually select their section during onboarding.
6. Allow Super Admin to correct mappings.

### 12.3 Academic Visibility Default

CGPA and ranks should be visible by default.

Default academic visibility:

```text
CGPA: visible
SGPA: visible
Subject-wise grades: visible
Branch rank: visible
College rank: visible
```

Students must still have privacy toggles to hide these fields.

### 12.4 Society Membership Entry

Societies shall support both:

1. Invite-based membership.
2. Request-based membership.

Students can request to join a society. Society managers can accept or reject the request. Society managers can also directly invite students.

### 12.5 Notice Publishing and Storage

Only admin-selected notices should be displayed on the platform.

Notice storage rule:

1. Text-only notifications may be displayed directly on the website.
2. Notices containing official documents/files should redirect users to the official university website.
3. The platform should not store full official notice document contents in the database.
4. The database should store only required notice metadata such as title, category, short summary, official URL, selected-by-admin metadata, and timestamps.

### 12.6 Event Cancellation

Event creators should have the option to cancel events.

Rules:

1. Society President/Vice President can cancel their society events.
2. Super Admin can cancel any event.
3. Cancelled events should be clearly marked.
4. Registered users should see the cancelled status.
5. Event cancellation should create an audit log.

### 12.7 Event Waitlisting

V1 should support waitlisting.

Rules:

1. When an event reaches capacity, additional users can join a waitlist if enabled.
2. Waitlisted users should not count as booked users.
3. If a booked seat becomes available, the earliest eligible waitlisted user may be promoted.
4. Waitlist movement should be transaction-safe.

### 12.8 Gazette Academic Data

Gazette data should include:

1. Subject-wise grades.
2. Semester-wise SGPA.
3. Calculated CGPA.
4. Automatically calculated branch rank.
5. Automatically calculated college rank.

Rank values are not explicitly mentioned in the Gazette and must therefore be calculated by the platform after parsing the Gazette data.
