export function getCurrentTime(): string {
    return new Date().toISOString();
}

export function formatISO(isoDate: string): string {
    const date = new Date(isoDate);

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);

    const formattedTime = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(date);

    return `${formattedDate} at ${formattedTime}`;
}
