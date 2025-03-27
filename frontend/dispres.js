// Example data
const candidates = [
    { name: 'John Doe', votes: 50 },
    { name: 'Jane Smith', votes: 40 },
    { name: 'Alice Johnson', votes: 30 },
    { name: 'Bob Brown', votes: 20 }
];

const totalVoters = 100;
const votedCount = 70;

// Set winner and rankings
const winner = candidates.reduce((max, candidate) => candidate.votes > max.votes ? candidate : max, candidates[0]);
document.getElementById('winner-name').textContent = winner.name;
document.getElementById('total-voters').textContent = totalVoters;
document.getElementById('voted-count').textContent = votedCount;

const rankingList = document.getElementById('ranking');
candidates.sort((a, b) => b.votes - a.votes).forEach(candidate => {
    const listItem = document.createElement('li');
    listItem.textContent = `${candidate.name}: ${candidate.votes} votes`;
    rankingList.appendChild(listItem);
});

// Create pie chart
const ctx = document.getElementById('votesChart').getContext('2d');
const votesChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: candidates.map(candidate => candidate.name),
        datasets: [{
            label: 'Votes',
            data: candidates.map(candidate => candidate.votes),
           backgroundColor: ['#6c757d', '#007bff', '#28a745', '#ffc107'],
            borderColor: '#fff',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 18, // Increase font size for legend labels
                        weight: 'bold' // Optional: Make font bold for better readability
                    },
                    color: '#333' // Optional: Adjust color to match your design
                }
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw} votes`;
                    }
                }
            }
        },
        layout: {
            padding: 20 // Adds space around the chart if needed
        }
    }
});
