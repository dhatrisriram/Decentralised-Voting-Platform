const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB (without deprecated options)
mongoose.connect('mongodb://localhost:27017/electionDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define Voter Schema and Model
const voterSchema = new mongoose.Schema({
    name: String,
    email: String,
    uniqueId: String,
});
const Voter = mongoose.model('Voter', voterSchema);

// Define Candidate Schema and Model
const candidateSchema = new mongoose.Schema({
    name: String,
    party: String,  // Assuming there is a 'party' field
});
const Candidate = mongoose.model('Candidate', candidateSchema);

// Ensure the uploads directory exists
const uploadDir = './uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const csvFileFilter = (req, file, cb) => {
    const fileTypes = /csv/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
        cb(null, true);
    } else {
        cb(new Error('Only CSV files are allowed'));
    }
};

const upload = multer({ 
    storage,
    fileFilter: csvFileFilter
});

// Helper function to generate unique ID
const generateUniqueId = () => crypto.randomBytes(4).toString('hex').slice(0, 7);

// Function to process CSV files and save to database
const processCsvFile = async (filePath, Model, transformRow) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', async (row) => {
                try {
                    await transformRow(row, Model);
                } catch (error) {
                    console.error('Error processing row:', error);
                }
            })
            .on('end', () => resolve())
            .on('error', (error) => reject(error));
    });
};

// Route to handle form submission and file upload
app.post('/submit-room-details', upload.fields([
    { name: 'voter_list', maxCount: 1 },
    { name: 'candidate_list', maxCount: 1 }
]), async (req, res) => {
    const { room_name, admin_email, date_time } = req.body;
    const voterList = req.files['voter_list'] ? req.files['voter_list'][0] : null;
    const candidateList = req.files['candidate_list'] ? req.files['candidate_list'][0] : null;

    if (!voterList || !candidateList) {
        return res.status(400).send('Both voter list and candidate list are required');
    }

    console.log('Room Name:', room_name);
    console.log('Admin Email:', admin_email);
    console.log('Date and Time:', date_time);
    console.log('Voter List File:', voterList.filename);
    console.log('Candidate List File:', candidateList.filename);

    try {
        // Process and save voters
        await processCsvFile(voterList.path, Voter, async (row, Model) => {
            const uniqueId = generateUniqueId();
            const newVoter = new Model({
                name: row.name,
                email: row.email,
                uniqueId: uniqueId,
            });
            await newVoter.save();
            console.log('Voter saved with unique ID:', uniqueId);
        });

        // Process and save candidates
        await processCsvFile(candidateList.path, Candidate, async (row, Model) => {
            const newCandidate = new Model({
                name: row.name,
                party: row.party,  // Assuming the CSV contains a 'party' field
            });
            await newCandidate.save();
            console.log('Candidate saved:', row.name);
        });

        console.log('Finished processing CSV files');
        res.redirect('/createOrJoin');
    } catch (error) {
        console.error('Error processing CSV files:', error);
        res.status(500).send('Error processing CSV files');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'createroom.html'));
});

app.get('/createOrJoin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'createOrJoin.html'));
});

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    if (err instanceof multer.MulterError || err.message === 'Only CSV files are allowed') {
        return res.status(400).send(err.message);
    }
    res.status(500).send('Server Error');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
