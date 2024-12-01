// Fetch and display candidates
async function loadCandidates() {
    const response = await fetch('/candidates');
    const candidates = await response.json();
    const candidateSection = document.getElementById('candidates');

    candidates.forEach(candidate => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="/images/${candidate.image}" alt="${candidate.name}">
            <h3>${candidate.name}</h3>
            <p>${candidate.position}</p>
            <p>Votes: <span id="votes-${candidate.id}">${candidate.votes}</span></p>
            <button onclick="vote('${candidate.id}')">Vote</button>
        `;
        candidateSection.appendChild(card);
    });
}

// Handle voting
async function vote(candidateId) {
    try {
        const response = await fetch(`/vote/${candidateId}`, { method: 'POST' });

        if (response.ok) {
            const updatedCandidate = await response.json();
            document.getElementById(`votes-${updatedCandidate.id}`).textContent = updatedCandidate.votes;
        } else if (response.status === 403) {
            alert('You have already voted for this candidate!');
        } else {
            alert('An error occurred. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}


window.onload = loadCandidates;
