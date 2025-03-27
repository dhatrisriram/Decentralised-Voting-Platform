const express = require('express');
const { blake2b } = require('blake2');
const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(express.json());  // Middleware to parse JSON request body
app.use(cors()); // Enable CORS for frontend-backend communication

// MongoDB connection URI and database/collection
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'user_database';
const usersCollectionName = 'users';

// Connect to MongoDB
async function connectToDb() {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    const db = client.db(dbName);
    return db.collection(usersCollectionName);
}

// Function to hash a password using blake2b with a salt
function hashPassword(password, salt) {
    const hash = blake2b(64);
    hash.update(Buffer.from(salt + password));
    return hash.digest('hex');
}

// Generate a random salt
function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
}

// Register user route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    const usersCollection = await connectToDb();

    // Check if the email is already registered
    const existingEmail = await usersCollection.findOne({ email });
    if (existingEmail) {
        return res.status(400).json({ message: "Email is already registered." });
    }

    // Check if the username is already taken
    const existingUsername = await usersCollection.findOne({ username });
    if (existingUsername) {
        return res.status(400).json({ message: "Username already taken." });
    }

    // Generate salt and hash the password
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    // Store user in the database
    await usersCollection.insertOne({
        username,
        email,
        password: hashedPassword,
        salt
    });

    res.status(200).json({ message: "User registered successfully!" });
});

// Login user route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const usersCollection = await connectToDb();

    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    // Verify the password
    const hashedPasswordAttempt = hashPassword(password, user.salt);
    if (hashedPasswordAttempt === user.password) {
        return res.status(200).json({ message: "Login successful!" });
    } else {
        return res.status(400).json({ message: "Incorrect password." });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
