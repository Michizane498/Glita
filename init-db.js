const db = require('./db');

// Insert criteria
const criteria = [
    { id: 1, name: "Compétences Techniques" },
    { id: 2, name: "Résolution de Problèmes" },
    { id: 3, name: "Communication" },
    { id: 4, name: "Leadership" },
    { id: 5, name: "Travail d'Équipe" },
    { id: 6, name: "Innovation" },
    { id: 7, name: "Adaptabilité" },
    { id: 8, name: "Gestion du Temps" },
    { id: 9, name: "Qualité du Travail" }
];

const insertCriteria = db.prepare(`
    INSERT OR IGNORE INTO criteria (id, name)
    VALUES (?, ?)
`);

criteria.forEach(criterion => {
    insertCriteria.run(criterion.id, criterion.name);
});

console.log('Base de données initialisée avec les critères'); 