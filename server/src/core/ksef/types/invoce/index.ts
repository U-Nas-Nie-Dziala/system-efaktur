import { UECountryCodeType } from "./CountryCode";
import { CurrencyCodeType } from "./CurrencyCode";

export interface FA3Root {
    DocumentHeader: DocumentHeader;
    Seller: Party;
    Buyer: Party;
    InvoiceLines: InvoiceLine[];
    Taxes?: TaxSummary[];
    Totals: Totals;
    Notes?: string;
    KSEF?: KsefMeta;
}

export interface DocumentHeader {
    FormType?: string | "FA3";
    DocumentNumber: string;
    IssueDate: string; // ISO YYYY-MM-DD
    Currency: CurrencyCodeType;
    Language?: string;
    InvoiceKind?: string; // np. faktura, korekta
}

export interface Party {
    Name: string;
    TaxId?: string;
    Regon?: string;
    Country?: UECountryCodeType | string;
    Address?: Address;
    Contact?: Contact;
    BankAccount?: string;
}

export interface Address {
    Street?: string;
    BuildingNumber?: string;
    ApartmentNumber?: string;
    PostalCode?: string;
    City?: string;
    Region?: string;
    CountryCode: UECountryCodeType | string;
}

export interface Contact {
    Email?: string;
    Phone?: string;
    Fax?: string;
}

export interface InvoiceLine {
    LineNumber?: number;
    ProductCode?: string;
    Description: string;
    Quantity?: number;
    Unit?: string;
    UnitPrice?: number;
    NetAmount?: number; // Quantity * UnitPrice
    TaxRate?: number; // procent, np. 23 -> jako 23%
    TaxAmount?: number;
    GrossAmount?: number;
    DiscountAmount?: number;
    AdditionalInfo?: string;
}

export interface TaxSummary {
    TaxRate: number;
    NetAmount: number;
    TaxAmount: number;
    GrossAmount: number;
    TaxCategoryCode?: string; // np. "A", "B" lub zgodne z XSD
}

export interface Totals {
    TotalNet: number;
    TotalTax: number;
    TotalGross: number;
    RoundingAmount?: number;
    PrepaidAmount?: number;
    DueAmount?: number;
}

export interface KsefMeta {
    SchemaVersion?: string;
    FormCode?: string;
    ExternalId?: string;
    SignatureId: string;
}
