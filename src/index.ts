import express from 'express';
import cors from 'cors';
import { readDb, writeDb } from './db';
import type { Person } from './types';
import { cleanString, isValidPerson, normalizeName } from './helpers';
import { getCorsOrigins } from './config/cors';

const app = express();

app.use(
    cors({
        origin: getCorsOrigins(),
        credentials: false,
    })
);
app.use(express.json({ limit: '1mb' }));

// Health
app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});

// GET saved users
app.get('/api/users', async (_req, res) => {
    const db = await readDb();
    res.json(db.users);
});

// POST save a profile (upsert by id)
app.post('/api/users', async (req, res) => {
    const body = req.body;

    if (!isValidPerson(body)) {
        res.status(400).json({ message: 'Invalid user payload' });
        return;
    }

    const db = await readDb();
    const existingId = db.users.findIndex((u) => u.id === body.id);

    const normalized: Person = {
        ...body,
        name: normalizeName(body.name),
    };

    if (existingId >= 0) {
        db.users[existingId] = normalized;
    } else {
        db.users.unshift(normalized);
    }

    await writeDb(db);
    res.status(201).json({ ok: true });
});

// PATCH name only
app.patch('/api/users/:id', async (req, res) => {
    const id = cleanString(req.params.id);
    if (!id) {
        res.status(400).json({ message: 'Missing id' });
        return;
    }

    const patch = req.body ?? {};
    const nextName = normalizeName(patch.name);

    const db = await readDb();
    const user = db.users.find((u) => u.id === id);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    user.name = nextName;
    await writeDb(db);

    res.json({ ok: true });
});

// DELETE saved profile
app.delete('/api/users/:id', async (req, res) => {
    const id = cleanString(req.params.id);
    if (!id) {
        res.status(400).json({ message: 'Missing id' });
        return;
    }

    const db = await readDb();
    const before = db.users.length;
    db.users = db.users.filter((u) => u.id !== id);

    if (db.users.length === before) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    await writeDb(db);
    res.json({ ok: true });
});

const port = 3001;
app.listen(port, () => {
    console.log(`[server] listening on http://localhost:${port}`);
});
