# MyNSUT — Role Permission Matrix

## 1. Document Purpose

This document defines the initial Role-Based Access Control model for MyNSUT.

The goal is to ensure that every sensitive action is controlled by explicit permissions and checked on the backend.

---

## 2. Core Principle

The platform must follow this rule:

```text
Never trust the frontend for authorization.
```

Buttons can be hidden in the UI, but every protected action must also be verified on the server.

---

## 3. Role Categories

MyNSUT uses two levels of roles:

1. Platform-level roles.
2. Scoped roles.

---

## 4. Platform-Level Roles

## 4.1 SUPER_ADMIN

Global administrator of the platform.

Can manage users, classes, societies, roles, notices, Gazette uploads, and moderation.

## 4.2 STUDENT

Default role assigned to every verified NSUT student.

Can view allowed content, manage own profile, interact with events, and complete assigned class tasks.

---

## 5. Scoped Roles

Scoped roles apply only inside a class or society.

## 5.1 CLASS_CR

Class representative for a specific class.

Can manage announcements and tasks for that assigned class only.

## 5.2 SOCIETY_PRESIDENT

Top-level society manager for a specific society.

Can manage society profile, members, roles, and events for that society only.

## 5.3 SOCIETY_VICE_PRESIDENT

Assistant society manager for a specific society.

Can help manage society content and events, depending on configured permissions.

## 5.4 SOCIETY_MEMBER

Member of a society.

Can access private society resources and display society membership on profile, subject to privacy settings.

---

## 6. Permission Naming Convention

Permissions should be named in uppercase using this format:

```text
RESOURCE_ACTION
```

Examples:

```text
USER_VIEW
USER_UPDATE_SELF
CLASS_ANNOUNCEMENT_CREATE
SOCIETY_EVENT_CREATE
GAZETTE_UPLOAD
```

---

## 7. Permission Matrix

| Permission | SUPER_ADMIN | STUDENT | CLASS_CR | SOCIETY_PRESIDENT | SOCIETY_VICE_PRESIDENT | SOCIETY_MEMBER |
|---|---:|---:|---:|---:|---:|---:|
| AUTH_LOGIN | Yes | Yes | Yes | Yes | Yes | Yes |
| ONBOARDING_COMPLETE_SELF | Yes | Yes | Yes | Yes | Yes | Yes |
| PROFILE_VIEW_SELF | Yes | Yes | Yes | Yes | Yes | Yes |
| PROFILE_UPDATE_SELF | Yes | Yes | Yes | Yes | Yes | Yes |
| PROFILE_VIEW_PUBLIC | Yes | Yes | Yes | Yes | Yes | Yes |
| PRIVACY_UPDATE_SELF | Yes | Yes | Yes | Yes | Yes | Yes |
| ACADEMIC_VIEW_SELF | Yes | Yes | Yes | Yes | Yes | Yes |
| ACADEMIC_VIEW_PUBLIC_IF_ALLOWED | Yes | Yes | Yes | Yes | Yes | Yes |
| ACADEMIC_VIEW_ALL | Yes | No | No | No | No | No |
| USER_SEARCH | Yes | No | No | No | No | No |
| USER_SUSPEND | Yes | No | No | No | No | No |
| ROLE_ASSIGN_GLOBAL | Yes | No | No | No | No | No |
| ROLE_ASSIGN_CLASS_CR | Yes | No | No | No | No | No |
| ROLE_ASSIGN_SOCIETY | Yes | No | No | Limited | Limited | No |
| CLASS_VIEW_OWN | Yes | Yes | Yes | Yes | Yes | Yes |
| CLASS_VIEW_MEMBERS_OWN | Yes | Yes | Yes | Yes | Yes | Yes |
| CLASS_CREATE | Yes | No | No | No | No | No |
| CLASS_UPDATE | Yes | No | No | No | No | No |
| CLASS_ASSIGN_STUDENT | Yes | No | No | No | No | No |
| CLASS_ANNOUNCEMENT_VIEW | Yes | Yes | Yes | Yes | Yes | Yes |
| CLASS_ANNOUNCEMENT_CREATE | Yes | No | Scoped | No | No | No |
| CLASS_ANNOUNCEMENT_UPDATE | Yes | No | Scoped | No | No | No |
| CLASS_ANNOUNCEMENT_DELETE | Yes | No | Scoped | No | No | No |
| CLASS_TASK_COMPLETE_SELF | Yes | Yes | Yes | Yes | Yes | Yes |
| CLASS_TASK_VIEW_COMPLETION_SUMMARY | Yes | No | Scoped | No | No | No |
| NOTICE_VIEW | Yes | Yes | Yes | Yes | Yes | Yes |
| NOTICE_CREATE_OFFICIAL | Yes | No | No | No | No | No |
| NOTICE_CREATE_SOCIETY | Yes | No | No | Scoped | Scoped | No |
| NOTICE_UPDATE_OWN | Yes | No | No | Scoped | Scoped | No |
| NOTICE_DELETE | Yes | No | No | Limited | Limited | No |
| SOCIETY_VIEW_PUBLIC | Yes | Yes | Yes | Yes | Yes | Yes |
| SOCIETY_CREATE | Yes | No | No | No | No | No |
| SOCIETY_UPDATE_PROFILE | Yes | No | No | Scoped | Scoped | No |
| SOCIETY_DELETE_OR_ARCHIVE | Yes | No | No | No | No | No |
| SOCIETY_INVITE_MEMBER | Yes | No | No | Scoped | Scoped | No |
| SOCIETY_ACCEPT_INVITE_SELF | Yes | Yes | Yes | Yes | Yes | Yes |
| SOCIETY_REMOVE_MEMBER | Yes | No | No | Scoped | Limited | No |
| SOCIETY_VIEW_PRIVATE_SPACE | Yes | No | No | Scoped | Scoped | Scoped |
| SOCIETY_ASSIGN_POR | Yes | No | No | Scoped | Limited | No |
| EVENT_VIEW | Yes | Yes | Yes | Yes | Yes | Yes |
| EVENT_CREATE | Yes | No | No | Scoped | Scoped | No |
| EVENT_UPDATE_OWN_SOCIETY | Yes | No | No | Scoped | Scoped | No |
| EVENT_DELETE_OR_CANCEL | Yes | No | No | Scoped | Limited | No |
| EVENT_MARK_INTERESTED | Yes | Yes | Yes | Yes | Yes | Yes |
| EVENT_REGISTER_SELF | Yes | Yes | Yes | Yes | Yes | Yes |
| EVENT_CANCEL_REGISTRATION_SELF | Yes | Yes | Yes | Yes | Yes | Yes |
| EVENT_VIEW_REGISTRATIONS | Yes | No | No | Scoped | Scoped | No |
| EVENT_EXPORT_REGISTRATIONS | Yes | No | No | Scoped | Scoped | No |
| GAZETTE_UPLOAD | Yes | No | No | No | No | No |
| GAZETTE_PARSE_TRIGGER | Yes | No | No | No | No | No |
| GAZETTE_VIEW_ERRORS | Yes | No | No | No | No | No |
| GAZETTE_FIX_RECORDS | Yes | No | No | No | No | No |
| FILE_UPLOAD_PROFILE_IMAGE | Yes | Yes | Yes | Yes | Yes | Yes |
| FILE_UPLOAD_NOTICE_ATTACHMENT | Yes | No | No | Scoped | Scoped | No |
| FILE_UPLOAD_EVENT_POSTER | Yes | No | No | Scoped | Scoped | No |
| FILE_UPLOAD_GAZETTE | Yes | No | No | No | No | No |
| ADMIN_DASHBOARD_VIEW | Yes | No | No | No | No | No |
| AUDIT_LOG_VIEW | Yes | No | No | No | No | No |
| CONTENT_MODERATE | Yes | No | No | No | No | No |

---

## 8. Meaning of Scoped and Limited

## 8.1 Scoped

The user can perform the action only within the entity where they hold the role.

Example:

A `CLASS_CR` of class `CSE-2` can create announcements for `CSE-2` only, not for `ECE-1`.

## 8.2 Limited

The user can perform the action with restrictions.

Example:

A `SOCIETY_VICE_PRESIDENT` may update event details but may not delete the society or remove the President.

---

## 9. Recommended Permission Checks

## 9.1 Backend Pattern

Every protected API/server action should perform:

```text
1. Get authenticated user.
2. Check if user exists and is active.
3. Resolve role and scope.
4. Check permission.
5. Execute action only if allowed.
6. Write audit log if action is sensitive.
```

## 9.2 UI Pattern

UI should use permissions only to improve user experience.

Example:

```text
If user has EVENT_CREATE for society X:
  Show "Create Event" button.
Else:
  Hide button.
```

But the backend must still enforce `EVENT_CREATE`.

---

## 10. Suggested Role Tables

Use separate global and scoped role mappings.

Recommended tables:

```text
users
roles
permissions
role_permissions
user_global_roles
class_roles
society_roles
```

---

## 11. Sensitive Actions Requiring Audit Logs

The following actions should always create audit logs:

1. Assigning or removing global role.
2. Assigning or removing CR.
3. Creating or archiving a society.
4. Assigning President or Vice President.
5. Uploading Gazette PDF.
6. Triggering Gazette parser.
7. Fixing academic records manually.
8. Suspending or reactivating user.
9. Deleting events or notices.
10. Changing event capacity.

---

## 12. Initial Role Assignment Strategy

1. Every verified user gets `STUDENT`.
2. Super Admin is seeded manually from environment configuration.
3. CRs are assigned manually by Super Admin in V1.
4. Society Presidents are assigned manually by Super Admin in V1.
5. Society Presidents can invite members.
6. Presidents may assign internal PORs based on allowed permissions.

---

## 13. Future RBAC Improvements

1. Permission presets per society.
2. Temporary roles with expiry.
3. Event-specific volunteers.
4. Role approval workflows.
5. Faculty/admin roles, if required later.
6. API tokens for trusted integrations.
