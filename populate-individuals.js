const db = require('./db');

// Arrays of French names for generating realistic data
const firstNames = [
    'Jean', 'Marie', 'Pierre', 'Sophie', 'Lucas', 'Emma', 'Thomas', 'Julie', 'Nicolas', 'Camille',
    'Antoine', 'Léa', 'Maxime', 'Chloé', 'Alexandre', 'Manon', 'Louis', 'Sarah', 'Hugo', 'Laura',
    'Gabriel', 'Clara', 'Raphaël', 'Inès', 'Arthur', 'Zoé', 'Jules', 'Lola', 'Adam', 'Eva',
    'Paul', 'Alice', 'Victor', 'Louise', 'Mathis', 'Jade', 'Nathan', 'Agathe', 'Théo', 'Léonie',
    'Ethan', 'Margaux', 'Tom', 'Juliette', 'Noah', 'Romane', 'Enzo', 'Lucie', 'Liam', 'Anaïs'
];

const lastNames = [
    'Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent',
    'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel', 'Fournier', 'Girard',
    'Bonnet', 'Dupont', 'Lambert', 'Fontaine', 'Rousseau', 'Vincent', 'Muller', 'Lefevre', 'Faure', 'Mercier',
    'Blanc', 'Guerin', 'Masson', 'Mathieu', 'Garcia', 'Garnier', 'Chevalier', 'Perrin', 'Gauthier', 'Legrand',
    'Denis', 'Dumas', 'Lemaire', 'Giraud', 'Henry', 'Roussel', 'Duval', 'Gautier', 'Guerin', 'Boyer'
];

// Function to generate a random French phone number
function generatePhoneNumber() {
    const prefixes = ['06', '07'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return `${prefix}${number}`;
}

// Function to generate a random name
function generateName() {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
}

// Clear existing data in the correct order
db.prepare('DELETE FROM scores').run();
db.prepare('DELETE FROM individuals').run();

// Prepare the insert statement
const insertIndividual = db.prepare(`
    INSERT INTO individuals (name, phone)
    VALUES (?, ?)
`);

// Insert 150 individuals
for (let i = 0; i < 150; i++) {
    const name = generateName();
    const phone = generatePhoneNumber();
    insertIndividual.run(name, phone);
}

console.log('150 participants ont été ajoutés à la base de données');

// Verify the insertion
const count = db.prepare('SELECT COUNT(*) as count FROM individuals').get();
console.log(`Nombre total de participants dans la base de données: ${count.count}`); 