export function formatSqliteDate(date: Date): string {
    // format to YYYY-MM-DD hh:mm:ss and remove timezone for sqlite format compatibility
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

export function convertToSeconds(date: Date): number {
    return Math.floor(date.getTime() / 1000);
}

export function parseSqliteDate(date: string): Date {
    // the format is YYYY-MM-DD hh:mm:ss
    return new Date(date + ' GMT');
}
