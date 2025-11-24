export interface Fa3Root {
    $: Fa3RootClass;
    "xsd:annotation": XSDAnnotation[];
    "xsd:complexType": Fa3RootXSDComplexType[];
}

export interface Fa3RootClass {
    name: string;
}

export interface XSDAnnotation {
    "xsd:documentation": string[];
}

export interface Fa3RootXSDComplexType {
    "xsd:sequence": PurpleXSDSequence[];
}

export interface PurpleXSDSequence {
    "xsd:element": PurpleXSDElement[];
}

export interface PurpleXSDElement {
    $: Purple;
    "xsd:annotation": XSDAnnotation[];
    "xsd:complexType"?: PurpleXSDComplexType[];
}

export interface Purple {
    name: string;
    type?: string;
    minOccurs?: string;
    maxOccurs?: string;
    fixed?: string;
}

export interface PurpleXSDComplexType {
    "xsd:sequence": FluffyXSDSequence[];
}

export interface FluffyXSDSequence {
    "xsd:element": StickyXSDElement[];
    "xsd:choice"?: PurpleXSDChoice[];
    "xsd:sequence"?: XSDSequence2[];
    $?: XSDSequence;
}

export interface XSDSequence {
    minOccurs: string;
}

export interface PurpleXSDChoice {
    "xsd:element": FluffyXSDElement[];
    "xsd:sequence"?: XSDComplexTypeXSDSequence[];
    $?: XSDSequence;
}

export interface FluffyXSDElement {
    $: Fluffy;
    "xsd:annotation": XSDAnnotation[];
    "xsd:complexType"?: FluffyXSDComplexType[];
}

export interface Fluffy {
    name: string;
    type?: string;
}

export interface FluffyXSDComplexType {
    "xsd:sequence": XSDComplexTypeXSDSequence[];
}

export interface XSDComplexTypeXSDSequence {
    "xsd:element": TentacledXSDElement[];
}

export interface TentacledXSDElement {
    $: Fluffy;
    "xsd:annotation"?: XSDAnnotation[];
}

export interface StickyXSDElement {
    $: Purple;
    "xsd:annotation": XSDAnnotation[];
    "xsd:complexType"?: TentacledXSDComplexType[];
    "xsd:simpleType"?: FluffyXSDSimpleType[];
}

export interface TentacledXSDComplexType {
    "xsd:complexContent"?: XSDContent[];
    "xsd:sequence"?: TentacledXSDSequence[];
    "xsd:choice"?: FluffyXSDChoice[];
}

export interface FluffyXSDChoice {
    "xsd:sequence": XSDComplexTypeXSDSequence[];
    "xsd:element": TentacledXSDElement[];
}

export interface XSDContent {
    "xsd:extension": XSDExtensionElement[];
}

export interface XSDExtensionElement {
    $: XSDExtension;
}

export interface XSDExtension {
    base: string;
}

export interface TentacledXSDSequence {
    $?: XSDSequence;
    "xsd:element": IndecentXSDElement[];
    "xsd:choice"?: TentacledXSDChoice[];
    "xsd:sequence"?: FriskyXSDSequence[];
}

export interface TentacledXSDChoice {
    $: XSDSequence;
    "xsd:element"?: TentacledXSDElement[];
    "xsd:sequence"?: StickyXSDSequence[];
}

export interface StickyXSDSequence {
    "xsd:element": IndigoXSDElement[];
}

export interface IndigoXSDElement {
    $: Purple;
    "xsd:annotation": XSDAnnotation[];
    "xsd:complexType"?: StickyXSDComplexType[];
}

export interface StickyXSDComplexType {
    "xsd:sequence": IndigoXSDSequence[];
}

export interface IndigoXSDSequence {
    "xsd:element": TentacledXSDElement[];
    "xsd:choice": StickyXSDChoice[];
}

export interface StickyXSDChoice {
    $: XSDSequence;
    "xsd:element": TentacledXSDElement[];
    "xsd:sequence": XSDComplexTypeXSDSequence[];
}

export interface IndecentXSDElement {
    $: Purple;
    "xsd:annotation"?: XSDAnnotation[];
    "xsd:complexType"?: IndigoXSDComplexType[];
    "xsd:simpleType"?: PurpleXSDSimpleType[];
}

export interface IndigoXSDComplexType {
    "xsd:choice"?: IndigoXSDChoice[];
    "xsd:sequence"?: CunningXSDSequence[];
}

export interface IndigoXSDChoice {
    "xsd:sequence": IndecentXSDSequence[];
    "xsd:element": TentacledXSDElement[];
}

export interface IndecentXSDSequence {
    "xsd:element": HilariousXSDElement[];
    "xsd:choice"?: XSDComplexTypeXSDSequence[];
}

export interface HilariousXSDElement {
    $: Purple;
    "xsd:annotation"?: XSDAnnotation[];
    "xsd:complexType"?: IndecentXSDComplexType[];
}

export interface IndecentXSDComplexType {
    "xsd:sequence": HilariousXSDSequence[];
}

export interface HilariousXSDSequence {
    "xsd:element": AmbitiousXSDElement[];
    "xsd:choice": IndecentXSDChoice[];
}

export interface IndecentXSDChoice {
    "xsd:sequence": AmbitiousXSDSequence[];
}

export interface AmbitiousXSDSequence {
    "xsd:element": AmbitiousXSDElement[];
    "xsd:choice"?: PurpleXSD[];
}

export interface PurpleXSD {
    $: XSDSequence;
    "xsd:element": AmbitiousXSDElement[];
}

export interface AmbitiousXSDElement {
    $: Purple;
    "xsd:annotation": XSDAnnotation[];
}

export interface CunningXSDSequence {
    "xsd:element": CunningXSDElement[];
    $?: XSDSequence;
    "xsd:choice"?: FluffyXSDChoice[];
    "xsd:sequence"?: MagentaXSDSequence[];
}

export interface CunningXSDElement {
    $: Purple;
    "xsd:annotation"?: XSDAnnotation[];
    "xsd:complexType"?: FluffyXSDComplexType[];
}

export interface MagentaXSDSequence {
    "xsd:choice"?: FluffyXSDChoice[];
    "xsd:element": AmbitiousXSDElement[];
    $?: XSDSequence;
}

export interface PurpleXSDSimpleType {
    "xsd:restriction": PurpleXSDRestriction[];
}

export interface PurpleXSDRestriction {
    $: XSDExtension;
    "xsd:pattern"?: XSDMaxLengthElement[];
    "xsd:maxLength"?: XSDMaxLengthElement[];
}

export interface XSDMaxLengthElement {
    $: XSDMaxLength;
}

export interface XSDMaxLength {
    value: string;
}

export interface FriskyXSDSequence {
    $: XSDSequence;
    "xsd:element": MagentaXSDElement[];
}

export interface MagentaXSDElement {
    $: Purple;
    "xsd:annotation": XSDAnnotation[];
    "xsd:complexType"?: HilariousXSDComplexType[];
}

export interface HilariousXSDComplexType {
    "xsd:sequence": MischievousXSDSequence[];
}

export interface MischievousXSDSequence {
    "xsd:element": FriskyXSDElement[];
}

export interface FriskyXSDElement {
    $: Purple;
    "xsd:annotation": XSDAnnotation[];
    "xsd:complexType"?: AmbitiousXSDComplexType[];
}

export interface AmbitiousXSDComplexType {
    "xsd:sequence": BraggadociousXSDSequence[];
}

export interface BraggadociousXSDSequence {
    "xsd:element": MischievousXSDElement[];
}

export interface MischievousXSDElement {
    $: Purple;
    "xsd:annotation"?: XSDAnnotation[];
    "xsd:complexType"?: CunningXSDComplexType[];
}

export interface CunningXSDComplexType {
    "xsd:sequence": XSDSequence1[];
    "xsd:attribute": XSDAttributeElement[];
}

export interface XSDAttributeElement {
    $: XSDAttribute;
    "xsd:simpleType": XSDAttributeXSDSimpleType[];
}

export interface XSDAttribute {
    name: string;
    use: string;
}

export interface XSDAttributeXSDSimpleType {
    "xsd:restriction": FluffyXSDRestriction[];
}

export interface FluffyXSDRestriction {
    $: XSDExtension;
    "xsd:enumeration": XSDMaxLengthElement[];
}

export interface XSDSequence1 {
    "xsd:element": BraggadociousXSDElement[];
}

export interface BraggadociousXSDElement {
    $: Fa3RootClass;
    "xsd:annotation": XSDAnnotation[];
    "xsd:complexType": MagentaXSDComplexType[];
}

export interface MagentaXSDComplexType {
    "xsd:simpleContent": XSDContent[];
}

export interface FluffyXSDSimpleType {
    "xsd:restriction": TentacledXSDRestriction[];
}

export interface TentacledXSDRestriction {
    $: XSDExtension;
    "xsd:maxLength"?: XSDMaxLengthElement[];
    "xsd:enumeration"?: XSDEnumeration[];
}

export interface XSDEnumeration {
    $: XSDMaxLength;
    "xsd:annotation": XSDAnnotation[];
}

export interface XSDSequence2 {
    $: XSDSequence;
    "xsd:annotation": XSDAnnotation[];
    "xsd:element": XSDElement1[];
    "xsd:sequence"?: PurpleXSD[];
}

export interface XSDElement1 {
    $: Purple;
    "xsd:annotation": XSDAnnotation[];
    "xsd:complexType"?: FriskyXSDComplexType[];
}

export interface FriskyXSDComplexType {
    "xsd:sequence": XSDSequence3[];
}

export interface XSDSequence3 {
    "xsd:element": XSDElement2[];
    "xsd:choice"?: FluffyXSDChoice[];
}

export interface XSDElement2 {
    $: Purple;
    "xsd:annotation": XSDAnnotation[];
    "xsd:simpleType"?: TentacledXSDSimpleType[];
}

export interface TentacledXSDSimpleType {
    "xsd:restriction": StickyXSDRestriction[];
}

export interface StickyXSDRestriction {
    $: XSDExtension;
    "xsd:maxLength": XSDMaxLengthElement[];
}
