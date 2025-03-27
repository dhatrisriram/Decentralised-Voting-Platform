// Function to get or set the end time of voting
function getEndTime() {
    const storedEndTime = localStorage.getItem('votingEndTime');
    if (storedEndTime) {
        return new Date(parseInt(storedEndTime));
    } else {
        // Set a new end time (1 hour from now)
        const newEndTime = new Date().getTime() + 3600000;
        localStorage.setItem('votingEndTime', newEndTime);
        return new Date(newEndTime);
    }
}

// Function to update the dashboard
function updateDashboard() {
    const votedCountElement = document.getElementById('voted-count');
    const toVoteCountElement = document.getElementById('to-vote-count');
    const timeLeftElement = document.getElementById('time-left');

    const remainingMembers = totalMembers - votedMembers;
    votedCountElement.textContent = votedMembers;
    toVoteCountElement.textContent = remainingMembers;

    // Calculate time left
    const now = new Date().getTime();
    const timeLeft = votingEndTime - now;
    if (timeLeft <= 0) {
        timeLeftElement.textContent = 'Voting period has ended';
        clearInterval(timerInterval);
        return;
    }

    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    timeLeftElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Example data
const totalMembers = 0;
let votedMembers = 0;
const votingEndTime = getEndTime();

// Update dashboard every second
const timerInterval = setInterval(updateDashboard, 1000);

// Initialize dashboard
updateDashboard();
