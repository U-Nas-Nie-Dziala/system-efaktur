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

    serialize(obj: object): string {
        this.namespaces.clear();
        this.declaredNamespaces.clear();

        const rootMetadata = this.getRootMetadata(obj);
        const namespaceMetadata = this.getNamespaceMetadata(obj);

        if (namespaceMetadata) {
            for (const ns of namespaceMetadata) {
                this.namespaces.set(ns.prefix, ns.uri);
            }
        }

        let xml = "";

        if (this.options.xmlDeclaration) {
            xml += `<?xml version="1.0" encoding="${this.options.encoding}"?>\n`;
        }

        const rootName = rootMetadata?.name || obj.constructor.name;
        xml += this.serializeElement(rootName, obj, 0, true);

        return xml;
    }

    private serializeElement(name: string, value: unknown, depth: number, isRoot: boolean = false): string {
        if (value === null || value === undefined) {
            return "";
        }

        const indent = this.options.indent ? this.options.indentChars.repeat(depth) : "";
        const newline = this.options.indent ? "\n" : "";

        if (this.isPrimitive(value)) {
            const escapedValue = this.escapeXml(String(value));
            return `${indent}<${name}>${escapedValue}</${name}>${newline}`;
        }

        // Obiekt
        if (typeof value === "object") {
            let elementXml = `${indent}<${name}`;

            if (isRoot) {
                elementXml += this.serializeRootNamespaces();
            }

            const attributes = this.getAttributes(value as object);
            for (const [attrName, attrValue] of attributes) {
                if (attrValue !== undefined && attrValue !== null) {
                    elementXml += ` ${attrName}="${this.escapeXml(String(attrValue))}"`;
                }
            }

            const children = this.getChildElements(value as object);

            const textValue = this.getTextValue(value as object);

            if (children.length === 0 && !textValue) {
                if ((value as Record<string, unknown>).value !== undefined) {
                    const innerValue = (value as Record<string, unknown>).value;
                    elementXml += `>${this.escapeXml(String(innerValue))}</${name}>${newline}`;
                } else {
                    elementXml += `/>${newline}`;
                }
            } else if (textValue !== undefined && textValue !== null) {
                elementXml += `>${this.escapeXml(String(textValue))}</${name}>${newline}`;
            } else {
                elementXml += `>${newline}`;

                children.sort((a, b) => a.order - b.order);

                for (const child of children) {
                    if (child.value === undefined || child.value === null) {
                        continue;
                    }

                    if (child.isArray && Array.isArray(child.value)) {
                        for (const item of child.value) {
                            if (this.isPrimitive(item)) {
                                elementXml += this.serializeElement(child.name, item, depth + 1);
                            } else {
                                elementXml += this.serializeElement(child.name, item, depth + 1);
                            }
                        }
                    } else {
                        elementXml += this.serializeElement(child.name, child.value, depth + 1);
                    }
                }

                elementXml += `${indent}</${name}>${newline}`;
            }

            return elementXml;
        }

        return "";
    }

    private serializeRootNamespaces(): string {
        let nsAttrs = "";

        for (const [prefix, uri] of this.namespaces) {
            if (prefix === "") {
                nsAttrs += ` xmlns="${uri}"`;
            } else {
                nsAttrs += ` xmlns:${prefix}="${uri}"`;
            }
            this.declaredNamespaces.add(prefix);
        }

        return nsAttrs;
    }

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
        const proto = Object.getPrototypeOf(obj);

        // wszystkie zdefiniowane właściwości (z prototypu i instancji)
        const allKeys = new Set([
            ...Object.keys(obj),
            ...Object.getOwnPropertyNames(proto).filter((k) => k !== "constructor"),
        ]);

        for (const key of allKeys) {
            const elementMetadata: XmlElementMetadata | undefined = Reflect.getMetadata(XML_ELEMENT_KEY, proto, key);
            const arrayMetadata: XmlArrayMetadata | undefined = Reflect.getMetadata(XML_ARRAY_KEY, proto, key);
            const choiceMetadata: XmlChoiceMetadata | undefined = Reflect.getMetadata(XML_CHOICE_KEY, proto, key);

            const value = (obj as Record<string, unknown>)[key];

            if (elementMetadata) {
                elements.push({
                    name: elementMetadata.name,
                    order: elementMetadata.order,
                    required: elementMetadata.required || false,
                    value: value,
                    isArray: false,
                    metadata: elementMetadata,
                });
            } else if (arrayMetadata) {
                elements.push({
                    name: arrayMetadata.name,
                    order: arrayMetadata.order,
                    required: arrayMetadata.required || false,
                    value: value,
                    isArray: true,
                    itemType: arrayMetadata.itemType,
                    metadata: arrayMetadata,
                });
            } else if (choiceMetadata) {
                // Obsługa choice
                if (value && typeof value === "object" && "type" in value && "value" in value) {
                    const choiceValue = value as { type: string; value: unknown };
                    elements.push({
                        name: choiceValue.type,
                        order: choiceMetadata.order,
                        required: choiceMetadata.required || false,
                        value: choiceValue.value,
                        isArray: false,
                        metadata: {
                            name: choiceValue.type,
                            order: choiceMetadata.order,
                        } as XmlElementMetadata,
                    });
                } else if (value !== undefined && value !== null) {
                    // wartość choice
                    const choiceName = this.inferChoiceName(value, choiceMetadata);
                    if (choiceName) {
                        elements.push({
                            name: choiceName,
                            order: choiceMetadata.order,
                            required: choiceMetadata.required || false,
                            value: value,
                            isArray: false,
                            metadata: {
                                name: choiceName,
                                order: choiceMetadata.order,
                            } as XmlElementMetadata,
                        });
                    }
                }
            }
        }

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
