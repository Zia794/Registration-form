// 1️⃣ Required packages
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();

// 2️⃣ Middleware
app.use(cors());
app.use(bodyParser.json()); // JSON requests handle kare

// 3️⃣ MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // aapka MySQL username
  password: 'Zia794?!?',  // aapka MySQL password
  database: "registraion" // aapka database name
});

db.connect(err => {
  if(err) {
    console.error('DB connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// ✅ Test route to check backend
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// 4️⃣ API Route for registration
app.post('/register', async (req, res) => {
  const { name, email, password, phone, gender } = req.body;

  // Simple validation
  if (!name || !email || !password || !phone || !gender) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (name, email, password, phone, gender) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, email, hashedPassword, phone, gender], (err, result) => {
      if(err) {
        if(err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ message: err.message });
      }
      res.json({ message: 'User registered successfully!' });
    });

  } catch(error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 5️⃣ Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
