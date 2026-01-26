export function randomInvoiceId() {
    const date = new Date();

    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);

    const hex = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();

    return `${date.getFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}/${hex}`;
}
