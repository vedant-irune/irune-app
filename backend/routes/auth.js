const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vedantrameshsalvi',
  host: 'localhost',
  database: 'irune',
  password: '', // if any
  port: 5432,
});

router.post('/register', async (req, res) => {
    console.log(req.body);
    return;
  const { firebase_uid, phone_number, user_type } = req.body;
  if (!firebase_uid || !phone_number || !user_type) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO users (firebase_uid, phone_number, user_type)
       VALUES ($1, $2, $3) RETURNING *`,
      [firebase_uid, phone_number, user_type]
    );

    res.status(201).json({ message: 'User registered', user: result.rows[0] });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
