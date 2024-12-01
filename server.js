const express = require('express');
const mongoose = require('mongoose');
const Candidate = require('./models/user.models');
const path = require('path');
const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://fredrickbolutife:Z3O06ZMPTW5K2rDx@ch14.mubqlte.mongodb.net/votingApp')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to get client IP
const getClientIp = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    return forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;
};

// Get all candidates
app.get('/candidates', async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching candidates' });
    }
});

// Vote for a candidate


// Voting endpoint
app.post('/vote/:id', async (req, res) => {
    const { id } = req.params;
    const voterIp = getClientIp(req);

    try {
        const candidate = await Candidate.findById(id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        // Check if the voter has already voted
        if (candidate.voters.includes(voterIp)) {
            return res.status(403).json({ message: 'You have already voted for this candidate!' });
        }

        // Update votes and add voter IP
        candidate.votes += 1;
        candidate.voters.push(voterIp);

        await candidate.save();
        res.json(candidate);
    } catch (err) {
        console.error('Error voting:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
