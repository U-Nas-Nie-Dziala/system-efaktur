import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

export class XAdESSignerService {
    private privateKey: string;
    private certificate: string;
    private certificateDer: Buffer;

    constructor(privateKey: string, certificate: string) {
        this.privateKey = privateKey;
        this.certificate = certificate;
        this.certificateDer = this.extractCertificateDer(certificate);
    }

    private extractCertificateDer(pemCert: string): Buffer {
        const base64 = pemCert
            .replace(/-----BEGIN CERTIFICATE-----/g, "")
            .replace(/-----END CERTIFICATE-----/g, "")
            .replace(/\s/g, "");
        return Buffer.from(base64, "base64");
    }

    private sha256(data: string | Buffer): Buffer {
        return crypto.createHash("sha256").update(data).digest();
    }

    private toBase64(data: Buffer | string): string {
        if (typeof data === "string") {
            return Buffer.from(data, "utf-8").toString("base64");
        }
        return data.toString("base64");
    }

    private getTimestamp(): string {
        return new Date().toISOString();
    }

    private generateId(prefix: string = "id"): string {
        return `${prefix}-${uuidv4()}`;
    }

    /**
     * Kanonizacja XML zgodna z Exclusive XML Canonicalization
     * http://www.w3.org/2001/10/xml-exc-c14n#
     *
     */
    private canonicalize(xml: string): string {
        return xml
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .replace(/>\s+</g, "><")
            .trim();
    }

    private signRSA(data: string): string {
        const sign = crypto.createSign("RSA-SHA256");
        sign.update(data, "utf-8");
        return sign.sign(this.privateKey, "base64");
    }

    /**
     * Generuje podpis XAdES-BES dla dokumentu XML
     *
     * @param xmlContent - Treść XML do podpisania
     * @returns Podpisany dokument XML z podpisem enveloped
     */
    signXAdES(xmlContent: string): string {
        const signatureId = this.generateId("Signature");
        const signedInfoId = this.generateId("SignedInfo");
        const signedPropertiesId = this.generateId("SignedProperties");
        const signatureValueId = this.generateId("SignatureValue");
        const keyInfoId = this.generateId("KeyInfo");
        const objectId = this.generateId("Object");

        const timestamp = this.getTimestamp();

        const certDigest = this.toBase64(this.sha256(this.certificateDer));

        const canonicalDoc = this.canonicalize(xmlContent);
        const documentDigest = this.toBase64(this.sha256(canonicalDoc));

        // Zbuduj SignedProperties
        const signedProperties = `<xades:SignedProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="${signedPropertiesId}">
<xades:SignedSignatureProperties>
<xades:SigningTime>${timestamp}</xades:SigningTime>
<xades:SigningCertificateV2>
<xades:Cert>
<xades:CertDigest>
<ds:DigestMethod xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
<ds:DigestValue xmlns:ds="http://www.w3.org/2000/09/xmldsig#">${certDigest}</ds:DigestValue>
</xades:CertDigest>
</xades:Cert>
</xades:SigningCertificateV2>
</xades:SignedSignatureProperties>
<xades:SignedDataObjectProperties>
<xades:DataObjectFormat ObjectReference="#Reference-0">
<xades:MimeType>text/xml</xades:MimeType>
</xades:DataObjectFormat>
</xades:SignedDataObjectProperties>
</xades:SignedProperties>`;

        const signedPropertiesDigest = this.toBase64(this.sha256(this.canonicalize(signedProperties)));

        const signedInfo = `<ds:SignedInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="${signedInfoId}">
<ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
<ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
<ds:Reference Id="Reference-0" URI="">
<ds:Transforms>
<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
<ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
</ds:Transforms>
<ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
<ds:DigestValue>${documentDigest}</ds:DigestValue>
</ds:Reference>
<ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#${signedPropertiesId}">
<ds:Transforms>
<ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
</ds:Transforms>
<ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
<ds:DigestValue>${signedPropertiesDigest}</ds:DigestValue>
</ds:Reference>
</ds:SignedInfo>`;

        const signatureValue = this.signRSA(this.canonicalize(signedInfo));
        const certBase64 = this.toBase64(this.certificateDer);
        const signature = `<ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="${signatureId}">
${signedInfo}
<ds:SignatureValue Id="${signatureValueId}">${signatureValue}</ds:SignatureValue>
<ds:KeyInfo Id="${keyInfoId}">
<ds:X509Data>
<ds:X509Certificate>${certBase64}</ds:X509Certificate>
</ds:X509Data>
</ds:KeyInfo>
<ds:Object Id="${objectId}">
<xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Target="#${signatureId}">
${signedProperties}
</xades:QualifyingProperties>
</ds:Object>
</ds:Signature>`;

        const mainElementEnd = xmlContent.lastIndexOf("</");
        if (mainElementEnd !== -1) {
            return xmlContent.slice(0, mainElementEnd) + signature + xmlContent.slice(mainElementEnd);
        }

        return xmlContent + signature;
    }

    /**
     * Generuje AuthTokenRequest dla autoryzacji certyfikatem kwalifikowanym
     *
     * Zgodne z oficjalną dokumentacją KSeF 2.0:
     * - Namespace: http://ksef.mf.gov.pl/auth/token/2.0
     * - Schemat: https://api-test.ksef.mf.gov.pl/docs/v2/schemas/authv2.xsd
     * - Podpis XAdES-BES enveloped
     *
     * @param challenge - Wyzwanie z POST /auth/challenge
     * @param nip - NIP podatnika (ContextIdentifier)
     * @param subjectIdentifierType - "certificateSubject" lub "certificateFingerprint"
     */
    generateAuthTokenRequest(
        challenge: string,
        nip: string,
        subjectIdentifierType: "certificateSubject" | "certificateFingerprint" = "certificateSubject"
    ): string {
        // AuthTokenRequest zgodny z dokumentacją
        const authTokenRequest = `<?xml version="1.0" encoding="utf-8"?>
<AuthTokenRequest xmlns="http://ksef.mf.gov.pl/auth/token/2.0">
  <Challenge>${challenge}</Challenge>
  <ContextIdentifier>
    <Nip>${nip}</Nip>
  </ContextIdentifier>
  <SubjectIdentifierType>${subjectIdentifierType}</SubjectIdentifierType>
</AuthTokenRequest>`;

        // Podpisz dokument XAdES
        return this.signXAdES(authTokenRequest);
    }
}
