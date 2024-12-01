// Fetch and display candidates
async function loadCandidates() {
    try {
        const response = await fetch('/candidates');
        console.log('API Response:', response);

        if (!response.ok) {
            throw new Error(`Failed to fetch candidates: ${response.statusText}`);
        }

        const candidates = await response.json();
        console.log('Candidates fetched:', candidates);

        const candidateSection = document.querySelector('.card-container');
        if (!candidateSection) {
            throw new Error("Element with class 'card-container' not found in the DOM.");
        }

        // Clear existing cards
        candidateSection.innerHTML = '';

        if (!candidates || candidates.length === 0) {
            candidateSection.innerHTML = '<p>No candidates available at the moment.</p>';
            return;
        }

        // Dynamically generate cards for each candidate
        candidates.forEach(candidate => {
            const card = document.createElement('div');
            card.classList.add('vote-card'); // Use the same class as in your HTML/CSS
            card.innerHTML = `
                <img src="/images/${candidate.image}" alt="${candidate.name}" class="candidate-image">
                <div class="card-content">
                    <h2>${candidate.name}</h2>
                    <p>${candidate.position}</p>
                    <p class="vote-count">Votes: <span id="votes-${candidate._id}">${candidate.votes}</span></p>
                    <button class="vote-button" onclick="vote('${candidate._id}')">Vote</button>
                </div>
            `;
            candidateSection.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading candidates:', error);
        alert('Could not load candidates. Please try again later.');
    }
}


// Handle voting
async function vote(candidateId) {
    if (!candidateId) {
        alert('Candidate ID is missing!');
        return;
    }

    try {
        console.log('Voting for candidate:', candidateId);

        const response = await fetch(`/vote/${candidateId}`, { method: 'POST' });
        console.log('Vote API Response:', response);

        if (response.ok) {
            const updatedCandidate = await response.json();
            console.log('Updated Candidate:', updatedCandidate);

            document.getElementById(`votes-${updatedCandidate._id}`).textContent = updatedCandidate.votes;
            alert(`Thank you for voting for ${updatedCandidate.name}!`);
        } else if (response.status === 403) {
            alert('You have already voted for this candidate!');
        } else {
            alert('An error occurred. Please try again.');
        }
    } catch (error) {
        console.error('Error in voting function:', error);
        alert('An error occurred. Please try again.');
    }
}


// Ensure the script runs after the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadCandidates();
});
