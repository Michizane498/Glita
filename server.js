const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// API endpoint to get all individuals
app.get('/api/individuals', (req, res) => {
    try {
        const individuals = db.prepare(`
            SELECT id, name, phone 
            FROM individuals 
            ORDER BY id
        `).all();
        
        if (!individuals || individuals.length === 0) {
            console.log('Aucun participant trouvé dans la base de données');
            return res.status(404).json({ error: 'Aucun participant trouvé' });
        }
        
        console.log(`${individuals.length} participants chargés`);
        res.json(individuals);
    } catch (error) {
        console.error('Erreur lors de la récupération des participants:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// API endpoint to get rankings
app.get('/api/rankings', (req, res) => {
    try {
        const rankings = getRankings();
        res.json(rankings);
    } catch (error) {
        console.error('Erreur lors de la récupération du classement:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

io.on('connection', (socket) => {
    console.log('Juge connecté');

    socket.on('submit-score', (data) => {
        const { judgeId, individualId, criterionId, score } = data;
        
        // Check if score already exists for this judge and criterion
        const existingScore = db.prepare(`
            SELECT id FROM scores 
            WHERE individual_id = ? AND judge_id = ? AND criterion_id = ?
        `).get(individualId, judgeId, criterionId);

        if (existingScore) {
            // Update existing score
            db.prepare(`
                UPDATE scores 
                SET score = ? 
                WHERE individual_id = ? AND judge_id = ? AND criterion_id = ?
            `).run(score, individualId, judgeId, criterionId);
        } else {
            // Insert new score
            db.prepare(`
                INSERT INTO scores (individual_id, judge_id, criterion_id, score)
                VALUES (?, ?, ?, ?)
            `).run(individualId, judgeId, criterionId, score);
        }

        // Broadcast updated rankings
        const rankings = getRankings();
        io.emit('rankings-updated', rankings);
    });
});

function getRankings() {
    return db.prepare(`
        SELECT 
            i.id,
            i.name,
            i.phone,
            COALESCE(SUM(s.score), 0) as total_points
        FROM individuals i
        LEFT JOIN scores s ON i.id = s.individual_id
        GROUP BY i.id
        ORDER BY total_points DESC, i.id ASC
    `).all();
}

server.listen(3000, () => {
    console.log('Serveur en cours d\'exécution sur http://localhost:3000');
});