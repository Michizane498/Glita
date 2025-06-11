const socket = io();

// Handle real-time updates
socket.on('rankings-updated', (rankings) => {
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
}); 