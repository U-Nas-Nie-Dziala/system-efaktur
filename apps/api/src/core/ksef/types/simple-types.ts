/**
 * TKwotowy - wartość dziesiętna z max 18 cyframi, 2 po przecinku
 * Pattern: -?\d{1,16}(\.\d{1,2})?
 */
export type TKwotowy = string;

/**
 * TKwotowy2 - wartość dziesiętna z max 22 cyframi, 8 po przecinku
 * Używane dla cen jednostkowych
 * Pattern: -?\d{1,14}(\.\d{1,8})?
 */
export type TKwotowy2 = string;

/**
 * TIlosci - ilość (22 cyfry, 6 miejsc po przecinku)
 * Pattern: -?\d{1,16}(\.\d{1,6})?
 */
export type TIlosci = string;

/** Alias dla kompatybilności */
export type TIlosc = TIlosci;

/**
 * TProcentowy - wartość procentowa 0-100 (6 miejsc po przecinku)
 * Pattern: (([1-9]\d?)|0)(\.\d{1,6})?|100(\.0{1,6})?
 */
export type TProcentowy = string;

/**
 * TNaturalny - liczba naturalna > 0
 */
export type TNaturalny = number;

/**
 * TZnakowy - tekst 1-256 znaków
 * Pattern: .{1,256}
 */
export type TZnakowy = string;

/**
 * TZnakowy2 - tekst 0-256 znaków (może być pusty)
 * Pattern: .{0,256}
 */
export type TZnakowy2 = string;

/**
 * TZnakowy20 - tekst 1-20 znaków
 * Pattern: .{1,20}
 */
export type TZnakowy20 = string;

/**
 * TZnakowy50 - tekst 1-50 znaków
 * Pattern: .{1,50}
 */
export type TZnakowy50 = string;

/**
 * TZnakowy512 - tekst 1-512 znaków
 * Pattern: .{1,512}
 */
export type TZnakowy512 = string;

/**
 * TNIP - Numer NIP
 * Pattern: [1-9](((\d[1-9])|([1-9]\d))\d{7}|\d{8})
 */
export type TNIP = string;

/**
 * TNIPIdWew - Identyfikator wewnętrzny z NIP
 * Pattern: [1-9]((\d[1-9])|([1-9]\d))\d{7}-\d{5}
 */
export type TNIPIdWew = string;

/**
 * TNrVatUE - Numer VAT UE (bez prefiksu kraju)
 * Pattern: (\d|[A-Z]|\+|\*){1,12}
 */
export type TNrVatUE = string;

/**
 * TNumerKSeF - Numer KSeF faktury (nowy format FA3)
 * Pattern: ([1-9]((\d[1-9])|([1-9]\d))\d{7}|M\d{9}|[A-Z]{3}\d{7})-(20[2-9][0-9]|2[1-9][0-9]{2}|[3-9][0-9]{3})(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])-([0-9A-F]{6})-?([0-9A-F]{6})-([0-9A-F]{2})
 */
export type TNumerKSeF = string;

/**
 * TGLN - Globalny numer lokalizacyjny
 * Pattern: \d{13}
 */
export type TGLN = string;

/**
 * TNrRB - Numer rachunku bankowego
 * Pattern: .{10,34}
 */
export type TNrRB = string;

/**
 * SWIFT_Type - Kod SWIFT
 * Pattern: [A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?
 */
export type TSWIFT = string;

/**
 * TData - Data (zakres 2016-07-01 do 2050-01-01)
 * Format: YYYY-MM-DD
 */
export type TData = string;

/**
 * TDataT - Data (zakres 2006-01-01 do 2050-01-01)
 * Format: YYYY-MM-DD
 */
export type TDataT = string;

/**
 * TDataU - Data (zakres 1990-01-01 do 2050-01-01)
 * Format: YYYY-MM-DD - dla umów i zamówień
 */
export type TDataU = string;

/**
 * TDataCzas - Data i czas
 * Format: YYYY-MM-DDTHH:MM:SS
 */
export type TDataCzas = string;

/**
 * TEmail - Adres email
 * Pattern: .{3,256}
 */
export type TEmail = string;

/**
 * TTelefon - Numer telefonu
 * Pattern: .{1,20}
 */
export type TTelefon = string;

/**
 * Walidacja kwoty
 */
export function isValidKwotowy(value: string): boolean {
    return /^-?\d{1,16}(\.\d{1,2})?$/.test(value);
}

/**
 * Walidacja NIP
 */
export function isValidNIP(value: string): boolean {
    return /^[1-9](((\d[1-9])|([1-9]\d))\d{7}|\d{8})$/.test(value);
}

/**
 * Walidacja numeru KSeF (format FA3)
 */
export function isValidNumerKSeF(value: string): boolean {
    return /^([1-9]((\d[1-9])|([1-9]\d))\d{7}|M\d{9}|[A-Z]{3}\d{7})-(20[2-9][0-9]|2[1-9][0-9]{2}|[3-9][0-9]{3})(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])-([0-9A-F]{6})-?([0-9A-F]{6})-([0-9A-F]{2})$/.test(
        value
    );
}

/**
 * Walidacja GLN
 */
export function isValidGLN(value: string): boolean {
    return /^\d{13}$/.test(value);
}

/**
 * Walidacja SWIFT
 */
export function isValidSWIFT(value: string): boolean {
    return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value);
}
