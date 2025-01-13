const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.static('public'));

const db = new sqlite3.Database('./data.sqlite', (err) => {
    if (err) console.error(err.message);
    else console.log('Conectat la baza de date.');
});

app.get('/api/cauta-oras', (req, res) => {
    const oras = req.query.oras;
    const query = `
        SELECT judet, nume, an_2010, an_2011, an_2012, an_2013, an_2014, an_2015, an_2016
        FROM \`indicelevitalitatiiculturaletotal2010-2016_Sheet1\`
        WHERE nume = ?`;
    db.all(query, [oras], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.listen(port, () => console.log(`Serverul rulează la http://localhost:${port}`));
