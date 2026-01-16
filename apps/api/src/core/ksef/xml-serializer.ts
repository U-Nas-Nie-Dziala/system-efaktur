/**
 * KSeF XML Serializer
 * Serializacja obiektów TypeScript do XML zgodnego ze schematem KSeF
 */

import "reflect-metadata";
import {
    XML_ROOT_KEY,
    XML_ELEMENT_KEY,
    XML_ATTRIBUTE_KEY,
    XML_ARRAY_KEY,
    XML_TEXT_KEY,
    XML_CHOICE_KEY,
    XML_NAMESPACE_KEY,
    XmlRootMetadata,
    XmlElementMetadata,
    XmlAttributeMetadata,
    XmlArrayMetadata,
    XmlTextMetadata,
    XmlChoiceMetadata,
    XmlNamespaceMetadata,
} from "./decorators";

export interface XmlSerializerOptions {
    indent?: boolean; // Formatowanie z wcięciami
    indentChars?: string; // Znaki wcięcia (domyślnie 2 spacje)
    xmlDeclaration?: boolean; // Deklaracja XML
    encoding?: string; // Kodowanie
    defaultNamespace?: string; // Domyślna przestrzeń nazw
}

interface ElementInfo {
    name: string;
    order: number;
    required: boolean;
    value: unknown;
    isArray: boolean;
    itemType?: () => new () => object;
    metadata: XmlElementMetadata | XmlArrayMetadata;
}

export class XmlSerializer {
    private options: Required<XmlSerializerOptions>;
    private namespaces: Map<string, string> = new Map();
    private declaredNamespaces: Set<string> = new Set();

    constructor(options: XmlSerializerOptions = {}) {
        this.options = {
            indent: options.indent ?? true,
            indentChars: options.indentChars ?? "  ",
            xmlDeclaration: options.xmlDeclaration ?? true,
            encoding: options.encoding ?? "UTF-8",
            defaultNamespace: options.defaultNamespace ?? "",
        };
    }

    // TODO: serialize method

    private getRootMetadata(obj: object): XmlRootMetadata | undefined {
        return Reflect.getMetadata(XML_ROOT_KEY, obj.constructor);
    }

    private getNamespaceMetadata(obj: object): XmlNamespaceMetadata[] | undefined {
        return Reflect.getMetadata(XML_NAMESPACE_KEY, obj.constructor);
    }

    private getAttributes(obj: object): Map<string, unknown> {
        const attributes = new Map<string, unknown>();
        const keys = Object.keys(obj);

        for (const key of keys) {
            const attrMetadata: XmlAttributeMetadata | undefined = Reflect.getMetadata(XML_ATTRIBUTE_KEY, obj, key);

            if (attrMetadata) {
                const value = (obj as Record<string, unknown>)[key];
                attributes.set(attrMetadata.name, value);
            }
        }

        return attributes;
    }

    private getChildElements(obj: object): ElementInfo[] {
        const elements: ElementInfo[] = [];

        // TODO: elementy

        return elements;
    }

    /**
     * Próbuje określić nazwę choice na podstawie wartości
     */
    private inferChoiceName(value: unknown, metadata: XmlChoiceMetadata): string | null {
        if (!metadata.choices || !value) return null;

        for (const choice of metadata.choices) {
            const choiceType = choice.type();
            if (value instanceof choiceType) {
                return choice.name;
            }
        }

        return metadata.choices[0]?.name || null;
    }

    private getTextValue(obj: object): unknown {
        const proto = Object.getPrototypeOf(obj);
        const keys = Object.keys(obj);

        for (const key of keys) {
            const textMetadata: XmlTextMetadata | undefined = Reflect.getMetadata(XML_TEXT_KEY, proto, key);

            if (textMetadata) {
                return (obj as Record<string, unknown>)[key];
            }
        }

        return undefined;
    }

    private isPrimitive(value: unknown): boolean {
        return (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean" ||
            typeof value === "bigint"
        );
    }

    private escapeXml(str: string): string {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    }
}

// TODO: może klasa deserializująca XML -> Klasy?
