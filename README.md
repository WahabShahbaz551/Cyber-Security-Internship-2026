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

| Vulnerability | Likelihood (1-5) | Impact (1-5) | Risk Score | Risk Level | Status |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **SQL Injection (Auth Bypass)** | 5 | 5 | **25** | 🔴 Critical | Unpatched |
| **Stored XSS (Profile Bio)** | 4 | 4 | **16** | 🔴 Critical | Unpatched |
| **Missing Security Headers** | 4 | 2 | **8** | 🟡 Medium | Unpatched |

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

---
*Stay tuned for Week 2, where I will be implementing Parameterized Queries, Input Sanitization (Validator), and Password Hashing (Bcrypt) to secure this application!*
