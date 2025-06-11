const socket = io();

// Function to update the table with rankings data
function updateRankingsTable(rankings) {
    const tableBody = document.getElementById('rankingsTable');
    tableBody.innerHTML = '';
    
    rankings.forEach((ranking, index) => {
        const row = document.createElement('tr');
        if (index < 3) {
            row.className = `rank-${index + 1}`;
        }
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${ranking.id}</td>
            <td>${ranking.name}</td>
            <td>${ranking.phone}</td>
            <td>${ranking.total_points || 0}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Fetch initial rankings data
async function fetchInitialRankings() {
    try {
        const response = await fetch('/api/rankings');
        if (!response.ok) {
            throw new Error('Failed to fetch rankings');
        }
        const rankings = await response.json();
        updateRankingsTable(rankings);
    } catch (error) {
        console.error('Error fetching rankings:', error);
    }
}

// Fetch initial data when page loads
document.addEventListener('DOMContentLoaded', fetchInitialRankings);

// Handle real-time updates
socket.on('rankings-updated', updateRankingsTable); 