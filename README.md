# Cyber-Security-Internship-2026
3-Week Cybersecurity Internship Project: Vulnerability Assessment, Exploitation (SQLi, XSS), and Secure Coding Remediation in Node.js.

# 🛡️ Cybersecurity Internship Project (Node.js)

## 📝 Project Overview
This repository documents my 3-week Cybersecurity Internship project. The primary objective is to identify, assess, and remediate critical security vulnerabilities in a custom Node.js/Express web application.

This project demonstrates the transition from an **Attacker Mindset** (identifying loopholes) to a **Defender Mindset** (implementing secure coding practices).

## 🚀 Week 1: Vulnerability Assessment & Penetration Testing
During the first week, I deployed an intentionally vulnerable Node.js application and performed manual security testing to understand how real-world exploits work.

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
Passwords are stored without hashing in the SQLite database, exposing all user credentials if the database is ever accessed.

![Plain-text passwords in DB](ScreenShots/PlainText_Password_DB.png.png)

### 🔬 Exploits Demonstrated
1. **Authentication Bypass (SQLi):** Successfully bypassed the login mechanism using payload `' OR '1'='1` due to lack of parameterized queries.
2. ![SQLi Vulnerability Give Access to the Admin Panel](ScreenShots/output%20SQL%20Injection.png)
3. **Arbitrary Code Execution (Stored XSS):** Injected malicious JavaScript `&lt;script&gt;alert(1)&lt;/script&gt;` into the user profile biography, which executed upon page load due to missing output sanitization.
4. ![XSS Alert Box shown on browser](ScreenShots/Output%20XSS%20Attack-2.png)

### 🛠️ Tools & Technologies Used
* **Backend:** Node.js, Express.js
* **Database:** SQLite (In-Memory)
* **Testing Techniques:** Manual Penetration Testing, Risk Assessment Matrix

### 📄 Automated Testing (OWASP ZAP)
As part of the security assessment, an automated scan was performed using OWASP ZAP to identify misconfigurations and missing security headers.

![OWASP ZAP Scan Results](ScreenShots/zap-report.png)

* [View Full OWASP ZAP HTML Report](2026-04-19-ZAP-Report-.html)

## 📁 Project Structure

| File/Folder | Purpose |
|---|---|
| `app.js` | Main Express server with secured routes |
| `middleware/auth.js` | JWT authentication middleware |
| `views/index.ejs` | Home page with security badge |
| `views/login.ejs` | Login form with CSRF protection |
| `views/signup.ejs` | Signup form with validation hints |
| `views/profile.ejs` | Protected user dashboard |
| `ScreenShots/` | Evidence screenshots from vulnerability testing |
| `ZAP_Report_Week1.html` | Full OWASP ZAP scan report (Week 1 - vulnerable) |
| `ZAP_Report_Week2.html` | Full OWASP ZAP scan report (Week 2 - remediated) |
| `Cybersecurity_Report_Week1_Final.pdf` | Formal findings document |

## 💻 Setup Instructions

If you want to run this application locally:

1. Clone this repository:
   ```bash
   git clone https://github.com/WahabShahbaz551/Cyber-Security-Internship-2026.git

2. Install dependencies:
```bash
   npm install express ejs body-parser sqlite3 bcryptjs jsonwebtoken validator csurf helmet express-rate-limit
```
3. Run the server:
```bash
   node app.js
```
4. Visit: `http://localhost:3000`


## ✅ Week 2: Security Implementation (Defender Phase)

In this phase, the application was transformed from a vulnerable state to a secure, production-ready environment.

### 🔐 Implemented Security Features

| Fix | Technology | What It Does |
|---|---|---|
| **Password Hashing** | `bcryptjs` (salt rounds: 10) | Scrambles passwords before database storage |
| **JWT Authentication** | `jsonwebtoken` + HTTP-only cookies | Secure session management with tamper-proof tokens |
| **Input Validation** | `validator` library | Sanitizes user input to prevent XSS and injection |
| **CSRF Protection** | `csurf` + `sameSite: 'strict'` cookies | Prevents cross-site request forgery attacks |
| **Rate Limiting** | `express-rate-limit` | Blocks brute-force login attempts (5 per 15 min) |
| **Security Headers** | `helmet.js` with custom CSP | Sets 11+ headers including frame-ancestors, form-action |
| **X-Powered-By** | `app.disable('x-powered-by')` | Hides Express.js fingerprint from headers |
| **SQL Injection Prevention** | Parameterized queries (`?`) | All DB queries use placeholders |

### 📊 Before vs After

| Aspect | Week 1 (Vulnerable) | Week 2 (Secure) |
|---|---|---|
| Password storage | Plain text | bcrypt hashed |
| Input handling | Raw (dangerous) | Sanitized & validated |
| Authentication | None | JWT tokens |
| Session security | None | HTTP-only, SameSite strict |
| Security headers | Missing | 11+ via Helmet |
| CSRF protection | None | Tokens + strict cookies |
| Brute-force | Unlimited attempts | Rate limited (5/15min) |
| Tech stack leak | X-Powered-By: Express | Hidden |

### 📄 Week 2 Re-Scan (Post-Remediation)

Post-remediation OWASP ZAP scan confirms all critical vulnerabilities resolved.

![Week 2 ZAP Scan](ScreenShots/ZAP_Week2_Summary.png)

[View Full Week 2 ZAP Report](ZAP_Report_Week2.html)

**Final Audit Result:** 0 High-Risk Vulnerabilities (Verified by OWASP ZAP). ✅

---

*This project is for educational purposes only. Do not deploy in production.*