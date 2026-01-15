import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Person } from './types';

type DbShape = {
    users: Person[];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'db.json');

async function ensureDbFile() {
    await fsp.mkdir(dataDir, { recursive: true });
    try {
        await fsp.access(dbPath);
    } catch {
        const initial: DbShape = { users: [] };
        await fsp.writeFile(dbPath, JSON.stringify(initial, null, 2), 'utf8');
    }
}

export async function readDb(): Promise<DbShape> {
    await ensureDbFile();
    const raw = await fsp.readFile(dbPath, 'utf8');
    const parsed = JSON.parse(raw) as DbShape;

    return {
        users: Array.isArray(parsed?.users) ? parsed.users : [],
    };
}

export async function writeDb(next: DbShape): Promise<void> {
    await ensureDbFile();
    await fsp.writeFile(dbPath, JSON.stringify(next, null, 2), 'utf8');
}
