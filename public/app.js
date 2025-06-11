const socket = io();

// Judge criteria mapping
const judgeCriteria = {
    1: [1, 2, 3],    // Critères du Juge 1
    2: [4, 5, 6],    // Critères du Juge 2
    3: [7, 8, 9]     // Critères du Juge 3
};

// Criteria names
const criteriaNames = {
    1: "Compétences Techniques",
    2: "Résolution de Problèmes",
    3: "Communication",
    4: "Leadership",
    5: "Travail d'Équipe",
    6: "Innovation",
    7: "Adaptabilité",
    8: "Gestion du Temps",
    9: "Qualité du Travail"
};

// Store all individuals for quick lookup
let individuals = [];

// Initialize the form
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load individuals
        const response = await fetch('/api/individuals');
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des participants');
        }
        individuals = await response.json();
        
        // Handle judge selection
        document.getElementById('judgeId').addEventListener('change', updateCriteriaInputs);
        
        // Handle individual ID input
        document.getElementById('individualId').addEventListener('input', handleIndividualIdInput);
        
        // Handle form submission
        document.getElementById('judgeForm').addEventListener('submit', handleSubmit);
        
        // Initialize criteria inputs
        updateCriteriaInputs();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement des participants. Veuillez rafraîchir la page.');
    }
});

function handleIndividualIdInput(e) {
    const id = parseInt(e.target.value);
    const participantInfo = document.getElementById('participantInfo');
    const participantName = document.getElementById('participantName');
    const participantPhone = document.getElementById('participantPhone');
    
    if (id && id >= 1 && id <= 150) {
        const individual = individuals.find(ind => ind.id === id);
        if (individual) {
            participantName.textContent = individual.name;
            participantPhone.textContent = individual.phone;
            participantInfo.classList.remove('d-none');
        } else {
            participantInfo.classList.add('d-none');
        }
    } else {
        participantInfo.classList.add('d-none');
    }
}

function updateCriteriaInputs() {
    const judgeId = parseInt(document.getElementById('judgeId').value);
    const container = document.getElementById('criteriaContainer');
    container.innerHTML = '';

    judgeCriteria[judgeId].forEach(criterionId => {
        const div = document.createElement('div');
        div.className = 'criteria-group';
        div.innerHTML = `
            <label for="criterion-${criterionId}">${criteriaNames[criterionId]}</label>
            <input type="number" 
                   class="score-input" 
                   id="criterion-${criterionId}" 
                   min="1" 
                   max="10" 
                   required>
        `;
        container.appendChild(div);
    });
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const judgeId = parseInt(document.getElementById('judgeId').value);
    const individualId = parseInt(document.getElementById('individualId').value);
    
    if (!individualId || individualId < 1 || individualId > 150) {
        alert('Veuillez entrer un ID de participant valide (1-150)');
        return;
    }
    
    // Submit scores for each criterion
    for (const criterionId of judgeCriteria[judgeId]) {
        const score = parseInt(document.getElementById(`criterion-${criterionId}`).value);
        
        socket.emit('submit-score', {
            judgeId,
            individualId,
            criterionId,
            score
        });
    }
    
    // Reset form
    e.target.reset();
    document.getElementById('participantInfo').classList.add('d-none');
    updateCriteriaInputs();
    
    // Show success message
    alert('Notes soumises avec succès!');
} 