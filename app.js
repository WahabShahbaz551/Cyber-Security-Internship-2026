const express = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
app.use(helmet());
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Yeh hamari secret chabi (key) hai jis se VIP pass banega. Isey koi hacker nahi jaan sakta!
const JWT_SECRET = "super_secret_hacker_key_123";

const db = new sqlite3.Database('./database.sqlite');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
  db.run("INSERT INTO users VALUES (1, 'admin', 'password123', 'I am the boss')");
});
// ==========================================
// 🛡️ VIP GUARD (Middleware)
// ==========================================
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token; 

    if (!token) {
        return res.send("<h3>Access Denied! Aapke paas VIP Pass (Token) nahi hai.</h3><a href='/login'>Login Karein</a>");
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (err) {
        return res.send("<h3>Invalid or Expired VIP Pass!</h3><a href='/login'>Login Karein</a>");
    }
};

// --- VULNERABLE ROUTES ---
// GET Route - Signup page show karne ke liye
// ==========================================
// 📝 SIGNUP ROUTES
// ==========================================

// GET Route - SIGNUP
app.get('/signup', (req, res) => {
    res.render('signup'); 
});

// POST Route - SIGNUP
// POST Route - SIGNUP
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // 🔍 STEP 1: Pehle check karo ke kya yeh username pehle se mojud hai?
    const checkQuery = `SELECT * FROM users WHERE username = ?`;
    
    db.get(checkQuery, [username], (err, existingUser) => {
        if (err) return res.send("Error checking database.");

        if (existingUser) {
            // 🛑 Agar user pehle se mojud hai, toh yahin se rok do!
            return res.send("<h3>Error: Yeh username pehle se mojud hai! ❌</h3><a href='/signup'>Try a different username</a>");
        }

        // ✅ STEP 2: Agar user naya hai, toh Password Hash karo aur Save karo
        const hashedPassword = bcrypt.hashSync(password, 10);
        const insertQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;

        db.run(insertQuery, [username, hashedPassword], function(err) {
            if (err) {
                return res.send("Error creating user.");
            }
            res.send("<h3>Signup Successful! ✅</h3><a href='/login'>Login Now</a>");
        });
    });
});

// ==========================================
// 🔓 LOGIN ROUTES
// ==========================================

// GET Route - LOGIN
app.get('/login', (req, res) => {
    res.send(`
        <h2>Login Page 🔒</h2>
        <form action="/login" method="POST">
            <input type="text" name="username" placeholder="Username" required><br><br>
            <input type="password" name="password" placeholder="Password" required><br><br>
            <button type="submit">Login</button>
        </form>
    `);
});

// POST Route - LOGIN
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = ?`;

    db.get(query, [username], (err, user) => {
        if (err) return res.send("Error processing login.");
        if (!user) return res.send("<h3>Invalid username or password!</h3><a href='/login'>Try Again</a>");

        // 🔐 Hashed Password Check
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (isPasswordValid) {
            console.log(`[LOGIN SUCCESS] User: ${username}`);
            
            // 🎟️ VIP Pass (JWT Token)
            const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

            // Cookie Setup (Aapka Low Risk Fix)
            res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });

            res.send(`
                <h1>Welcome, ${user.username}!</h1>
                <p>Aapka Login 100% Secure Hai aur VIP Pass (JWT) mil gaya hai! 🎟️</p>
                <a href='/profile'>Go to My Profile</a>
            `);
        } else {
            console.log(`[LOGIN FAILED] User: ${username}`);
            res.send("<h3>Invalid username or password!</h3><a href='/login'>Try Again</a>");
        }
    });
});


app.get('/', (req, res) => {
  res.render('index');
});


// GET Route - SECURE PROFILE PAGE (Notice karein humne 'authenticateJWT' guard darmiyan mein laga diya hai)
app.get('/profile', authenticateJWT, (req, res) => {
    res.send(`
        <h1>VIP Room mein Khushamdeed! 🎩</h1>
        <p>Hello <b>${req.user.username}</b>, yeh aapka private dashboard hai. Koi bina login kiye yahan nahi aa sakta.</p>
        <a href='/'>Go to Home</a>
    `);
});

app.listen(3000, () => console.log('Vulnerable server running on http://localhost:3000'));