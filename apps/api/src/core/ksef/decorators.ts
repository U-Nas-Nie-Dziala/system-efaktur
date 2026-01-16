/**
 * Dekoratory do mapowania klas TypeScript na XML
 */

import "reflect-metadata";

export const XML_ROOT_KEY = Symbol("xml:root");
export const XML_ELEMENT_KEY = Symbol("xml:element");
export const XML_ATTRIBUTE_KEY = Symbol("xml:attribute");
export const XML_ARRAY_KEY = Symbol("xml:array");
export const XML_TEXT_KEY = Symbol("xml:text");
export const XML_CHOICE_KEY = Symbol("xml:choice");
export const XML_CHOICE_GROUP_KEY = Symbol("xml:choiceGroup");
export const XML_NAMESPACE_KEY = Symbol("xml:namespace");

export interface XmlRootMetadata {
    name: string;
    namespace?: string;
}

export interface XmlElementMetadata {
    name: string;
    order: number;
    required?: boolean;
    namespace?: string;
    type?: () => new () => object;
}

export interface XmlAttributeMetadata {
    name: string;
    required?: boolean;
}

export interface XmlArrayMetadata {
    name: string;
    order: number;
    required?: boolean;
    itemType: () => new () => object;
    namespace?: string;
}

export interface XmlTextMetadata {
    order?: number;
}

export interface XmlChoiceMetadata {
    order: number;
    required?: boolean;
    choices: Array<{
        name: string;
        type: () => new () => object;
    }>;
}

export interface XmlChoiceGroupMetadata {
    // nazwa grupy do celów identyfikacji tagu XML
    name: string;

    // czy tag wymagany
    required?: boolean;

    // opcje do wyboru, schemat złożony, każda opcja to tablica nazw pól
    options: string[][];
}

export interface XmlNamespaceMetadata {
    prefix: string;
    uri: string;
}

/**
 * Oznacza klasę jako główny element XML
 */
export function XmlRoot(options: XmlRootMetadata): ClassDecorator {
    return (target: Function) => {
        Reflect.defineMetadata(XML_ROOT_KEY, options, target);
    };
}

/**
 * Oznacza pole klasy jako element XML
 */
export function XmlElement(options: XmlElementMetadata): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        Reflect.defineMetadata(XML_ELEMENT_KEY, options, target, propertyKey);
    };
}

/**
 * Oznacza pole klasy jako atrybut XML
 */
export function XmlAttribute(options: XmlAttributeMetadata): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        Reflect.defineMetadata(XML_ATTRIBUTE_KEY, options, target, propertyKey);
    };
}

/**
 * Oznacza pole klasy jako tablicę elementów XML
 */
export function XmlArray(options: XmlArrayMetadata): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        Reflect.defineMetadata(XML_ARRAY_KEY, options, target, propertyKey);
    };
}

/**
 * Oznacza pole klasy jako zawartość tekstową elementu XML
 */
export function XmlText(options: XmlTextMetadata = {}): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        Reflect.defineMetadata(XML_TEXT_KEY, options, target, propertyKey);
    };
}

/**
 * Oznacza pole klasy jako wybór xsd:choice
 */
export function XmlChoice(options: XmlChoiceMetadata): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        Reflect.defineMetadata(XML_CHOICE_KEY, options, target, propertyKey);
    };
}

/**
 * Oznacza grupę pól klasy jako choice xsd:choice
 */
export function XmlChoiceGroup(options: XmlChoiceGroupMetadata): ClassDecorator {
    return (target: Function) => {
        const existing: XmlChoiceGroupMetadata[] = Reflect.getMetadata(XML_CHOICE_GROUP_KEY, target) || [];
        existing.push(options);
        Reflect.defineMetadata(XML_CHOICE_GROUP_KEY, existing, target);
    };
}

/**
 * Definiuje namespace dla klasy
 */
export function XmlNamespace(options: XmlNamespaceMetadata): ClassDecorator {
    return (target: Function) => {
        const existing: XmlNamespaceMetadata[] = Reflect.getMetadata(XML_NAMESPACE_KEY, target) || [];
        existing.push(options);
        Reflect.defineMetadata(XML_NAMESPACE_KEY, existing, target);
    };
}

export function getXmlRootMetadata(target: Function): XmlRootMetadata | undefined {
    return Reflect.getMetadata(XML_ROOT_KEY, target);
}

export function getXmlElementMetadata(target: Object, propertyKey: string | symbol): XmlElementMetadata | undefined {
    return Reflect.getMetadata(XML_ELEMENT_KEY, target, propertyKey);
}

export function getXmlAttributeMetadata(
    target: Object,
    propertyKey: string | symbol
): XmlAttributeMetadata | undefined {
    return Reflect.getMetadata(XML_ATTRIBUTE_KEY, target, propertyKey);
}

export function getXmlArrayMetadata(target: Object, propertyKey: string | symbol): XmlArrayMetadata | undefined {
    return Reflect.getMetadata(XML_ARRAY_KEY, target, propertyKey);
}

export function getXmlTextMetadata(target: Object, propertyKey: string | symbol): XmlTextMetadata | undefined {
    return Reflect.getMetadata(XML_TEXT_KEY, target, propertyKey);
}

export function getXmlChoiceMetadata(target: Object, propertyKey: string | symbol): XmlChoiceMetadata | undefined {
    return Reflect.getMetadata(XML_CHOICE_KEY, target, propertyKey);
}

export function getXmlChoiceGroupMetadata(target: Function): XmlChoiceGroupMetadata[] | undefined {
    return Reflect.getMetadata(XML_CHOICE_GROUP_KEY, target);
}

export function getXmlNamespaceMetadata(target: Function): XmlNamespaceMetadata[] | undefined {
    return Reflect.getMetadata(XML_NAMESPACE_KEY, target);
}
