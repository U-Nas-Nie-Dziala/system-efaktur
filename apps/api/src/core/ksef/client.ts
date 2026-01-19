import axios, { AxiosError, AxiosInstance } from "axios";
import { XAdESSignerService } from "./services/XAdESSignerService";
import { CryptographyService, EncryptionData } from "./services/CryptographyService";
import {
    CertificateCache,
    KsefAccessTokens,
    KsefApiError,
    KsefAuthResponse,
    KsefAuthStatus,
    KsefChallengeResponse,
    KsefClientConfig,
    KsefIdentifierType,
    KsefInvoiceResponse,
    KsefInvoiceStatus,
    KsefSessionCloseResponse,
    KsefSessionResponse,
    KsefUPO,
    PemCertificateInfo,
    PublicKeyCertificateUsage,
} from "./types/api";
import crypto from "crypto";

export class KsefClient {
    private config: KsefClientConfig;
    private http: AxiosInstance;
    private sessionReferenceNumber?: string;
    private signer?: XAdESSignerService;
    private cryptoService: CryptographyService;
    private encryptionData?: EncryptionData;
    private certificateCache: CertificateCache = {};

    constructor(config: KsefClientConfig) {
        this.config = {
            identifierType: KsefIdentifierType.ONIP,
            ...config,
        };

        this.http = axios.create({
            baseURL: config.environment,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            timeout: 60000,
        });

        // Interceptor do obsługi błędów
        this.http.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.data) {
                    const apiError = error.response.data as KsefApiError;

                    // Nowy format API 2.0 z exception
                    if (apiError.exception) {
                        const details = apiError.exception.exceptionDetailList
                            .map((d) => `[${d.exceptionCode}] ${d.exceptionDescription}`)
                            .join("; ");
                        throw new Error(
                            `KSeF API Error [${error.response.status}]: ${details}` +
                                (apiError.exception.referenceNumber
                                    ? ` (ref: ${apiError.exception.referenceNumber})`
                                    : "")
                        );
                    }

                    // Stary format
                    throw new Error(
                        `KSeF API Error [${apiError.code || error.response.status}]: ${apiError.message || "Unknown error"}` +
                            (apiError.details ? ` - ${apiError.details}` : "")
                    );
                }
                throw error;
            }
        );

        if (config.privateKey && config.certificate) {
            this.signer = new XAdESSignerService(config.privateKey, config.certificate);
        }

        this.cryptoService = new CryptographyService("", "");
    }

    /**
     * Pobiera certyfikaty publiczne KSeF z API
     *
     * GET /v2/security/public-key-certificates
     *
     * Zwraca dwa typy certyfikatów:
     * - KsefTokenEncryption - do szyfrowania tokena przy autoryzacji
     * - SymmetricKeyEncryption - do szyfrowania klucza AES przy wysyłaniu faktur
     */
    async getPublicKeyCertificates(): Promise<PemCertificateInfo[]> {
        const response = await this.http.get("/v2/security/public-key-certificates");
        return response.data as PemCertificateInfo[];
    }

    async initializeCryptography(): Promise<void> {
        if (this.certificateCache.expiresAt && this.certificateCache.expiresAt > new Date()) {
            return;
        }

        const certs = await this.getPublicKeyCertificates();

        const tokenCert = certs.find((c) => c.usage.includes(PublicKeyCertificateUsage.KsefTokenEncryption));
        if (!tokenCert) {
            throw new Error("Brak certyfikatu KsefTokenEncryption");
        }

        const symmetricCert = certs.find((c) => c.usage.includes(PublicKeyCertificateUsage.SymmetricKeyEncryption));
        if (!symmetricCert) {
            throw new Error("Brak certyfikatu SymmetricKeyEncryption");
        }

        // DER -> PEM
        const tokenKeyPem = this.extractPublicKeyFromCertificate(tokenCert.certificate);
        const symmetricKeyPem = this.extractPublicKeyFromCertificate(symmetricCert.certificate);

        this.cryptoService.setPublicKeys(symmetricKeyPem, tokenKeyPem);

        this.certificateCache = {
            ksefTokenCert: tokenKeyPem,
            symmetricKeyCert: symmetricKeyPem,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        };
    }

    private extractPublicKeyFromCertificate(certBase64: string): string {
        // DER -> PEM
        const certPem =
            "-----BEGIN CERTIFICATE-----\n" + certBase64.match(/.{1,64}/g)?.join("\n") + "\n-----END CERTIFICATE-----";

        const cert = new crypto.X509Certificate(certPem);
        return cert.publicKey.export({ type: "spki", format: "pem" }) as string;
    }

    /**
     * Pobiera wyzwanie autoryzacyjne
     *
     * POST /auth/challenge
     *
     * Czas życia challenge'a: 10 minut
     */
    async getAuthChallenge(): Promise<KsefChallengeResponse> {
        const response = await this.http.post("/v2/auth/challenge", {});

        // TS iso -> unix
        const timestampMs = new Date(response.data.timestamp).getTime();

        return {
            challenge: response.data.challenge,
            timestamp: response.data.timestamp,
            timestampMs,
        };
    }

    /**
     * Pobiera klucz publiczny do szyfrowania tokena
     *
     * GET /online/Session/EncryptionKey/{type}/{identifier}
     */
    async getPublicKey(): Promise<{ key: string; fingerprint: string }> {
        const response = await this.http.get(
            `/api/online/Session/EncryptionKey/${this.config.identifierType}/${this.config.nip}`
        );
        return {
            key: response.data.key,
            fingerprint: response.data.fingerprint,
        };
    }

    /**
     * Uwierzytelnienie tokenem KSeF
     *
     * Zgodnie z dokumentacją KSeF 2.0:
     * 1. Pobierz certyfikaty publiczne z API
     * 2. POST /auth/challenge - pobierz challenge i timestamp
     * 3. Zaszyfruj "{token}|{timestampMs}" kluczem publicznym (RSA-OAEP SHA-256)
     * 4. POST /auth/ksef-token - wyślij challenge + zaszyfrowany token
     * 5. GET /auth/{referenceNumber} - sprawdź status (polling)
     * 6. POST /auth/token/redeem - pobierz accessToken + refreshToken
     *
     * @returns Tokeny dostępowe (accessToken + refreshToken)
     */
    async authenticateWithToken(): Promise<KsefAccessTokens> {
        if (!this.config.token) {
            throw new Error("Token KSeF jest wymagany. Ustaw config.token lub użyj authenticateWithCertificate().");
        }

        // 1. certy
        await this.initializeCryptography();

        // 2. challenge
        const challenge = await this.getAuthChallenge();

        // 3. Szyfrowanie tokena
        const encryptedToken = this.cryptoService.encryptKsefToken(this.config.token, challenge.timestampMs);

        // 4. wysyłka żądania uwierzytelnienia
        const authResponse = await this.http.post("/v2/auth/ksef-token", {
            challenge: challenge.challenge,
            contextIdentifier: {
                type: this.config.identifierType === KsefIdentifierType.ONIP ? "Nip" : this.config.identifierType,
                value: this.config.nip,
            },
            encryptedToken: encryptedToken,
        });

        const authData: KsefAuthResponse = {
            authenticationToken: authResponse.data.authenticationToken.token,
            referenceNumber: authResponse.data.referenceNumber,
        };

        // 5. status uwierzytelnienia (polling)
        await this.waitForAuthCompletion(authData);

        // 6. tokeny dostępowe
        return this.redeemAccessToken(authData.authenticationToken);
    }

    /**
     * Czeka na zakończenie asynchronicznego procesu uwierzytelnienia
     *
     * GET /auth/{referenceNumber}
     *
     * @param authData - Dane z odpowiedzi uwierzytelnienia
     * @param maxAttempts - Maksymalna liczba prób (domyślnie 30)
     * @param intervalMs - Interwał między próbami w ms (domyślnie 2000)
     */
    private async waitForAuthCompletion(
        authData: KsefAuthResponse,
        maxAttempts: number = 30,
        intervalMs: number = 2000
    ): Promise<KsefAuthStatus> {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const response = await this.http.get(`/v2/auth/${authData.referenceNumber}`, {
                headers: {
                    Authorization: `Bearer ${authData.authenticationToken}`,
                },
            });

            // API 2.0 zwraca status w polu "status" jako obiekt {code, description}
            const statusData = response.data.status || response.data;
            const status: KsefAuthStatus = {
                processingCode: statusData.code ?? response.data.processingCode,
                processingDescription: statusData.description ?? response.data.processingDescription,
            };

            // 200->ok, 300->w toku
            if (status.processingCode === 200) {
                return status;
            }

            if (status.processingCode >= 400) {
                throw new Error(
                    `Uwierzytelnienie nieudane [${status.processingCode}]: ${status.processingDescription}`
                );
            }

            await new Promise((resolve) => setTimeout(resolve, intervalMs));
        }

        throw new Error(
            `Timeout: uwierzytelnienie nie zakończyło się w ciągu ${(maxAttempts * intervalMs) / 1000} sekund.`
        );
    }

    /**
     * Pobieranie tokenów dostępowych po udanym uwierzytelnieniu
     *
     * POST /auth/token/redeem
     *
     * UWAGA: Można wywołać tylko raz dla danego authenticationToken!
     *
     * @param authenticationToken - Tymczasowy token z uwierzytelnienia
     */
    private async redeemAccessToken(authenticationToken: string): Promise<KsefAccessTokens> {
        const response = await this.http.post(
            "/v2/auth/token/redeem",
            {},
            {
                headers: {
                    Authorization: `Bearer ${authenticationToken}`,
                },
            }
        );

        return {
            accessToken: response.data.accessToken.token,
            accessValidUntil: response.data.accessToken.validUntil,
            refreshToken: response.data.refreshToken.token,
            refreshValidUntil: response.data.refreshToken.validUntil,
        };
    }

    /**
     * Uwierzytelnienie certyfikatem kwalifikowanym (XAdES)
     *
     * Zgodnie z dokumentacją KSeF 2.0:
     * 1. POST /auth/challenge - pobierz challenge
     * 2. Zbuduj AuthTokenRequest XML z challenge i NIP
     * 3. Podpisz XML podpisem XAdES-BES (enveloped)
     * 4. POST /auth/xades-signature - wyślij podpisany XML
     * 5. GET /auth/{referenceNumber} - sprawdź status (polling)
     * 6. POST /auth/token/redeem - pobierz accessToken + refreshToken
     *
     * @returns Tokeny dostępowe (accessToken + refreshToken)
     */
    async authenticateWithCertificate(): Promise<KsefAccessTokens> {
        if (!this.signer) {
            throw new Error("Certyfikat i klucz prywatny są wymagane. Ustaw config.certificate i config.privateKey.");
        }

        // 1. wyzwanie
        const challenge = await this.getAuthChallenge();

        // 2. podpisany AuthTokenRequest
        const signedRequest = this.signer.generateAuthTokenRequest(challenge.challenge, this.config.nip);

        // 3. podpisany XML
        const authResponse = await this.http.post("/v2/auth/xades-signature", signedRequest, {
            headers: {
                "Content-Type": "application/octet-stream",
            },
        });

        const authData: KsefAuthResponse = {
            authenticationToken: authResponse.data.authenticationToken.token,
            referenceNumber: authResponse.data.referenceNumber,
        };

        // 4. status uwierzytelnienia (polling)
        await this.waitForAuthCompletion(authData);

        // 5. tokeny dostępowe
        return this.redeemAccessToken(authData.authenticationToken);
    }

    /**
     * Odświeżenie accessToken używając refreshToken
     *
     * POST /auth/token/refresh
     *
     * @param refreshToken
     */
    async refreshAccessToken(refreshToken: string): Promise<KsefAccessTokens> {
        const response = await this.http.post(
            "/v2/auth/token/refresh",
            {},
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            }
        );

        return {
            accessToken: response.data.accessToken.token,
            accessValidUntil: response.data.accessToken.validUntil,
            refreshToken: response.data.refreshToken?.token || refreshToken,
            refreshValidUntil: response.data.refreshToken?.validUntil || "",
        };
    }

    /**
     * Unieważnienie bieżącej sesji uwierzytelniania
     *
     * DELETE /auth/sessions/current
     *
     * Unieważnia sesję związaną z tokenem użytym do wywołania tego endpointu.
     * Po operacji:
     * - Powiązany refreshToken zostaje unieważniony
     * - Aktywne accessTokeny pozostają ważne do upływu ich terminu ważności
     *
     * @param accessToken - Token dostępowy JWT
     */
    async revokeCurrentSession(accessToken: string): Promise<void> {
        await this.http.delete("/v2/auth/sessions/current", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }

    /**
     * Otwieranie sesji interaktywnej
     *
     * POST /sessions/online
     *
     * Zgodnie z dokumentacją KSeF 2.0:
     * - Generuje klucz symetryczny AES-256 i IV
     * - Szyfruje klucz kluczem publicznym MF (RSA-OAEP SHA-256)
     * - Przesyła zaszyfrowany klucz i IV przy otwieraniu sesji
     * - Klucz jest używany do szyfrowania faktur w sendInvoice()
     *
     * Sesja jest ważna przez 12 godzin.
     *
     * @param accessToken - Token dostępowy JWT
     * @param formCode - Kod formularza (domyślnie FA(3))
     * @see https://github.com/CIRFMF/ksef-docs/blob/main/sesja-interaktywna.md
     */
    async openOnlineSession(
        accessToken: string,
        formCode: { systemCode: string; schemaVersion: string; value: string } = {
            systemCode: "FA (3)",
            schemaVersion: "1-0E",
            value: "FA",
        }
    ): Promise<KsefSessionResponse> {
        this.encryptionData = this.cryptoService.getEncryptionData();

        const response = await this.http.post(
            "/v2/sessions/online",
            {
                formCode: {
                    systemCode: formCode.systemCode,
                    schemaVersion: formCode.schemaVersion,
                    value: formCode.value,
                },
                encryption: {
                    encryptedSymmetricKey: this.encryptionData.encryptedSymmetricKey,
                    initializationVector: this.encryptionData.initializationVector,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        this.sessionReferenceNumber = response.data.referenceNumber;

        return {
            referenceNumber: response.data.referenceNumber,
            validUntil: response.data.validUntil,
        };
    }

    /**
     * Zamyknij sesję interaktywną
     *
     * POST /sessions/online/{referenceNumber}/close
     *
     * @param accessToken - Token dostępowy JWT
     * @param referenceNumber - Numer referencyjny sesji (opcjonalny, użyje ostatniej)
     * @returns Odpowiedź z zbiorczym UPO lub undefined jeśli brak sesji
     */
    async closeOnlineSession(
        accessToken: string,
        referenceNumber?: string
    ): Promise<KsefSessionCloseResponse | undefined> {
        const refNum = referenceNumber || this.sessionReferenceNumber;
        if (!refNum) {
            return undefined;
        }

        const response = await this.http.post(
            `/v2/sessions/online/${refNum}/close`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        this.sessionReferenceNumber = undefined;
        this.encryptionData = undefined;

        return {
            referenceNumber: response.data.referenceNumber || refNum,
            timestamp: response.data.timestamp,
            upo: response.data.upo,
            numberOfInvoices: response.data.numberOfElements || response.data.numberOfInvoices || 0,
        };
    }

    /**
     * Wysyłanie fakturu do KSeF w sesji interaktywnej
     *
     * POST /sessions/online/{referenceNumber}/invoices
     *
     * Zgodnie z oficjalną dokumentacją KSeF 2.0:
     * 1. Faktura XML jest szyfrowana algorytmem AES-256-CBC z PKCS#7 padding
     * 2. Klucz szyfrowania pochodzi z openOnlineSession()
     * 3. Wysyłamy:
     *    - invoiceHash: hash SHA-256 i rozmiar ORYGINALNEJ faktury
     *    - encryptedDocumentHash: hash SHA-256 i rozmiar ZASZYFROWANEJ faktury
     *    - encryptedDocumentContent: zaszyfrowana faktura w Base64
     *
     * @param invoiceXml - XML faktury (zgodny ze schematem FA(3))
     * @param accessToken - Token dostępowy JWT
     * @param referenceNumber - Numer referencyjny sesji (opcjonalny)
     * @see https://github.com/CIRFMF/ksef-docs/blob/main/sesja-interaktywna.md
     */
    async sendInvoice(invoiceXml: string, accessToken: string, referenceNumber?: string): Promise<KsefInvoiceResponse> {
        const refNum = referenceNumber || this.sessionReferenceNumber;
        if (!refNum) {
            throw new Error("Brak aktywnej sesji. Najpierw wywołaj openOnlineSession.");
        }

        if (!this.encryptionData) {
            throw new Error("Brak danych szyfrowania. Najpierw wywołaj openOnlineSession.");
        }

        const invoiceBytes = Buffer.from(invoiceXml, "utf-8");
        const invoiceMetadata = this.cryptoService.getMetaData(invoiceBytes);
        const encryptedInvoice = this.cryptoService.encryptBytesWithAES256(
            invoiceBytes,
            this.encryptionData.cipherKey,
            this.encryptionData.cipherIv
        );

        // metadata
        const encryptedInvoiceMetadata = this.cryptoService.getMetaData(encryptedInvoice);

        const response = await this.http.post(
            `/v2/sessions/online/${refNum}/invoices`,
            {
                invoiceHash: invoiceMetadata.hashSHA,
                invoiceSize: invoiceMetadata.fileSize,
                encryptedInvoiceHash: encryptedInvoiceMetadata.hashSHA,
                encryptedInvoiceSize: encryptedInvoiceMetadata.fileSize,
                encryptedInvoiceContent: encryptedInvoice.toString("base64"),
                offlineMode: false,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // API 2.0 zwraca tylko referenceNumber
        return {
            elementReferenceNumber: response.data.referenceNumber,
            processingCode: response.data.processingCode,
            processingDescription: response.data.processingDescription,
            referenceNumber: response.data.referenceNumber,
            timestamp: response.data.timestamp,
        };
    }

    /**
     * Sprawdzanie statusu przetwarzenia faktury
     *
     * GET /v2/sessions/{sessionReferenceNumber}/invoices/{invoiceReferenceNumber}
     *
     * @param elementReferenceNumber - Numer referencyjny faktury
     * @param accessToken - Token dostępowy JWT
     * @param sessionReferenceNumber - Numer referencyjny sesji
     */
    async getInvoiceStatus(
        elementReferenceNumber: string,
        accessToken: string,
        sessionReferenceNumber?: string
    ): Promise<KsefInvoiceStatus> {
        const refNum = sessionReferenceNumber || this.sessionReferenceNumber;
        if (!refNum) {
            throw new Error("Brak aktywnej sesji.");
        }

        const response = await this.http.get(`/v2/sessions/${refNum}/invoices/${elementReferenceNumber}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return {
            processingCode: response.data.status?.code,
            processingDescription: response.data.status?.description,
            elementReferenceNumber: response.data.referenceNumber,
            ksefReferenceNumber: response.data.ksefNumber,
            acquisitionTimestamp: response.data.acquisitionDate,
            invoiceDetails: response.data,
        };
    }

    /**
     * Pobieranie UPO (Urzędowe Poświadczenie Odbioru) dla faktury
     *
     * GET /sessions/{referenceNumber}/invoices/{elementReferenceNumber}/upo
     *
     * @param elementReferenceNumber - Numer referencyjny faktury
     * @param accessToken - Token dostępowy JWT
     * @param sessionReferenceNumber - Numer referencyjny sesji
     */
    async getInvoiceUPO(
        elementReferenceNumber: string,
        accessToken: string,
        sessionReferenceNumber?: string
    ): Promise<KsefUPO> {
        const refNum = sessionReferenceNumber || this.sessionReferenceNumber;
        if (!refNum) {
            throw new Error("Brak aktywnej sesji.");
        }

        const response = await this.http.get(`/v2/sessions/${refNum}/invoices/${elementReferenceNumber}/upo`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return {
            ksefReferenceNumber: response.data.ksefReferenceNumber || elementReferenceNumber,
            upo: response.data.upo,
            timestamp: response.data.timestamp,
        };
    }

    /**
     * Sprawdzanie statusu sesji interaktywnej
     *
     * GET /sessions/{referenceNumber}
     *
     * @param accessToken - Token dostępowy JWT
     * @param referenceNumber - Numer referencyjny sesji
     */
    async getSessionStatus(
        accessToken: string,
        referenceNumber?: string
    ): Promise<{
        processingCode: number;
        processingDescription: string;
        numberOfInvoices: number;
        referenceNumber: string;
    }> {
        const refNum = referenceNumber || this.sessionReferenceNumber;
        if (!refNum) {
            throw new Error("Brak aktywnej sesji.");
        }

        const response = await this.http.get(`/v2/sessions/${refNum}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return {
            processingCode: response.data.processingCode,
            processingDescription: response.data.processingDescription,
            numberOfInvoices: response.data.numberOfElements || 0,
            referenceNumber: response.data.referenceNumber,
        };
    }

    getSessionReferenceNumber(): string | undefined {
        return this.sessionReferenceNumber;
    }

    setEncryptionData(data: EncryptionData): void {
        this.encryptionData = data;
    }

    getEncryptionData(): EncryptionData | undefined {
        return this.encryptionData;
    }

    getCryptographyService(): CryptographyService {
        return this.cryptoService;
    }
}
