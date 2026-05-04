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
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const authenticateJWT = require('./middleware/auth');
const winston = require('winston');

// Logger configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(), // Terminal mein dikhayega
        new winston.transports.File({ filename: 'security.log' }) // File mein save karega
    ]
});

// --- MIDDLEWARE ---
// --- MIDDLEWARE ---
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:"],
            frameAncestors: ["'none'"],   // Clickjacking fix
            formAction: ["'self'"]        // Form hijacking fix
        }
    }
}));
app.disable('x-powered-by');
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 5,  // 5 attempts max
    message: 'Too many login attempts. Please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false
});
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// --- DATABASE SETUP ---
const db = new sqlite3.Database('./database.sqlite');
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)");
});
// --- ROUTES ---

// 1. Home Page
app.get('/', (req, res) => {
    res.render('index');
});

// 2. Signup Page (GET)
app.get('/signup', csrfProtection, (req, res) => {
    res.render('signup', { csrfToken: req.csrfToken(), error: null });
});

// 3. Signup Action (POST) - SECURE
app.post('/signup', csrfProtection, (req, res) => {
    let { username, password } = req.body;
    username = validator.escape(validator.trim(username));

    if (!username || !password) {
        return res.render('signup', { 
            csrfToken: req.csrfToken(),
            error: 'All fields are required.' 
        });
    }

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
        if (row) {
            return res.render('signup', { 
                csrfToken: req.csrfToken(),
                error: 'Username already exists.' 
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], (err) => {
            if (err) {
                return res.render('signup', { 
                    csrfToken: req.csrfToken(),
                    error: 'Error creating user.' 
                });
            }
            res.redirect('/login');
        });
    });
});

// 4. Login Page (GET)
    app.get('/login', csrfProtection, (req, res) => {
    res.render('login', { 
        csrfToken: req.csrfToken(),
        error: null 
    });
});

// 5. Login Action (POST) - SECURE
app.post('/login', loginLimiter, csrfProtection, (req, res) => {
    let { username, password } = req.body;
    username = validator.escape(validator.trim(username));
    // Login attempt log karo
logger.info(`Login attempt for user: ${username}`, { ip: req.ip });

    if (!username || !password) {
        return res.render('login', { 
            csrfToken: req.csrfToken(),
            error: 'Username and password are required.' 
        });
    }

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) {
            return res.render('login', { 
                csrfToken: req.csrfToken(),
                error: 'Invalid username or password.' 
            });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (isPasswordValid) {
            const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { 
                httpOnly: true, 
                sameSite: 'strict',
                secure: false
            });
            res.redirect('/profile');
        } else {
            return res.render('login', { 
                csrfToken: req.csrfToken(),
                error: 'Invalid username or password.' 
            });
        }
    });
});

// 6. Secure Profile (Protected)
app.get('/profile', authenticateJWT, (req, res) => {
    res.render('profile', { user: req.user });  // ✅ EJS template
});
// --- SERVER START ---
app.listen(3000, () => console.log('✅ SECURE server running on http://localhost:3000'));