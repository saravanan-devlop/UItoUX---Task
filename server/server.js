const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'9092815611',
    database: 'auto_parts'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Register User
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).send('Error on the server.');
        res.status(200).send({ auth: true });
    });
});

// Login User
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!results.length) return res.status(404).send('No user found.');

        const user = results[0];

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        const token = jwt.sign({ id: user.id }, 'supersecret', { expiresIn: 86400 }); // 24 hours
        res.status(200).send({ auth: true, token });
    });
});

// Get Categories
app.get('/categories', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get Products
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get Single Product
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// Create Order
app.post('/orders', (req, res) => {
    const { user_id, total, status, items } = req.body;
    db.query('INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)', [user_id, total, status], (err, result) => {
        if (err) throw err;
        const orderId = result.insertId;
        items.forEach(item => {
            db.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [orderId, item.product_id, item.quantity, item.price]);
        });
        res.json({ orderId });
    });
});

// Get Orders for a User
app.get('/orders/:userId', (req, res) => {
    const { userId } = req.params;
    db.query('SELECT * FROM orders WHERE user_id = ?', [userId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get Reviews for a Product
app.get('/reviews/:productId', (req, res) => {
    const { productId } = req.params;
    db.query('SELECT * FROM reviews WHERE product_id = ?', [productId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add Review
app.post('/reviews', (req, res) => {
    const { product_id, user_id, rating, comment } = req.body;
    db.query('INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)', [product_id, user_id, rating, comment], (err, result) => {
        if (err) throw err;
        res.json({ reviewId: result.insertId });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));