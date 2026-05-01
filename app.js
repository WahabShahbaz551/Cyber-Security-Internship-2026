const express = require('express');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const JWT_SECRET = "super_secret_hacker_key_123";
const validator = require('validator');
username = validator.escape(validator.trim(username));

// --- MIDDLEWARE ---
app.use(helmet()); // Security Headers
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// --- DATABASE SETUP ---
const db = new sqlite3.Database('./database.sqlite');
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)");
});

// --- 🛡️ VIP GUARD (Middleware) ---
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token; 
    if (!token) {
        return res.send("<h3>Access Denied! Login Karein.</h3><a href='/login'>Login</a>");
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (err) {
        return res.send("<h3>Invalid or Expired Session!</h3><a href='/login'>Login</a>");
    }
};

// --- ROUTES ---

// 1. Home Page
app.get('/', (req, res) => {
    res.render('index');
});

// 2. Signup Page (GET)
app.get('/signup', (req, res) => {
    res.render('signup'); 
});

// 3. Signup Action (POST) - SECURE
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Pehle check karein ke user hai ya nahi
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
        if (row) return res.send("<h3>Error: Username might exist! ❌</h3><a href='/signup'>Try again</a>");

        const hashedPassword = bcrypt.hashSync(password, 10);
        db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], (err) => {
            if (err) return res.send("Error creating user.");
            res.send("<h3>Signup Successful! ✅</h3><a href='/login'>Login Now</a>");
        });
    });
});

// 4. Login Page (GET)
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

// 5. Login Action (POST) - SECURE
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) return res.send("<h3>Invalid Credentials!</h3><a href='/login'>Try Again</a>");

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (isPasswordValid) {
            const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
            res.redirect('/profile');
        } else {
            res.send("<h3>Invalid Credentials!</h3><a href='/login'>Try Again</a>");
        }
    });
});

// 6. Secure Profile (Protected)
app.get('/profile', authenticateJWT, (req, res) => {
    res.send(`
        <h1>VIP Room mein Khushamdeed! 🎩</h1>
        <p>Hello <b>${req.user.username}</b>, yeh aapka private dashboard hai.</p>
        <a href='/'>Go to Home</a>
    `);
});

// --- SERVER START ---
app.listen(3000, () => console.log('✅ SECURE server running on http://localhost:3000'));