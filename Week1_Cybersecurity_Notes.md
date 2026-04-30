# 🛡️ Cybersecurity Internship — Week 1 Notes
### Complete Study Guide: Vulnerability Assessment & Penetration Testing

---

## 📚 TABLE OF CONTENTS

1. [What is Cybersecurity?](#1-what-is-cybersecurity)
2. [Attacker Mindset vs Defender Mindset](#2-attacker-mindset-vs-defender-mindset)
3. [What is a Web Application?](#3-what-is-a-web-application)
4. [What is Vulnerability Assessment?](#4-what-is-vulnerability-assessment)
5. [What is Penetration Testing?](#5-what-is-penetration-testing)
6. [OWASP & OWASP Top 10](#6-owasp--owasp-top-10)
7. [SQL Injection (SQLi)](#7-sql-injection-sqli)
8. [Cross-Site Scripting (XSS)](#8-cross-site-scripting-xss)
9. [Plain-Text Password Storage](#9-plain-text-password-storage)
10. [Missing Security Headers](#10-missing-security-headers)
11. [CSRF — Cross-Site Request Forgery](#11-csrf--cross-site-request-forgery)
12. [OWASP ZAP Tool](#12-owasp-zap-tool)
13. [Risk Assessment Matrix](#13-risk-assessment-matrix)
14. [Tools Used in Week 1](#14-tools-used-in-week-1)
15. [All Vulnerabilities Found — Summary Table](#15-all-vulnerabilities-found--summary-table)
16. [Key Terms & Definitions](#16-key-terms--definitions)
17. [Quick Revision — MCQ Style](#17-quick-revision--mcq-style)

---

## 1. What is Cybersecurity?

Cybersecurity is the practice of **protecting computers, servers, networks, and data** from unauthorized access, attacks, damage, or theft.

### Why is it important?
- Every website, app, and system stores sensitive data (passwords, bank info, personal details)
- Hackers try to steal or damage this data
- Cybersecurity professionals find vulnerabilities **before** hackers do

### 3 Core Principles (CIA Triad)

| Principle | Meaning | Example |
|---|---|---|
| **Confidentiality** | Only authorized people can access data | Password protecting a file |
| **Integrity** | Data is accurate and not tampered with | Verifying a file hasn't been changed |
| **Availability** | Systems are always accessible when needed | Website doesn't go down |

---

## 2. Attacker Mindset vs Defender Mindset

In Week 1, we used the **Attacker Mindset** — thinking like a hacker to find weaknesses.
In Week 2, we switch to the **Defender Mindset** — fixing those weaknesses.

| Attacker Mindset 🔴 | Defender Mindset 🟢 |
|---|---|
| "How can I break this?" | "How can I protect this?" |
| Find loopholes | Patch loopholes |
| Exploit weak code | Write secure code |
| Bypass authentication | Strengthen authentication |
| Inject malicious input | Validate and sanitize input |

> **Key Insight:** The best defenders think like attackers. You cannot protect what you don't understand.

---

## 3. What is a Web Application?

A web application is a software program that runs in a browser. Examples: Gmail, Facebook, Online banking.

### Components of a Web App (Our App):

```
User (Browser)
     ↓
Frontend (HTML/EJS templates — views/ folder)
     ↓
Backend (Node.js + Express.js — app.js)
     ↓
Database (SQLite — stores users, passwords)
```

### Our App's Pages:
- `/` — Home page
- `/signup` — Register new user
- `/login` — Login page
- `/profile` — User profile page (where XSS was tested)

### Tech Stack Used:
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime — runs the server |
| **Express.js** | Web framework — handles routes/requests |
| **EJS** | Template engine — renders HTML pages |
| **SQLite** | Lightweight database — stores user data |
| **body-parser** | Reads form data sent from browser |

---

## 4. What is Vulnerability Assessment?

A **Vulnerability Assessment** is a systematic process of identifying, quantifying, and prioritizing security weaknesses in a system.

### Steps We Followed:
```
Step 1: Set up the vulnerable app (npm install → node app.js)
Step 2: Explore the app (signup, login, profile pages)
Step 3: Test for vulnerabilities (manual + automated tools)
Step 4: Document all findings
Step 5: Create Risk Matrix
```

### Types of Vulnerability Assessments:
| Type | Description |
|---|---|
| **Manual Testing** | Tester manually enters payloads and tests inputs |
| **Automated Scanning** | Tools like OWASP ZAP scan automatically |
| **Black Box** | Tester has no knowledge of the system |
| **White Box** | Tester has full access to source code |
| **Grey Box** | Tester has partial knowledge |

> **Our approach in Week 1:** Grey Box — we built the app ourselves but tested it as an outsider.

---

## 5. What is Penetration Testing?

**Penetration Testing (Pen Testing)** is simulating a real cyberattack to test the security of a system. Unlike vulnerability assessment (which only finds issues), pen testing also **exploits** them to prove they are real.

### Pen Testing Phases:
```
1. RECONNAISSANCE  → Gather information about the target
2. SCANNING        → Find open ports, services, entry points
3. EXPLOITATION    → Actually attack the vulnerabilities
4. POST-EXPLOIT    → See what damage could be done
5. REPORTING       → Document everything
```

### What we did in Week 1:
- **Exploitation:** We actually bypassed login using SQLi
- **Exploitation:** We executed JavaScript using XSS
- **Evidence:** We took screenshots as proof

---

## 6. OWASP & OWASP Top 10

### What is OWASP?
**OWASP** = Open Web Application Security Project
- A non-profit organization that publishes free security resources
- Most famous for the **OWASP Top 10** — a list of the most critical web vulnerabilities

### OWASP Top 10 (2021):

| Rank | Vulnerability | Found in Our App? |
|---|---|---|
| A01 | Broken Access Control | Partially (admin bypass via SQLi) |
| A02 | Cryptographic Failures | ✅ YES (plain-text passwords) |
| A03 | Injection | ✅ YES (SQL Injection) |
| A04 | Insecure Design | ✅ YES (no input validation) |
| A05 | Security Misconfiguration | ✅ YES (missing headers) |
| A06 | Vulnerable & Outdated Components | Not tested |
| A07 | Authentication Failures | ✅ YES (auth bypass) |
| A08 | Software & Data Integrity Failures | Not tested |
| A09 | Security Logging & Monitoring Failures | Not tested yet (Week 3) |
| A10 | SSRF | Not applicable |

> **Our app had vulnerabilities in 5 out of 10 OWASP categories!**

---

## 7. SQL Injection (SQLi)

### What is SQL?
SQL (Structured Query Language) is used to communicate with databases.
Example query to check login:
```sql
SELECT * FROM users WHERE username = 'admin' AND password = 'mypassword';
```
If this returns a user → login succeeds.

### What is SQL Injection?
**SQL Injection** is when an attacker inserts malicious SQL code into an input field, tricking the database into doing something unintended.

### How We Exploited It:

**Normal login attempt:**
```
Username: admin
Password: wrongpassword
```
Database runs:
```sql
SELECT * FROM users WHERE username='admin' AND password='wrongpassword';
-- Returns nothing → Login FAILS
```

**SQL Injection attack:**
```
Username: admin' OR '1'='1
Password: admin' OR '1'='1
```
Database runs:
```sql
SELECT * FROM users WHERE username='admin' OR '1'='1' AND password='admin' OR '1'='1';
-- '1'='1' is ALWAYS TRUE → Returns all users → Login SUCCEEDS!
```

### Why Does This Work?
Because our app directly puts user input into the SQL query **without any filtering**. The attacker "breaks out" of the string with `'` and adds their own logic.

### Real-World Impact:
- Bypass login without knowing password
- Dump entire database (all usernames, passwords, emails)
- Delete all data
- In some cases, take over the server

### Risk Level: 🔴 CRITICAL
- **Likelihood:** 5/5 (very easy to exploit)
- **Impact:** 5/5 (complete authentication bypass)
- **Risk Score:** 25/25

### Evidence from Our App:
- Payload used: `' OR '1'='1`
- Result: Successfully logged in as admin without knowing the password
- Screenshot: `ScreenShots/output SQL Injection.png`

---

## 8. Cross-Site Scripting (XSS)

### What is XSS?
**Cross-Site Scripting (XSS)** is when an attacker injects malicious JavaScript into a web page that other users then see and execute in their browsers.

### Types of XSS:

| Type | How It Works | Our App |
|---|---|---|
| **Stored XSS** | Malicious script is saved in database and runs every time page loads | ✅ This is what we found |
| **Reflected XSS** | Script is in the URL and runs immediately | Not found |
| **DOM-based XSS** | Script manipulates the page structure directly | Not tested |

### How We Exploited It (Stored XSS):

**Step 1:** Go to Profile page → Edit Biography field
**Step 2:** Enter this payload:
```html
<script>alert('XSS');</script>
```
**Step 3:** Save the profile

**Step 4:** Every time anyone visits this profile page, the browser sees:
```html
<p>Biography: <script>alert('XSS');</script></p>
```
And executes the JavaScript → **Alert box appears!**

### Why Does This Work?
Because our app takes whatever the user types and puts it directly into the HTML without **sanitizing** it. The browser sees `<script>` tags and runs them.

### Real-World Impact:
- Steal cookies (session hijacking — log in as the victim)
- Redirect users to fake websites (phishing)
- Keylogging (record what victim types)
- Deface the website

### Risk Level: 🔴 CRITICAL
- **Likelihood:** 4/5
- **Impact:** 4/5
- **Risk Score:** 16/25

### Evidence from Our App:
- Payload: `<script>alert(1)</script>` in Profile Bio field
- Result: JavaScript alert box appeared on page load
- Screenshot: `ScreenShots/Output XSS Attack-2.png`

---

## 9. Plain-Text Password Storage

### What is the Problem?
When users register, their password should **never** be stored as plain text. Our vulnerable app stored it directly:

```javascript
// ❌ WRONG — What our vulnerable app did:
db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password]);
// Password stored as: "mypassword123" — anyone reading DB can see it!
```

### Why is This Critical?
If a hacker gets access to the database (via SQLi or other means), they instantly have **every user's password** — no cracking needed.

### What Should Happen Instead?
Passwords should be **hashed** using a one-way function:
```
"mypassword123" → bcrypt → "$2b$10$X8k2mN..." (unreadable hash)
```
- Hash cannot be reversed
- Even database admins cannot see real passwords
- Week 2 fix: use `bcrypt` library

### Risk Level: 🔴 CRITICAL
- **Likelihood:** 4/5 (database breach is common)
- **Impact:** 5/5 (all user passwords exposed)
- **Risk Score:** 20/25

### Evidence from Our App:
- Opened SQLite database
- Ran: `SELECT * FROM users;`
- Saw passwords stored as plain readable text
- Screenshot: `ScreenShots/PlainText_Password_DB.png`

---

## 10. Missing Security Headers

These were found by **OWASP ZAP** (automated scanner). Security headers are instructions sent from the server to the browser telling it how to behave securely.

### Headers Missing in Our App:

#### a) Content Security Policy (CSP) — 🟡 MEDIUM
**What it does:** Tells the browser which sources of scripts/styles are allowed.
**Without it:** Browser will run any JavaScript, including injected XSS scripts.
```
Header: Content-Security-Policy: default-src 'self'
```

#### b) X-Frame-Options (Anti-Clickjacking) — 🟡 MEDIUM
**What it does:** Prevents the website from being loaded inside an iframe on another site.
**Without it:** Attackers can create invisible overlays on top of your site to trick users into clicking things (Clickjacking attack).
```
Header: X-Frame-Options: DENY
```

#### c) X-Content-Type-Options — 🔵 LOW
**What it does:** Prevents browser from "guessing" file types (MIME sniffing).
**Without it:** Browser might execute a text file as JavaScript.
```
Header: X-Content-Type-Options: nosniff
```

#### d) X-Powered-By Header Leaking — 🔵 LOW
**What it does:** Our app was telling everyone it runs on Express.js.
**Without fix:** Attackers know exactly what framework to target.
```
Problem: Server sends → X-Powered-By: Express
Fix: app.disable('x-powered-by')
```

#### e) Anti-CSRF Token Missing — 🟠 HIGH
**What it does:** Protects forms from being submitted by malicious third-party sites.
**Without it:** CSRF attacks are possible (explained in next section).

---

## 11. CSRF — Cross-Site Request Forgery

### What is CSRF?
**CSRF** tricks a logged-in user into unknowingly submitting a form or performing an action on a website they're already authenticated on.

### Example Attack Scenario:
```
1. User logs into their bank → session cookie is stored
2. User visits evil.com (while still logged in to bank)
3. evil.com has hidden form that auto-submits to bank:
   <form action="bank.com/transfer" method="POST">
     <input name="amount" value="10000">
     <input name="to" value="hacker_account">
   </form>
4. Bank sees valid session cookie → processes transfer!
5. User unknowingly sent money to hacker
```

### Fix: CSRF Tokens
Each form gets a unique random token. Server checks token before processing.
Without the token → request rejected.

### Found in Our App: 🟠 HIGH
- **Risk Score:** 12/25
- No CSRF protection on login or profile forms

---

## 12. OWASP ZAP Tool

### What is OWASP ZAP?
**ZAP (Zed Attack Proxy)** is a free, open-source security scanner made by OWASP. It acts as a **proxy** between your browser and the web app, intercepting and analyzing all traffic.

### What It Does:
- Automatically scans for vulnerabilities
- Finds missing security headers
- Tests for common attack patterns
- Generates professional reports

### How We Used It:

```
Step 1: Download OWASP ZAP from zaproxy.org
Step 2: Set target URL: http://localhost:3000
Step 3: Run "Automated Scan"
Step 4: ZAP crawls all pages and tests each one
Step 5: Export report as HTML/PDF
```

### What ZAP Found in Our App:

| Alert | Risk | Description |
|---|---|---|
| Absence of Anti-CSRF Tokens | Medium | Forms have no CSRF protection |
| Content Security Policy Not Set | Medium | No CSP header present |
| CSP: No Fallback (default-src) | Medium | CSP incomplete |
| Missing Anti-clickjacking Header | Medium | X-Frame-Options absent |
| X-Powered-By Header Leaks Info | Low | Reveals Express.js framework |
| X-Content-Type-Options Missing | Low | No MIME sniff protection |
| Authentication Request Identified | Informational | ZAP noted the login endpoint |

### ZAP Report:
Full report uploaded to repo: `2026-04-19-ZAP-Report-.html`
Screenshot of results: `ScreenShots/zap-report.png`

---

## 13. Risk Assessment Matrix

### What is a Risk Matrix?
A Risk Matrix helps prioritize which vulnerabilities to fix first based on two factors:

```
Risk Score = Likelihood × Impact

Likelihood: How easy is it to exploit? (1=Very Hard, 5=Very Easy)
Impact:     How much damage can it cause? (1=Minor, 5=Catastrophic)
```

### Risk Levels:

| Score Range | Risk Level | Action Required |
|---|---|---|
| 20–25 | 🔴 Critical | Fix immediately |
| 12–19 | 🟠 High | Fix urgently |
| 6–11 | 🟡 Medium | Fix soon |
| 1–5 | 🔵 Low | Fix when possible |
| 0 | ⚪ Info | Just note it |

### Our Complete Risk Matrix:

| Vulnerability | Tool | Likelihood | Impact | Score | Level | Status |
|---|---|---|---|---|---|---|
| SQL Injection (Auth Bypass) | Manual | 5 | 5 | 25 | 🔴 Critical | Unpatched |
| Plain-Text Password Storage | Manual | 4 | 5 | 20 | 🔴 Critical | Unpatched |
| Stored XSS (Profile Bio) | Manual | 4 | 4 | 16 | 🔴 Critical | Unpatched |
| Absence of Anti-CSRF Tokens | OWASP ZAP | 3 | 4 | 12 | 🟠 High | Unpatched |
| Missing Anti-clickjacking Header | OWASP ZAP | 3 | 3 | 9 | 🟡 Medium | Unpatched |
| CSP Header Not Set | OWASP ZAP | 4 | 2 | 8 | 🟡 Medium | Unpatched |
| CSP: No Fallback Directive | OWASP ZAP | 4 | 2 | 8 | 🟡 Medium | Unpatched |
| X-Powered-By Leaks Tech Stack | OWASP ZAP | 5 | 1 | 5 | 🔵 Low | Unpatched |
| X-Content-Type-Options Missing | OWASP ZAP | 4 | 1 | 4 | 🔵 Low | Unpatched |
| Authentication Request Exposed | OWASP ZAP | 2 | 1 | 2 | ⚪ Info | Noted |

---

## 14. Tools Used in Week 1

| Tool | Type | Purpose | How Used |
|---|---|---|---|
| **Node.js + Express** | Framework | Run the vulnerable app | `node app.js` |
| **Browser (Chrome/Firefox)** | Manual Tool | Test XSS manually | Entered `<script>alert(1)</script>` |
| **Browser Dev Tools** | Manual Tool | Inspect page source, network | F12 → Elements/Network |
| **OWASP ZAP** | Automated Scanner | Find header/config vulnerabilities | Automated Scan on localhost:3000 |
| **SQLite DB Inspector** | Manual Tool | See plain-text passwords | Opened DB, ran SELECT query |
| **GitHub** | Version Control | Upload and document work | Committed code + README |

---

## 15. All Vulnerabilities Found — Summary Table

| # | Vulnerability | CWE Code | How Found | Risk |
|---|---|---|---|---|
| 1 | SQL Injection | CWE-89 | Manual | 🔴 Critical |
| 2 | Plain-Text Passwords | CWE-256 | Manual | 🔴 Critical |
| 3 | Stored XSS | CWE-79 | Manual | 🔴 Critical |
| 4 | No CSRF Tokens | CWE-352 | OWASP ZAP | 🟠 High |
| 5 | No Anti-clickjacking | CWE-1021 | OWASP ZAP | 🟡 Medium |
| 6 | CSP Not Set | CWE-693 | OWASP ZAP | 🟡 Medium |
| 7 | CSP No Fallback | CWE-693 | OWASP ZAP | 🟡 Medium |
| 8 | X-Powered-By Leak | CWE-497 | OWASP ZAP | 🔵 Low |
| 9 | X-Content-Type Missing | CWE-693 | OWASP ZAP | 🔵 Low |
| 10 | Auth Request Exposed | — | OWASP ZAP | ⚪ Info |

> **CWE** = Common Weakness Enumeration — a standard numbering system for vulnerability types

---

## 16. Key Terms & Definitions

| Term | Definition |
|---|---|
| **Vulnerability** | A weakness in a system that can be exploited |
| **Exploit** | Code or technique used to take advantage of a vulnerability |
| **Payload** | The malicious input sent during an attack |
| **Sanitization** | Cleaning user input to remove dangerous characters |
| **Validation** | Checking that input meets expected format/type |
| **Hash** | One-way conversion of data (passwords) into unreadable string |
| **Salt** | Random data added to password before hashing (prevents rainbow table attacks) |
| **Session** | A temporary connection between browser and server after login |
| **Cookie** | Small data stored in browser (often holds session info) |
| **Header** | Metadata sent between browser and server with each request |
| **Proxy** | Middleman between browser and server (OWASP ZAP acts as proxy) |
| **Attack Surface** | All the points where an attacker can try to enter |
| **False Positive** | Tool reports a vulnerability that doesn't actually exist |
| **Zero Day** | A vulnerability that is unknown and has no patch yet |
| **Patch** | A fix for a security vulnerability |

---

## 17. Quick Revision — MCQ Style

**Q1. What does SQLi stand for?**
→ SQL Injection

**Q2. What payload was used to bypass login?**
→ `' OR '1'='1`

**Q3. What type of XSS was found in our app?**
→ Stored XSS (in Profile Biography field)

**Q4. What is the formula for Risk Score?**
→ Likelihood × Impact

**Q5. Which tool automatically found 7 vulnerabilities?**
→ OWASP ZAP

**Q6. What library will be used in Week 2 to hash passwords?**
→ bcrypt

**Q7. What does CSP stand for?**
→ Content Security Policy

**Q8. What does CSRF stand for?**
→ Cross-Site Request Forgery

**Q9. What does the X-Frame-Options header prevent?**
→ Clickjacking attacks

**Q10. What is OWASP?**
→ Open Web Application Security Project

**Q11. What risk score is considered Critical?**
→ 20–25 (Likelihood × Impact)

**Q12. Why is plain-text password storage dangerous?**
→ If DB is breached, all passwords are instantly exposed with no cracking needed

**Q13. What does the X-Powered-By header leak?**
→ That the server is running Express.js (helps attacker choose their attack)

**Q14. What is the difference between Vulnerability Assessment and Penetration Testing?**
→ VA only finds vulnerabilities; Pen Testing also exploits them to prove they are real

**Q15. What is the CIA Triad?**
→ Confidentiality, Integrity, Availability

---

## 📌 Week 1 — What We Submitted

| Deliverable | Status |
|---|---|
| Vulnerable Node.js app set up | ✅ Done |
| Manual testing (SQLi + XSS) | ✅ Done |
| OWASP ZAP automated scan | ✅ Done |
| Plain-text password documented | ✅ Done |
| Risk Matrix (10 vulnerabilities) | ✅ Done |
| Areas of Improvement section | ✅ Done |
| Project Structure section | ✅ Done |
| Screenshots as evidence | ✅ Done |
| ZAP HTML report uploaded | ✅ Done |
| GitHub repository | ✅ Done |

---

## 🔜 Coming in Week 2

| Fix | Library/Method |
|---|---|
| SQL Injection | Parameterized queries (`?` placeholders) |
| XSS | Input sanitization (`validator` library) |
| Plain-Text Passwords | Password hashing (`bcrypt`, salt rounds: 10) |
| Missing Security Headers | `helmet.js` middleware |
| CSRF Protection | `csurf` middleware |
| X-Powered-By Leak | `app.disable('x-powered-by')` |
| Token-Based Auth | `jsonwebtoken` (JWT) |

---

*Notes prepared for: Cybersecurity Internship 2026 — DevelopersHub*
*Week 1: Vulnerability Assessment & Penetration Testing*
*Score Achieved: 10/10 ✅*
