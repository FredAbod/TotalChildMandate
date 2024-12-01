const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simulated Database
const dbFile = path.join(__dirname, 'data.json');
let candidates = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
let voteTracker = {}; // { candidateId: [IP1, IP2, ...] }

// Helper to get client IP
const getClientIp = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    return forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;
};

// Get all candidates
app.get('/candidates', (req, res) => {
    res.json(candidates);
});

// Vote for a candidate
app.post('/vote/:id', (req, res) => {
    const { id } = req.params;
    const ip = getClientIp(req);

    if (!voteTracker[id]) {
        voteTracker[id] = [];
    }

    // Check if the IP has already voted for this candidate
    if (voteTracker[id].includes(ip)) {
        return res.status(403).json({ message: 'You have already voted for this candidate!' });
    }

    const candidate = candidates.find(c => c.id === id);

    if (candidate) {
        candidate.votes += 1;
        voteTracker[id].push(ip);

        fs.writeFileSync(dbFile, JSON.stringify(candidates, null, 2));
        res.json(candidate);
    } else {
        res.status(404).send('Candidate not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
