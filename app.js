const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();

const db = new sqlite3.Database(':memory:'); 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER, username TEXT, password TEXT, bio TEXT)");
  db.run("INSERT INTO users VALUES (1, 'admin', 'password123', 'I am the boss')");
});

// --- VULNERABLE ROUTES ---

// ISAY YAHAN RAKHNA HAI (Purane /login ko hata kar ye wala)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  db.get(query, (err, row) => {
    if (row) { 
      // Ye line popup chalane ke liye zaroori hai
      res.send(`<h1>Welcome ${row.username}</h1><p>Bio: ${row.bio}</p><a href="/">Back</a>`); 
    } 
    else { 
      res.send("Login failed! <a href='/'>Back</a>"); 
    }
  });
});

app.post('/update-bio', (req, res) => {
  const { username, bio } = req.body;
  db.run(`UPDATE users SET bio = '${bio}' WHERE username = '${username}'`, (err) => {
    res.redirect('/');
  });
});

app.get('/', (req, res) => {
  res.render('index');
});

// Browser ki built-in security ko disable karne ke liye
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self' 'unsafe-inline'");
  res.setHeader("X-XSS-Protection", "0");
  next();
});

app.listen(3000, () => console.log('Vulnerable server running on http://localhost:3000'));