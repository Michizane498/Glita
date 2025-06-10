const socket = io();
const judgeId = 1; // Hardcoded for simplicity (should be dynamic)

// Fetch individuals and criteria from the server
fetch('/api/individuals')
  .then(res => res.json())
  .then(individuals => {
    const select = document.getElementById('individual-select');
    individuals.forEach(ind => {
      const option = document.createElement('option');
      option.value = ind.id;
      option.textContent = ind.name;
      select.appendChild(option);
    });
  });

// Submit scores
document.getElementById('submit-btn').addEventListener('click', () => {
  const individualId = document.getElementById('individual-select').value;
  const inputs = document.querySelectorAll('.criteria-input');
  
  inputs.forEach(input => {
    socket.emit('submit-score', {
      judgeId,
      individualId,
      criterionId: input.dataset.criterionId,
      score: parseInt(input.value)
    });
  });
});

// Real-time rankings update
socket.on('rankings-updated', (rankings) => {
  const table = document.getElementById('rankings-table');
  table.innerHTML = `
    <table>
      <tr><th>Rank</th><th>Name</th><th>Avg Score</th></tr>
      ${rankings.map((ind, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${ind.name}</td>
          <td>${ind.average.toFixed(2)}</td>
        </tr>
      `).join('')}
    </table>
  `;
});