# Cyber-Security-Internship-2026
3-Week Cybersecurity Internship Project: Vulnerability Assessment, Exploitation (SQLi, XSS), and Secure Coding Remediation in Node.js.
# 🛡️ Cybersecurity Internship Project (Node.js)

## 📝 Project Overview
This repository documents my 3-week Cybersecurity Internship project. The primary objective is to identify, assess, and remediate critical security vulnerabilities in a custom Node.js/Express web application. 

This project demonstrates the transition from an **Attacker Mindset** (identifying loopholes) to a **Defender Mindset** (implementing secure coding practices).

## 🚀 Week 1: Vulnerability Assessment & Penetration Testing
During the first week, I deployed an intentionally vulnerable Node.js application and performed manual security testing to understand how real-world exploits work.

### 🔍 Findings & Risk Matrix
Below is the Vulnerability Risk Assessment Matrix based on my manual testing. *(Risk Score = Likelihood × Impact)*

## 🚀 Week 1: Vulnerability Assessment & Penetration Testing

### 🔍 Findings & Risk Matrix
Below is the updated Risk Assessment Matrix after Week 2 remediation.

| Vulnerability | Tool Used | Likelihood | Impact | Risk Score | Risk Level | Status |
|---|---|---|---|---|---|---|
| SQL Injection (Auth Bypass) | Manual | 5 | 5 | 25 | 🔴 Critical | ✅ Patched |
| Stored XSS (Profile Bio) | Manual | 4 | 4 | 16 | 🔴 Critical | ✅ Patched |
| Plain-Text Password Storage | Manual (DB inspect) | 4 | 5 | 20 | 🔴 Critical | ✅ Patched |
| Absence of Anti-CSRF Tokens | OWASP ZAP | 3 | 4 | 12 | 🟠 High | ✅ Patched |
| CSP Header Not Set | OWASP ZAP | 4 | 2 | 8 | 🟡 Medium | ✅ Patched |
| CSP: No Fallback Directive | OWASP ZAP | 4 | 2 | 8 | 🟡 Medium | ✅ Patched |
| Missing Anti-clickjacking Header | OWASP ZAP | 3 | 3 | 9 | 🟡 Medium | ✅ Patched |
| X-Powered-By Header Leaks Tech Stack | OWASP ZAP | 5 | 1 | 5 | 🔵 Low | ✅ Patched |
| X-Content-Type-Options Missing | OWASP ZAP | 4 | 1 | 4 | 🔵 Low | ✅ Patched |
| Authentication Request Exposed | OWASP ZAP | 2 | 1 | 2 | ⚪ Info | ✅ Patched |

&gt; **Legend:** ✅ Patched | ⚠️ Partially Patched | ❌ Unpatched


### 🔑 Plain-Text Password Storage
Passwords are stored without hashing in the SQLite database, 
exposing all user credentials if the database is ever accessed.

![Plain-text passwords in DB](ScreenShots/PlainText_Password_DB.png.png)

### 🔬 Exploits Demonstrated
1. **Authentication Bypass (SQLi):** Successfully bypassed the login mechanism using payload `' OR '1'='1` due to lack of parameterized queries.
2. ![SQLi Vulnerability Give Access to the Admin Panel](ScreenShots/output%20SQL%20Injection.png)
3. **Arbitrary Code Execution (Stored XSS):** Injected malicious JavaScript `<script>alert(1)</script>` into the user profile biography, which executed upon page load due to missing output sanitization.
4. ![XSS Alert Box shown on browser](ScreenShots/Output%20XSS%20Attack-2.png)

### 🛠️ Tools & Technologies Used
* **Backend:** Node.js, Express.js
* **Database:** SQLite (In-Memory)
* **Testing Techniques:** Manual Penetration Testing, Risk Assessment Matrix
* ### 📄 Automated Testing (OWASP ZAP)
As part of the security assessment, an automated scan was performed using OWASP ZAP to identify misconfigurations and missing security headers.

![OWASP ZAP Scan Results](ScreenShots/zap-report.png)

* [View Full OWASP ZAP HTML Report](2026-04-19-ZAP-Report-.html)

## 📁 Project Structure

| File/Folder | Purpose |
|---|---|
| `app.js` | Main Express server with vulnerable routes |
| `views/` | EJS templates for login, signup, profile pages |
| `ScreenShots/` | Evidence screenshots from vulnerability testing |
| `ZAP_Report_Week1.html` | Full OWASP ZAP automated scan report |
| `Cybersecurity_Report_Week1_Final.pdf` | Formal findings document |

## 💻 Setup Instructions (For Educational Purposes Only)
If you want to run this vulnerable lab locally:

1. Clone this repository: 
   ```bash
   git clone <your-github-repo-link-here>
   ```
2. Install the required dependencies: 
   ```bash
   npm install express ejs body-parser sqlite3
   ```
3. Run the server: 
   ```bash
   node app.js
   ```
4. Access the vulnerable application at `http://localhost:3000`

> ⚠️ **Disclaimer:** This repository contains intentionally vulnerable code designed strictly for educational and testing purposes. Do not deploy this code in a production environment.

## ✅ Week 2 Fixes Completed

All planned security improvements have been successfully implemented:

- ✅ SQL Injection → Parameterized queries
- ✅ Stored XSS → Input sanitization with validator
- ✅ Plain-Text Passwords → bcrypt hashing
- ✅ Missing Security Headers → Helmet.js with custom CSP
- ✅ CSRF Protection → csurf tokens + sameSite strict cookies
- ✅ X-Powered-By Leak → Disabled

---

## 🔐 Week 2: Security Implementation (Defender Phase)
In this phase, the application was transformed from a vulnerable state to a secure, production-ready environment.

### **Implemented Security Features:**
- **Password Hashing (Bcrypt):** User passwords are now securely hashed before being stored in the database.
- **JWT Authentication:** Implemented JSON Web Tokens (JWT) for secure session management.
- - **Secure Cookies:** Cookies are now configured with `httpOnly` and `sameSite: 'strict'` 
- **Middleware Guard:** A custom `authenticateJWT` middleware protects sensitive routes like `/profile`.
- **SQL Injection Prevention:** All database queries now use parameterized statements.
- **Security Headers (Helmet):** Integrated the `helmet` package to set various security-related HTTP headers.

**Final Audit Result:** 0 High-Risk Vulnerabilities (Verified by OWASP ZAP). ✅

### 📄 Week 2 Re-Scan (Post-Remediation)
![Week 2 ZAP Scan](ScreenShots/ZAP_Week2_Summary.png)
[View Full Week 2 ZAP Report](ZAP_Report_Week2.html)