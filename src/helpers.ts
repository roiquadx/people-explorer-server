import type { Person, PersonName } from './types';

export function cleanString(v: unknown): string {
    return typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim();
}

export function isValidPerson(input: any): input is Person {
    if (!input || typeof input !== 'object') return false;
    const id = cleanString(input.id);
    if (!id) return false;
    const name = input.name;
    if (!name || typeof name !== 'object') return false;
    return true;
}

export function normalizeName(n: any): PersonName {
    return {
        title: cleanString(n?.title),
        first: cleanString(n?.first),
        last: cleanString(n?.last),
    };
}
