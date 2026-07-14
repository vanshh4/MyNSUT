# MyNSUT — Database Schema V1

## 1. Document Purpose

This document defines the first planned relational database schema for MyNSUT.

The target database is PostgreSQL.

The schema is designed for:

1. Verified student authentication.
2. Role-based access control.
3. Class announcements and tasks.
4. Notices and circulars.
5. Society groups.
6. Events and registrations.
7. Academic records through Gazette parsing.
8. Privacy settings.
9. Admin audit logs.

---

## 2. Design Principles

1. Use UUID primary keys for most tables.
2. Use unique constraints for email and roll number.
3. Store uploaded files in object storage and save URLs in database.
4. Keep academic visibility controlled through privacy settings.
5. Use scoped role tables for class and society permissions.
6. Use transactions for event booking.
7. Keep audit logs for sensitive admin operations.

---

## 3. Entity Groups

The database is divided into these groups:

1. Identity and authentication.
2. Student and academic profile.
3. Classes and announcements.
4. Notices.
5. Societies.
6. Events.
7. Gazette parser and academic records.
8. Files.
9. Admin and audit logs.

---

## 4. Identity Tables

## 4.1 users

Stores authenticated platform users.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Internal user ID |
| email | varchar | unique, not null | NSUT email |
| email_verified | boolean | default false | OAuth verification status |
| google_sub | varchar | unique, not null | Google OAuth subject ID |
| full_name | varchar | not null | Name from Google or onboarding |
| profile_image_url | text | nullable | Object storage or Google image URL |
| status | enum | active/suspended/deleted | Account status |
| onboarding_completed | boolean | default false | Whether first-time onboarding is complete |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

Important constraints:

```text
unique(email)
unique(google_sub)
email must end with @nsut.ac.in, enforced in application and optionally DB check
```

---

## 4.2 students

Stores NSUT student-specific identity.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Student ID |
| user_id | uuid | unique, foreign key users(id) | Linked user |
| ums_roll_number | varchar | unique, not null | UMS roll number |
| branch | varchar | not null | Branch code/name |
| batch_year | integer | not null | Admission or batch year |
| graduation_year | integer | nullable | Expected graduation year |
| current_semester | integer | nullable | Current semester |
| class_id | uuid | nullable, foreign key classes(id) | Current class |
| bio | text | nullable | Student bio |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

Important constraints:

```text
unique(user_id)
unique(ums_roll_number)
```

---

## 5. Role and Permission Tables

## 5.1 roles

Defines system roles.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Role ID |
| code | varchar | unique, not null | Role code |
| name | varchar | not null | Display name |
| description | text | nullable | Role description |
| is_global | boolean | default false | Global or scoped role |
| created_at | timestamp | not null | Creation timestamp |

Initial role codes:

```text
SUPER_ADMIN
STUDENT
CLASS_CR
SOCIETY_PRESIDENT
SOCIETY_VICE_PRESIDENT
SOCIETY_MEMBER
```

---

## 5.2 permissions

Defines permission codes.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Permission ID |
| code | varchar | unique, not null | Permission code |
| description | text | nullable | Permission description |
| created_at | timestamp | not null | Creation timestamp |

---

## 5.3 role_permissions

Maps roles to permissions.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| role_id | uuid | foreign key roles(id) | Role |
| permission_id | uuid | foreign key permissions(id) | Permission |

Primary key:

```text
(role_id, permission_id)
```

---

## 5.4 user_global_roles

Assigns global roles to users.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| user_id | uuid | foreign key users(id) | User |
| role_id | uuid | foreign key roles(id) | Global role |
| assigned_by | uuid | foreign key users(id), nullable | Assigning admin |
| assigned_at | timestamp | not null | Assignment time |

Primary key:

```text
(user_id, role_id)
```

---

## 6. Class Tables

## 6.1 classes

Stores academic class groups.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Class ID |
| name | varchar | not null | Display name |
| branch | varchar | not null | Branch |
| batch_year | integer | not null | Batch year |
| graduation_year | integer | nullable | Graduation year |
| section | varchar | nullable | Section |
| semester | integer | nullable | Semester |
| status | enum | active/archived | Class status |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

Recommended unique constraint:

```text
unique(branch, batch_year, section, semester)
```

---

## 6.2 class_roles

Stores scoped class roles such as CR.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Class role assignment ID |
| class_id | uuid | foreign key classes(id) | Class scope |
| user_id | uuid | foreign key users(id) | User |
| role_id | uuid | foreign key roles(id) | Role, usually CLASS_CR |
| assigned_by | uuid | foreign key users(id), nullable | Assigning admin |
| assigned_at | timestamp | not null | Assignment timestamp |
| expires_at | timestamp | nullable | Optional expiry |

Recommended unique constraint:

```text
unique(class_id, user_id, role_id)
```

---

## 6.3 class_announcements

Stores announcements created for a class.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Announcement ID |
| class_id | uuid | foreign key classes(id) | Target class |
| created_by | uuid | foreign key users(id) | Creator |
| title | varchar | not null | Announcement title |
| body | text | not null | Announcement content |
| priority | enum | normal/important/urgent | Priority |
| deadline_at | timestamp | nullable | Optional deadline |
| is_pinned | boolean | default false | Pin status |
| status | enum | published/archived/deleted | Status |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

---

## 6.4 announcement_tasks

Stores checklist items for class announcements.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Task ID |
| announcement_id | uuid | foreign key class_announcements(id) | Parent announcement |
| title | varchar | not null | Task text |
| description | text | nullable | Optional details |
| sort_order | integer | default 0 | Checklist order |
| created_at | timestamp | not null | Creation timestamp |

---

## 6.5 task_completions

Stores student completion of checklist tasks.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| task_id | uuid | foreign key announcement_tasks(id) | Task |
| student_id | uuid | foreign key students(id) | Student |
| completed_at | timestamp | not null | Completion timestamp |

Primary key:

```text
(task_id, student_id)
```

---

## 7. Notice Tables

## 7.1 notices

Stores platform notices and circulars.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Notice ID |
| title | varchar | not null | Notice title |
| body | text | not null | Notice content |
| category | enum | not null | Notice category |
| source_type | enum | admin/society/system | Source type |
| source_id | uuid | nullable | Society or related source |
| created_by | uuid | foreign key users(id) | Creator |
| is_pinned | boolean | default false | Pin status |
| visibility | enum | public/platform/society/class | Visibility scope |
| status | enum | draft/published/archived/deleted | Notice status |
| published_at | timestamp | nullable | Publish time |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

---

## 7.2 notice_attachments

Stores notice attachment URLs.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Attachment ID |
| notice_id | uuid | foreign key notices(id) | Parent notice |
| file_url | text | not null | Object storage URL |
| file_name | varchar | not null | Original file name |
| file_type | varchar | nullable | MIME type |
| uploaded_by | uuid | foreign key users(id) | Uploader |
| created_at | timestamp | not null | Upload time |

---

## 8. Society Tables

## 8.1 societies

Stores society public information.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Society ID |
| name | varchar | unique, not null | Society name |
| slug | varchar | unique, not null | URL-friendly ID |
| description | text | nullable | Society description |
| logo_url | text | nullable | Logo URL |
| cover_image_url | text | nullable | Cover image URL |
| contact_email | varchar | nullable | Contact email |
| instagram_url | text | nullable | Social link |
| linkedin_url | text | nullable | Social link |
| website_url | text | nullable | Website link |
| recruitment_status | enum | open/closed/hidden | Recruitment status |
| status | enum | active/pending/archived | Society status |
| created_by | uuid | foreign key users(id) | Admin creator |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

---

## 8.2 society_members

Stores society membership and POR information.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Membership ID |
| society_id | uuid | foreign key societies(id) | Society |
| student_id | uuid | foreign key students(id) | Student |
| role_title | varchar | nullable | POR title |
| membership_status | enum | active/invited/removed/alumni | Membership status |
| joined_at | timestamp | nullable | Join timestamp |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

Recommended unique constraint:

```text
unique(society_id, student_id)
```

---

## 8.3 society_roles

Stores scoped society management roles.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Society role assignment ID |
| society_id | uuid | foreign key societies(id) | Society scope |
| user_id | uuid | foreign key users(id) | User |
| role_id | uuid | foreign key roles(id) | Society role |
| assigned_by | uuid | foreign key users(id), nullable | Assigning user |
| assigned_at | timestamp | not null | Assignment time |
| expires_at | timestamp | nullable | Optional expiry |

Recommended unique constraint:

```text
unique(society_id, user_id, role_id)
```

---

## 8.4 society_invites

Stores invite-based society joining.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Invite ID |
| society_id | uuid | foreign key societies(id) | Society |
| invited_roll_number | varchar | nullable | Target roll number |
| invited_email | varchar | nullable | Target email |
| invited_by | uuid | foreign key users(id) | Inviter |
| token_hash | varchar | unique, not null | Hashed invite token |
| status | enum | pending/accepted/expired/revoked | Invite status |
| expires_at | timestamp | not null | Expiry time |
| accepted_by | uuid | foreign key users(id), nullable | Accepting user |
| accepted_at | timestamp | nullable | Acceptance time |
| created_at | timestamp | not null | Creation timestamp |

---

## 9. Event Tables

## 9.1 events

Stores event details.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Event ID |
| society_id | uuid | foreign key societies(id), nullable | Hosting society |
| created_by | uuid | foreign key users(id) | Creator |
| title | varchar | not null | Event title |
| description | text | not null | Event description |
| event_type | enum | workshop/competition/seminar/fest/recruitment/general | Event type |
| venue | varchar | nullable | Venue |
| starts_at | timestamp | not null | Start date/time |
| ends_at | timestamp | nullable | End date/time |
| poster_url | text | nullable | Poster image URL |
| capacity | integer | nullable | Maximum seats |
| booked_count | integer | default 0 | Seats booked |
| registration_deadline | timestamp | nullable | Deadline |
| registration_mode | enum | interested/register/book_seat/apply | Registration mode |
| visibility | enum | platform/society/private | Visibility |
| status | enum | draft/published/cancelled/completed/archived | Status |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

Important constraint:

```text
booked_count <= capacity when capacity is not null
```

---

## 9.2 event_interest

Stores interested students.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| event_id | uuid | foreign key events(id) | Event |
| student_id | uuid | foreign key students(id) | Student |
| created_at | timestamp | not null | Interest timestamp |

Primary key:

```text
(event_id, student_id)
```

---

## 9.3 event_registrations

Stores event registrations/bookings.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Registration ID |
| event_id | uuid | foreign key events(id) | Event |
| student_id | uuid | foreign key students(id) | Student |
| status | enum | registered/cancelled/waitlisted/rejected | Registration status |
| registered_at | timestamp | not null | Registration time |
| cancelled_at | timestamp | nullable | Cancellation time |
| metadata | jsonb | nullable | Extra form answers |

Recommended unique constraint:

```text
unique(event_id, student_id)
```

Concurrent booking note:

```text
Use a database transaction and SELECT ... FOR UPDATE on the event row before checking capacity and inserting registration.
```

---

## 10. Academic and Gazette Tables

## 10.1 gazette_uploads

Stores uploaded Gazette metadata.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Gazette upload ID |
| uploaded_by | uuid | foreign key users(id) | Admin uploader |
| file_url | text | not null | Gazette PDF URL |
| original_file_name | varchar | not null | Original filename |
| semester | integer | not null | Semester |
| batch_year | integer | nullable | Batch year |
| branch | varchar | nullable | Branch, if branch-specific |
| status | enum | uploaded/processing/processed/failed/partial_success | Processing status |
| processed_at | timestamp | nullable | Processing completion |
| created_at | timestamp | not null | Upload time |

---

## 10.2 semester_results

Stores semester academic records.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Result ID |
| student_id | uuid | foreign key students(id) | Student |
| gazette_upload_id | uuid | foreign key gazette_uploads(id) | Source Gazette |
| semester | integer | not null | Semester |
| sgpa | numeric(4,2) | nullable | Semester GPA |
| credits | numeric(5,2) | nullable | Semester credits |
| raw_record | jsonb | nullable | Parser snapshot |
| confidence_score | numeric(5,2) | nullable | Parser confidence |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

Recommended unique constraint:

```text
unique(student_id, semester)
```

---

## 10.3 student_academic_summary

Stores computed academic summary.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| student_id | uuid | primary key, foreign key students(id) | Student |
| cgpa | numeric(4,2) | nullable | Current CGPA |
| completed_semesters | integer | default 0 | Number of semesters processed |
| latest_semester | integer | nullable | Latest semester in database |
| updated_from_gazette_id | uuid | foreign key gazette_uploads(id), nullable | Source Gazette |
| updated_at | timestamp | not null | Last update timestamp |

---

## 10.4 student_ranks

Stores calculated ranks.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Rank record ID |
| student_id | uuid | foreign key students(id) | Student |
| semester | integer | nullable | Rank at semester, null for latest overall |
| branch_rank | integer | nullable | Rank within branch |
| college_rank | integer | nullable | Rank across college |
| branch_population | integer | nullable | Students considered in branch |
| college_population | integer | nullable | Students considered in college |
| calculated_at | timestamp | not null | Calculation time |

Recommended unique constraint:

```text
unique(student_id, semester)
```

---

## 10.5 gazette_parser_errors

Stores parser failures for manual review.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Error ID |
| gazette_upload_id | uuid | foreign key gazette_uploads(id) | Gazette source |
| roll_number | varchar | nullable | Roll number if detected |
| error_type | varchar | not null | Error category |
| error_message | text | not null | Detailed error |
| raw_fragment | text | nullable | Problematic extracted text |
| status | enum | unresolved/resolved/ignored | Review status |
| resolved_by | uuid | foreign key users(id), nullable | Admin resolver |
| resolved_at | timestamp | nullable | Resolution time |
| created_at | timestamp | not null | Error timestamp |

---

## 11. Privacy Table

## 11.1 student_privacy_settings

Stores student visibility preferences.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| student_id | uuid | primary key, foreign key students(id) | Student |
| show_cgpa | boolean | default false | Show CGPA publicly |
| show_sgpa | boolean | default false | Show semester SGPAs publicly |
| show_branch_rank | boolean | default false | Show branch rank publicly |
| show_college_rank | boolean | default false | Show college rank publicly |
| show_societies | boolean | default true | Show society memberships |
| show_pors | boolean | default true | Show PORs |
| updated_at | timestamp | not null | Last update timestamp |

---

## 12. File Table

## 12.1 files

Generic uploaded file metadata.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | File ID |
| uploaded_by | uuid | foreign key users(id) | Uploader |
| owner_type | varchar | nullable | Entity type |
| owner_id | uuid | nullable | Entity ID |
| file_url | text | not null | Object storage URL |
| file_name | varchar | not null | Original file name |
| file_type | varchar | nullable | MIME type |
| file_size_bytes | bigint | nullable | File size |
| visibility | enum | private/platform/public | File visibility |
| created_at | timestamp | not null | Upload time |

---

## 13. Audit and Moderation Tables

## 13.1 audit_logs

Stores sensitive actions.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Audit log ID |
| actor_user_id | uuid | foreign key users(id), nullable | Acting user |
| action | varchar | not null | Action code |
| target_type | varchar | nullable | Target entity type |
| target_id | uuid | nullable | Target entity ID |
| metadata | jsonb | nullable | Extra action data |
| ip_address | varchar | nullable | Request IP |
| user_agent | text | nullable | User agent |
| created_at | timestamp | not null | Action timestamp |

---

## 13.2 content_reports

Stores reports against content.

Columns:

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | primary key | Report ID |
| reported_by | uuid | foreign key users(id) | Reporter |
| target_type | varchar | not null | Content type |
| target_id | uuid | not null | Content ID |
| reason | text | not null | Report reason |
| status | enum | open/reviewing/resolved/dismissed | Report status |
| reviewed_by | uuid | foreign key users(id), nullable | Reviewer |
| reviewed_at | timestamp | nullable | Review time |
| created_at | timestamp | not null | Report timestamp |

---

## 14. Recommended Indexes

```text
users(email)
users(google_sub)
students(ums_roll_number)
students(branch, batch_year)
students(class_id)
classes(branch, batch_year, section, semester)
class_announcements(class_id, created_at)
notices(category, published_at)
notices(status, published_at)
societies(slug)
society_members(society_id)
society_members(student_id)
events(starts_at)
events(status, starts_at)
event_registrations(event_id)
event_registrations(student_id)
semester_results(student_id, semester)
student_ranks(student_id, semester)
gazette_parser_errors(gazette_upload_id, status)
audit_logs(actor_user_id, created_at)
audit_logs(action, created_at)
```

---

## 15. Initial Enums

```text
user_status: active, suspended, deleted
class_status: active, archived
announcement_priority: normal, important, urgent
content_status: draft, published, archived, deleted
notice_category: official, academic, exam, holiday, result, society, event, recruitment, general
source_type: admin, society, system
visibility: private, platform, public, society, class
society_status: pending, active, archived
recruitment_status: open, closed, hidden
membership_status: invited, active, removed, alumni
event_type: workshop, competition, seminar, fest, recruitment, general
registration_mode: interested, register, book_seat, apply
event_status: draft, published, cancelled, completed, archived
registration_status: registered, cancelled, waitlisted, rejected
gazette_status: uploaded, processing, processed, failed, partial_success
parser_error_status: unresolved, resolved, ignored
report_status: open, reviewing, resolved, dismissed
```

---

## 16. Implementation Notes

1. Use Prisma migrations to evolve this schema.
2. Add database-level unique constraints wherever possible.
3. Add backend validation even when database constraints exist.
4. Keep academic fields private by default.
5. Use transactions for multi-step writes.
6. Do not delete important records permanently unless legally or operationally required; prefer archive/status fields.
