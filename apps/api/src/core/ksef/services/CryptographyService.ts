import crypto from "crypto";

export interface FileMetadata {
    hashSHA: string; // base64
    fileSize: number; // bajty
}

/**
 * Dane szyfrowania sesji
 * Generowane przy otwieraniu sesji interaktywnej
 */
export interface EncryptionData {
    cipherKey: Buffer; // 32 bajty
    cipherIv: Buffer; // 16 bajtów
    encryptedSymmetricKey: string; // RSA-OAEP, Base64
    initializationVector: string; // iV w Base64
}

export class CryptographyService {
    // Klucz publiczny do szyfrowania klucza symetrycznego (faktury)
    private symmetricKeyPem: string;
    // Klucz publiczny do szyfrowania tokena KSeF (autoryzacja)
    private ksefTokenKeyPem: string;

    /**
     * @param symmetricKeyPem - Klucz publiczny KSeF do szyfrowania klucza symetrycznego (RSA)
     * @param ksefTokenKeyPem - Klucz publiczny KSeF do szyfrowania tokena (RSA) - opcjonalny, domyślnie używa symmetricKeyPem
     */
    constructor(symmetricKeyPem: string, ksefTokenKeyPem?: string) {
        this.symmetricKeyPem = symmetricKeyPem;
        this.ksefTokenKeyPem = ksefTokenKeyPem || symmetricKeyPem;
    }

    setPublicKeys(symmetricKeyPem: string, ksefTokenKeyPem: string): void {
        this.symmetricKeyPem = symmetricKeyPem;
        this.ksefTokenKeyPem = ksefTokenKeyPem;
    }

    /**
     * Generuje dane szyfrowania dla sesji interaktywnej
     *
     * Zgodnie z dokumentacją KSeF:
     * - Generuje losowy klucz AES-256 (32 bajty)
     * - Generuje losowy IV (16 bajtów)
     * - Szyfruje klucz publicznym kluczem MF (RSA-OAEP SHA-256)
     *
     * @returns EncryptionData do użycia w openOnlineSession i sendInvoice
     */
    getEncryptionData(): EncryptionData {
        const cipherKey = crypto.randomBytes(32);
        const cipherIv = crypto.randomBytes(16);

        const encryptedKey = crypto.publicEncrypt(
            {
                key: this.symmetricKeyPem,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            cipherKey
        );

        return {
            cipherKey,
            cipherIv,
            encryptedSymmetricKey: encryptedKey.toString("base64"),
            initializationVector: cipherIv.toString("base64"),
        };
    }

    /**
     * Szyfruje dane algorytmem AES-256-CBC z PKCS#7 padding
     *
     * Zgodne z dokumentacją KSeF dla szyfrowania faktur.
     *
     * @param content - Dane do zaszyfrowania (np. XML faktury)
     * @param key - Klucz AES-256 (32 bajty)
     * @param iv - Wektor inicjalizujący (16 bajtów)
     * @returns Zaszyfrowane dane
     */
    encryptBytesWithAES256(content: Buffer, key: Buffer, iv: Buffer): Buffer {
        const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
        const encrypted = Buffer.concat([cipher.update(content), cipher.final()]);
        return encrypted;
    }

    /**
     * Deszyfruje dane algorytmem AES-256-CBC
     *
     * @param encryptedContent - Zaszyfrowane dane
     * @param key - Klucz AES-256 (32 bajty)
     * @param iv - Wektor inicjalizujący (16 bajtów)
     * @returns Odszyfrowane dane
     */
    decryptBytesWithAES256(encryptedContent: Buffer, key: Buffer, iv: Buffer): Buffer {
        const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
        const decrypted = Buffer.concat([decipher.update(encryptedContent), decipher.final()]);
        return decrypted;
    }

    /**
     * Oblicza metadane pliku: hash SHA-256 i rozmiar
     *
     * Wymagane przez API KSeF przy wysyłaniu faktur:
     * - invoiceHash - hash i rozmiar oryginalnej faktury
     * - encryptedDocumentHash - hash i rozmiar zaszyfrowanej faktury
     *
     * @param file - Plik jako Buffer lub string
     * @returns FileMetadata z hashem SHA-256 (Base64) i rozmiarem
     */
    getMetaData(file: Buffer | string): FileMetadata {
        const buffer = typeof file === "string" ? Buffer.from(file, "utf-8") : file;
        const hash = crypto.createHash("sha256").update(buffer).digest();

        return {
            hashSHA: hash.toString("base64"),
            fileSize: buffer.length,
        };
    }

    /**
     * Szyfruje token KSeF formatem {token}|{timestampMs}
     *
     * Zgodne z dokumentacją dla autoryzacji tokenem:
     * - Format: "{tokenKSeF}|{timestampMs}"
     * - Szyfrowanie: RSA-OAEP SHA-256
     * - Używa certyfikatu KsefTokenEncryption
     *
     * @param token - Token KSeF
     * @param timestampMs - Timestamp z challenge jako milisekundy Unix
     * @returns Zaszyfrowany token w Base64
     */
    encryptKsefToken(token: string, timestampMs: number): string {
        const tokenWithTimestamp = `${token}|${timestampMs}`;
        const encrypted = crypto.publicEncrypt(
            {
                key: this.ksefTokenKeyPem,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            Buffer.from(tokenWithTimestamp, "utf-8")
        );
        return encrypted.toString("base64");
    }
}
