# Phase 6 API - Official Notices

## Endpoints

### GET `/notices`
Retrieves a paginated list of notices.
**Query Params:** `category`, `status`, `search`, `page`, `limit`
**Access:** Authenticated Users

### GET `/notices/:noticeId`
Retrieves metadata for a specific notice.
**Access:** Authenticated Users

### POST `/notices`
Creates a new notice directory entry.
**Payload:** `CreateNoticeRequest`
**Access:** `NOTICE_CREATE_OFFICIAL` permission

### PATCH `/notices/:noticeId`
Updates an existing notice.
**Payload:** `UpdateNoticeRequest`
**Access:** `NOTICE_CREATE_OFFICIAL` permission

### DELETE `/notices/:noticeId`
Deletes a notice directory entry.
**Access:** `NOTICE_DELETE` permission
