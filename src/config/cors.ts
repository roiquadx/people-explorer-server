export function getCorsOrigins(): string[] {
    const raw = String(process.env.CORS_ORIGIN ?? '').trim();

    if (!raw) {
        return ['http://localhost:5173'];
    }

    const origins = raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    return origins.length ? origins : ['http://localhost:5173'];
}
