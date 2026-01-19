export enum KsefEnvironment {
    // Środowisko produkcyjne
    PRODUCTION = "https://ksef.mf.gov.pl/api",
    // Środowisko demo
    DEMO = "https://api-demo.ksef.mf.gov.pl",
    // Środowisko testowe
    TEST = "https://api-test.ksef.mf.gov.pl",
}

export enum KsefIdentifierType {
    ONIP = "onip", // NIP organizacji
    NIP = "nip", // NIP osoby fizycznej
    PESEL = "pesel", // PESEL
}

export interface KsefClientConfig {
    environment: KsefEnvironment;
    nip: string;
    // Typ identyfikatora (domyślnie ONIP)
    identifierType?: KsefIdentifierType;
    token?: string; // access token
    // Certyfikat w formacie PEM lub Base64 (dla autoryzacji)
    certificate?: string;
    // Klucz prywatny w formacie PEM (dla autoryzacji)
    privateKey?: string;
}

export interface KsefChallengeResponse {
    challenge: string;
    timestamp: string;
    timestampMs: number;
}

export interface KsefAuthResponse {
    authenticationToken: string;
    referenceNumber: string;
}

export interface KsefAuthStatus {
    // Kod statusu: 200 -> ok, 300 -> w toku, 4xx -> error
    processingCode: number;
    processingDescription: string;
}

export interface KsefAccessTokens {
    accessToken: string;
    accessValidUntil: string;
    refreshToken: string;
    refreshValidUntil: string;
}

export interface KsefSessionResponse {
    referenceNumber: string;
    validUntil: string;
}

export interface KsefInvoiceResponse {
    elementReferenceNumber: string; // nr referencyjny elementu
    processingCode: number;
    processingDescription: string;
    referenceNumber: string; // nr ref sesji
    timestamp: string;
}

export interface KsefInvoiceStatus {
    processingCode: number; // 4xx/5xx -> błąd
    processingDescription: string;
    elementReferenceNumber: string; // nr ref
    ksefReferenceNumber?: string; // nr ref faktury w ksef, nadawany po poprawnym przyjęciu
    acquisitionTimestamp?: string;
    invoiceDetails?: {
        subjectTo?: { issuedToIdentifier?: { identifier: string } };
        subjectBy?: { issuedByIdentifier?: { identifier: string } };
        invoiceNumber?: string; // numer faktury chyba z XML'a
        invoiceDate?: string;
    };
}

export interface KsefUPO {
    ksefReferenceNumber: string; // numer ref faktury w ksef
    upo: string; // zawartosc upo w base64
    timestamp: string; // dla upo
}

export interface KsefSessionCloseResponse {
    referenceNumber: string;
    timestamp: string;
    upo: string; // Zbiorcze UPO w Base64 (XML podpisany przez MF)
    numberOfInvoices: number;
}

export interface KsefExceptionDetail {
    exceptionCode: number;
    exceptionDescription: string;
}

export interface KsefApiError {
    exception?: {
        exceptionDetailList: KsefExceptionDetail[];
        referenceNumber?: string; // numer ref błędu
        serviceCode?: string;
        serviceCtx?: string;
        serviceName?: string;
        timestamp?: string;
    };

    code?: number;
    message?: string;
    details?: string;
}

export enum PublicKeyCertificateUsage {
    // Do szyfrowania tokena KSeF przy autoryzacji
    KsefTokenEncryption = "KsefTokenEncryption",
    // Do szyfrowania klucza symetrycznego przy wysyłaniu faktur
    SymmetricKeyEncryption = "SymmetricKeyEncryption",
}

export interface PemCertificateInfo {
    // Certyfikat w formacie Base64 (DER)
    certificate: string;
    validFrom: string;
    validTo: string;
    usage: PublicKeyCertificateUsage[]; // rodzaj
}

export interface CertificateCache {
    ksefTokenCert?: string;
    symmetricKeyCert?: string;
    expiresAt?: Date;
}
