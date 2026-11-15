# MyNSUT — Privacy Policy (Draft for University Beta Launch)

**Last Updated**: November 15, 2026  
**Effective Date**: University-Wide Beta Release  
**Platform**: MyNSUT (Student Experience Platform)  
**Institution**: Netaji Subhas University of Technology (NSUT), Dwarka, Sector-3, New Delhi - 110078, India  

---

## 1. Introduction & Scope

Welcome to **MyNSUT**. This Privacy Policy explains how MyNSUT ("we", "our", or "the Platform") collects, processes, stores, and protects personal and academic information when students, faculty, society leaders, and university administrators access our services.

MyNSUT is designed specifically for the student and campus community of Netaji Subhas University of Technology (NSUT). We are committed to transparency, data minimization, and student sovereignty over personal information, adhering to institutional guidelines and the Digital Personal Data Protection Act (DPDPA).

---

## 2. Information We Collect

We only collect data necessary to provide academic services, class workspaces, official notice dissemination, society event registrations, and campus connectivity.

### 2.1 Information Collected Automatically via Google SSO
When you log in using your authorized `@nsut.ac.in` Google Workspace account:
- **Full Legal Name** (as registered with the university).
- **University Email Address** (`username@nsut.ac.in`).
- **Google Profile Photo URL** (optional avatar display).
- **Google Account Identifier (Subject ID)** (used solely for cryptographic authentication matching).

*Note: MyNSUT never receives or stores your Google account password or private emails.*

### 2.2 Student & Academic Profile Data
During the mandatory onboarding flow and subsequent platform use:
- **University Management System (UMS) Roll Number** (e.g., `2024UCS1001`).
- **Academic Program, Branch & Section** (derived deterministically from roll number and student selection).
- **Admission & Projected Graduation Year** (derived automatically).
- **Academic Class Assignment** (linking you to your official cohort workspace).
- **Academic Results & Performance Records** (CGPA, SGPA, credits earned, and semester marks — only if synchronized via official university gazettes).

### 2.3 User-Provided Profile & Social Data (Optional)
Information you may voluntarily add to your profile:
- **Student Bio / About Me** summary.
- **Professional & Developer Links** (GitHub URL, LinkedIn URL).
- **Positions of Responsibility (PORs)** (e.g., Society Core Member, Technical Lead, Class Representative).

### 2.4 Campus Activity & Engagement Data
- **Class Workspace**: Class task completion status and assignment timestamps.
- **Event Management**: Events marked as "Interested", confirmed registrations, and waitlist tickets.
- **Academic Resources**: Created resource submissions (notes, previous year papers, reference links).

### 2.5 Technical, Diagnostic & Security Telemetry
To protect the platform against brute force attacks and malicious behavior:
- **IP Address & Browser User-Agent** (recorded with session creation and administrative audit events).
- **Session Timestamps** (creation time, last active time, expiration timestamp).
- **Security Audit Logs** (failed authentication attempts, rate limit violations, role assignment changes).

---

## 3. Purpose & Legal Basis of Processing

| Category of Data | Purpose of Processing | Legal Basis |
| :--- | :--- | :--- |
| **Identity & SSO Data** | Authenticating legitimate NSUT students and staff; preventing unauthorized public access. | University Enrollment & Institutional Verification |
| **Roll Number & Class Data** | Routing students to their official class workspace; syncing timetables, CR announcements, and class tasks. | Educational Administration |
| **Academic Results & CGPA** | Providing private student academic tracking; calculating aggregate cohort insights (where permitted). | Student Consent & Legitimate Educational Interest |
| **Profile & Social Links** | Enabling peer networking, campus project collaboration, and talent discovery across societies. | Explicit Student Consent (Granular Privacy Controls) |
| **Technical & Audit Logs** | Safeguarding platform integrity; preventing DDoS, account takeovers, and academic impersonation. | Institutional Security & Legal Compliance |

---

## 4. Student Privacy Controls & Default Visibility

MyNSUT provides granular, student-controlled privacy settings. Students can change their privacy posture at any time via **Settings -> Privacy Preferences** (`/settings/privacy`).

### 4.1 Granular Privacy Dimensions
1. **Bio Visibility** (`bioVisibility`): Controls who can read your bio.
2. **Social Links Visibility** (`socialLinksVisibility`): Controls visibility of GitHub and LinkedIn links.
3. **Academic Summary Visibility** (`academicSummaryVisibility`): Controls visibility of Cumulative GPA and total credits.
4. **Semester Results Visibility** (`semesterResultsVisibility`): Controls visibility of semester-by-semester grades.

### 4.2 Visibility Tiers
- `PUBLIC`: Discoverable across the platform.
- `PLATFORM_ONLY` *(Default for Academic Data)*: Restricted exclusively to authenticated NSUT students logged in with `@nsut.ac.in`. Public internet crawlers and non-NSUT users cannot view this data.
- `PRIVATE`: Visible strictly to the student account owner and authorized system administrators.

> **Institutional Guarantee**: Your sensitive academic CGPA, grade sheets, and semester results are **NEVER** published to external search engines or indexed by third-party web crawlers.

---

## 5. Third-Party Service Providers & Data Storage

We do not sell, rent, or monetize student data under any circumstances. Data is stored securely across enterprise cloud infrastructure meeting SOC-2 and ISO 27001 security standards:

| Infrastructure Partner | Service Provided | Location / Compliance |
| :--- | :--- | :--- |
| **Neon Inc.** | Encrypted PostgreSQL Database (Compute & Serverless Storage) | AWS Region (TLS 1.3 in-transit, AES-256 at-rest) |
| **Render Inc.** | Express Application Server Runtime | US-East / EU Tier-4 Data Centers |
| **Vercel Inc.** | Next.js Frontend Global Edge Delivery & Static CDN | Global Edge Network |
| **Upstash Inc.** | Serverless Redis (Rate Limiting & Caching) | TLS Encrypted Cloud Memory Store |
| **Google Cloud Platform** | OpenID Connect OAuth Provider & Workspace SSO | Google Enterprise Infrastructure |
| **Functional Software (Sentry)** | Application Error Tracking & Performance Monitoring | PII-Redacted Crash Telemetry |

---

## 6. Data Retention, Archival & Deletion

### 6.1 Session Retention
- Active session tokens expire automatically after **5 days** of inactivity.
- Session tokens are stored in the database exclusively as irreversible **SHA-256 hashes**.
- Upon logging out, the session record is immediately invalidated (`revokedAt = now()`).

### 6.2 Student Lifecycle & Graduation
- Student records remain active throughout the student's enrollment at NSUT (typically 4 years for B.Tech, 2 years for M.Tech/MBA, 3–5 years for Ph.D.).
- Upon graduation or disenrollment, student accounts transition to an archived state. Students may request complete account deletion or conversion to verified alumni status.

### 6.3 Security Audit Log Retention
- Security logs (containing IP addresses and audit timestamps) are retained for **365 days** to comply with institutional security auditing requirements, after which they are permanently purged.

---

## 7. Student Rights & Account Management

Under institutional policy and applicable data privacy regulations, NSUT students have the following rights:

1. **Right to Access & Inspection**: You have the right to view all personal and academic data stored in your profile at any time through `/profile/me`.
2. **Right to Rectification**: If your roll number, section, or academic details were onboarded incorrectly, you can request an administrative correction through your Class Representative or by submitting an official correction ticket.
3. **Right to Data Erasure ("Right to be Forgotten")**: You may request the deletion of your optional profile data (bio, social links, custom avatars). For full account deletion prior to graduation, a verified request must be submitted via university email.
4. **Right to Revoke Permissions**: You can disconnect MyNSUT from your Google Workspace account at any time through your Google Account Security settings.

---

## 8. Data Security & Encryption Standards

- **In-Transit**: All communications between your browser, Vercel, Render, and database services are encrypted using **TLS 1.3 / HTTPS**.
- **At-Rest**: All persistent database storage volumes are encrypted using **AES-256**.
- **Cookies**: Authentication session cookies are marked `HttpOnly`, `Secure`, and `SameSite=Lax`, preventing access by third-party scripts and cross-site scripting (XSS) vectors.
- **Redaction**: All server-side logging systems automatically scrub passwords, authorization headers, session cookies, and sensitive PII before writing to disk.

---

## 9. Updates to this Policy

As MyNSUT progresses from beta launch to official campus rollout, we may update this Privacy Policy to reflect new academic features or regulatory guidelines. We will notify students of material changes via a platform notification and by updating the "Last Updated" date at the top of this document.

---

## 10. Contact & Data Protection Inquiries

For questions regarding your data, privacy preferences, or to exercise your privacy rights:

- **Email**: `privacy@mynsut.com` / `studentaffairs@nsut.ac.in`
- **Office**: Office of the Dean of Student Welfare (DSW), Netaji Subhas University of Technology, Dwarka, New Delhi - 110078
