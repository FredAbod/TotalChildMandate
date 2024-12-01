const mongoose = require('mongoose');
const Candidate = require('./models/user.models'); // Adjust path as needed

mongoose.connect('mongodb+srv://fredrickbolutife:Z3O06ZMPTW5K2rDx@ch14.mubqlte.mongodb.net/votingApp')
    .then(() => console.log('Connected to MongoDB for seeding'))
    .catch(err => console.error('MongoDB connection error:', err));

const seedCandidates = async () => {
    const candidates = [
        { name: 'Peculiar Ajayi', position: 'Head Boy', image: 'ajayi.jpg' },
        { name: 'Sharon Olalekan', position: 'Health Prefect', image: 'sharron.jpg' },
        { name: 'Amirat Aina', position: 'Head Girl', image: 'Amirat.jpg' },
        { name: 'Obanijesu Arogundade', position: 'Social Prefect', image: 'obanijesu.jpg' },
        { name: 'Zion Olalekan', position: 'Library Prefect', image: 'zion.jpg' }
    ];

    try {
        await Candidate.insertMany(candidates);
        console.log('Candidates seeded successfully');
        mongoose.disconnect();
    } catch (err) {
        console.error('Error seeding candidates:', err);
    }
};

seedCandidates();
