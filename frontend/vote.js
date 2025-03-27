document.addEventListener("DOMContentLoaded", function() {
    // Fetch the CSV data
    fetch('candidates.csv')
        .then(response => response.text())
        .then(csvText => {
            // Parse the CSV data
            const candidates = parseCSV(csvText);

            // Generate the candidate list
            generateCandidateList(candidates);
        })
        .catch(error => console.error('Error fetching CSV file:', error));
});

function parseCSV(csvText) {
    const rows = csvText.trim().split('\n');
    const header = rows.shift().split(','); // Get headers and remove them from rows

    return rows.map(row => {
        const [slno, photo, name, description] = row.split(',');
        return { slno, photo, name, description };
    });
}

function generateCandidateList(candidates) {
    const candidateList = document.getElementById('candidateList');

    candidates.forEach(candidate => {
        const candidateDiv = document.createElement('div');
        candidateDiv.className = 'candidate';

        candidateDiv.innerHTML = `
            <input type="radio" id="candidate${candidate.slno}" name="candidate" value="${candidate.slno}">
            <label for="candidate${candidate.slno}">
                <img src="${candidate.photo}" alt="${candidate.name}">
                <div class="info">
                    <h2>${candidate.name}</h2>
                    <p>${candidate.description}</p>
                </div>
            </label>
        `;

        candidateList.appendChild(candidateDiv);
    });
}

document.getElementById('submitVoteBtn').addEventListener('click', function() {
    const selectedCandidate = document.querySelector('input[name="candidate"]:checked');
    
    if (selectedCandidate) {
        const candidateValue = selectedCandidate.value;
        alert("You voted for Candidate " + candidateValue);
        // You can add code here to handle the vote submission, e.g., sendVoteToServer(candidateValue);
    } else {
        alert("Please select a candidate to vote for.");
    }
});
