const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: String,
    position: String,
    image: String,
    votes: { type: Number, default: 0 },
    voters: { type: [String], default: [] } // Array to track voter IPs
});

module.exports = mongoose.model('Candidate', candidateSchema);
