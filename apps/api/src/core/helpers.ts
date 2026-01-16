export function validateNIP(nip: string): boolean {
    const cleanNip = nip.replace(/[-\s]/g, "");

    if (cleanNip.length !== 10 || !/^\d{10}$/.test(cleanNip)) {
        return false;
    }

    const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanNip[i]) * weights[i];
    }

    return sum % 11 === parseInt(cleanNip[9]);
}
