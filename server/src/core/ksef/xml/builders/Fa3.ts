// ! UWAGA ! PLIK PORZUCONY - NIE UŻYWAĆ - MA POZOSTAĆ DLA CELÓW HISTORYCZNYCH JAKO ARTEFAKT
// ! UWAGA ! PLIK PORZUCONY - NIE UŻYWAĆ - MA POZOSTAĆ DLA CELÓW HISTORYCZNYCH JAKO ARTEFAKT
// ! UWAGA ! PLIK PORZUCONY - NIE UŻYWAĆ - MA POZOSTAĆ DLA CELÓW HISTORYCZNYCH JAKO ARTEFAKT

// import {
//     Adnotacje,
//     Adres,
//     AdresKoresp,
//     AdresL1,
//     AdresL2,
//     DaneIdentyfikacyjne,
//     DaneIdentyfikacyjne2,
//     DaneKontaktowe,
//     DaneKontaktowePU,
//     Email,
//     EmailPU,
//     Fa,
//     GLN,
//     GV,
//     IDaneIdentyfikacyjne,
//     IFaktura,
//     INaglowek,
//     IPodmiot1,
//     IPodmiot2,
//     JST,
//     KodFormularza,
//     KodKraju,
//     KodWaluty,
//     KursWalutyZ,
//     Naglowek,
//     Nazwa,
//     NIP,
//     OkresFa,
//     OpisRoli,
//     PMarzy,
//     Podmiot1,
//     Podmiot2,
//     Podmiot3,
//     PodmiotUpowazniony,
//     Rola,
//     RolaInna,
//     RolaPU,
//     Telefon,
//     TelefonPU,
//     WZ,
//     Zwolnienie,
// } from "../data";
// import {
//     NewAdnotacjeFaType,
//     NewAdresKorespType,
//     NewAdresL1Type,
//     NewAdresL2Type,
//     NewAdresType,
//     NewDaneIdentyfikacyjne2Type,
//     NewDaneIdentyfikacyjneType,
//     NewDaneKontaktowePUType,
//     NewDaneKontaktoweType,
//     NewDataWykonaniaFaType,
//     NewDataWystawieniaFaType,
//     NewEmailPuType,
//     NewEmailType,
//     NewGLNType,
//     NewGVType,
//     NewJSTType,
//     NewKodKrajuType,
//     NewKodWaluty,
//     NewMiejsceWystawieniaFaType,
//     NewNazwaType,
//     NewNipType,
//     NewNumerFaType,
//     NewOkresFaType,
//     NewOpisRoli,
//     NewPMarzyType,
//     NewPodsumowanieStawekDataType,
//     NewPodsumowanieStawekVat0DataType,
//     NewPodsumowanieStawekVat0Type,
//     NewPodsumowanieStawekVat23Type,
//     NewPodsumowanieStawekVat4DataType,
//     NewPodsumowanieStawekVat4Type,
//     NewPodsumowanieStawekVat5DataType,
//     NewPodsumowanieStawekVat5Type,
//     NewPodsumowanieStawekVat8DataType,
//     NewPodsumowanieStawekVat8Type,
//     NewPodsumowanieStawekVatPozostaleDataType,
//     NewPodsumowanieStawekVatPozostaleType,
//     NewPodsumowanieStawekVatProceduraSzczegolnaDataType,
//     NewPodsumowanieStawekVatProceduraSzczegolnaType,
//     NewRolaInna,
//     NewRolaType,
//     NewTelefonPuType,
//     NewTelefonType,
//     NewWzFaType,
//     NewZwolnienieFaType,
//     SetFaType,
//     SetNaglowekType,
//     SetPodmiot1Type,
//     SetPodmiot2Type,
//     SetPodmiot3Type,
//     SetPodmiotUpowaznionyType,
// } from "./types";

// export class Fa3RootBuilder {
//     private naglowek: Naglowek;
//     private podmiot1: Podmiot1;
//     private podmiot2: Podmiot2;
//     private podmiot3?: Podmiot3;
//     private podmiotUpowazniony?: PodmiotUpowazniony;
//     private fa: Fa;

//     constructor(params?: IFaktura) {}

//     public newKodFormularza(): KodFormularza {
//         return new KodFormularza();
//     }

//     public setNaglowek({ kodFormularza, wariantFormularza, dataWytworzeniaFa, systemInfo }: SetNaglowekType): void {
//         this.naglowek = new Naglowek(kodFormularza, wariantFormularza, dataWytworzeniaFa, systemInfo);
//     }

//     public newNip(props: NewNipType): NIP {
//         return new NIP(props.nip);
//     }

//     public newNazwa(props: NewNazwaType): Nazwa {
//         return new Nazwa(props.nazwa);
//     }

//     public newDaneIdentyfikacyjne(props: NewDaneIdentyfikacyjneType): DaneIdentyfikacyjne {
//         return new DaneIdentyfikacyjne(props.NIP, props.Nazwa);
//     }

//     public newKodKraju(props: NewKodKrajuType): KodKraju {
//         return new KodKraju(props.kod);
//     }

//     public newAdresL1(props: NewAdresL1Type): AdresL1 {
//         return new AdresL1(props.adres);
//     }

//     public newAdresL2(props: NewAdresL2Type): AdresL2 {
//         return new AdresL2(props.adres);
//     }

//     public newGLN(props: NewGLNType): GLN {
//         return new GLN(props.gln);
//     }

//     public newAdres(props: NewAdresType): Adres {
//         const { kodKraju, adresL1, adresL2, gln } = props;
//         return new Adres(kodKraju, adresL1, adresL2, gln);
//     }

//     public newAdresKoresp(props: NewAdresKorespType): AdresKoresp {
//         const { kodKraju, adresL1, adresL2, gln } = props;
//         return new AdresKoresp(kodKraju, adresL1, adresL2, gln);
//     }

//     public newTelefon(props: NewTelefonType): Telefon {
//         return new Telefon(props.telefon);
//     }

//     public newEmail(props: NewEmailType): Email {
//         return new Email(props.email);
//     }

//     public newDaneKontaktowe(props: NewDaneKontaktoweType): DaneKontaktowe {
//         return new DaneKontaktowe(props.email, props.telefon);
//     }

//     public setPodmiot1(props: SetPodmiot1Type): void {
//         this.podmiot1 = new Podmiot1(
//             props.prefiksPodatnika,
//             props.nrEORI,
//             props.daneIdentyfikacyjne,
//             props.adres,
//             props.adresKoresp,
//             props.daneKontaktowe,
//             props.statusInfoPodatnika
//         );
//     }

//     public newDaneIdentyfikacyjne2(props: NewDaneIdentyfikacyjne2Type): DaneIdentyfikacyjne2 {
//         return new DaneIdentyfikacyjne2(
//             props.nip,
//             props.nazwa,
//             props.kodUE,
//             props.nrVatUE,
//             props.kodKraju,
//             props.nrID,
//             props.brakID
//         );
//     }

//     public newJST(props: NewJSTType): JST {
//         return new JST(props.value);
//     }

//     public newGV(props: NewGVType): GV {
//         return new GV(props.value);
//     }

//     public setPodmiot2(props: SetPodmiot2Type): void {
//         this.podmiot2 = new Podmiot2(
//             props.nrEORI,
//             props.daneIdentyfikacyjne,
//             props.adres,
//             props.adresKoresp,
//             props.daneKontaktowe,
//             props.nrKlienta,
//             props.idNabywcy,
//             props.jst,
//             props.gv
//         );
//     }

//     public newRola(props: NewRolaType): Rola {
//         return new Rola(props.value);
//     }

//     public newRolaInna(props: NewRolaInna): RolaInna {
//         return new RolaInna(props.value);
//     }

//     public newOpisRoli(props: NewOpisRoli): OpisRoli {
//         return new OpisRoli(props.value);
//     }

//     public setPodmiot3(props: SetPodmiot3Type): void {
//         this.podmiot3 = new Podmiot3(
//             props.idNabywcy,
//             props.nrEORI,
//             props.daneIdentyfikacyjne,
//             props.adres,
//             props.adresKoresp,
//             props.daneKontaktowe,
//             props.rola,
//             props.rolaInna,
//             props.opisRoli,
//             props.udzial,
//             props.nrKlienta
//         );
//     }

//     public newEmailPU(props: NewEmailPuType): EmailPU {
//         return new EmailPU(props.Value);
//     }

//     public newTelefonPU(props: NewTelefonPuType): TelefonPU {
//         return new TelefonPU(props.Value);
//     }

//     public newDaneKontaktowePU(props: NewDaneKontaktowePUType): DaneKontaktowePU {
//         return new DaneKontaktowePU(props.emailPU, props.telefonPU);
//     }

//     public newRolaPU(props: NewRolaType): RolaPU {
//         return new RolaPU(props.value);
//     }

//     public setPodmiotUpowazniony(props: SetPodmiotUpowaznionyType): void {
//         this.podmiotUpowazniony = new PodmiotUpowazniony(
//             props.nrEORI,
//             props.daneIdentyfikacyjne,
//             props.adres,
//             props.adresKoresp,
//             props.daneKontaktowe,
//             props.rolaPU
//         );
//     }

//     public newKodWaluty(props: NewKodWaluty): KodWaluty {
//         return new KodWaluty(props.Value);
//     }

//     public newDataWystawieniaFa(props: NewDataWystawieniaFaType): string {
//         return props.Value;
//     }

//     public newMiejsceWystawieniaFa(props: NewMiejsceWystawieniaFaType): string {
//         return props.Value;
//     }

//     public newNumerFa(props: NewNumerFaType): string {
//         return props.Value;
//     }

//     public newWzFa(props: NewWzFaType[]): WZ[] {
//         return props.map((wz) => new WZ(wz.Value));
//     }

//     public newDataWykonaniaFa(props: NewDataWykonaniaFaType): string {
//         return props.Value;
//     }

//     public newOkresFa(props: NewOkresFaType): OkresFa {
//         return new OkresFa(props.Od, props.Do);
//     }

//     public newPodsumowanieStawekVat23(props: NewPodsumowanieStawekVat23Type): NewPodsumowanieStawekDataType {
//         return {
//             P_13_1: props.wartoscNetto,
//             P_14_1: props.wartoscVat,
//             P_14_1W: props.podatekPrzeliczonyNaPLN,
//         };
//     }

//     public newPodsumowanieStawekVat8(props: NewPodsumowanieStawekVat8Type): NewPodsumowanieStawekVat8DataType {
//         return {
//             P_13_2: props.wartoscNetto,
//             P_14_2: props.wartoscVat,
//             P_14_2W: props.podatekPrzeliczonyNaPLN,
//         };
//     }

//     public newPodsumowanieStawekVat5(props: NewPodsumowanieStawekVat5Type): NewPodsumowanieStawekVat5DataType {
//         return {
//             P_13_3: props.wartoscNetto,
//             P_14_3: props.wartoscVat,
//             P_14_3W: props.podatekPrzeliczonyNaPLN,
//         };
//     }

//     public newPodsumowanieStawekVat4(props: NewPodsumowanieStawekVat4Type): NewPodsumowanieStawekVat4DataType {
//         return {
//             P_13_4: props.wartoscNetto,
//             P_14_4: props.wartoscVat,
//             P_14_4W: props.podatekPrzeliczonyNaPLN,
//         };
//     }

//     public newPodsumowanieStawekVatProceduraSzczegolna(
//         props: NewPodsumowanieStawekVatProceduraSzczegolnaType
//     ): NewPodsumowanieStawekVatProceduraSzczegolnaDataType {
//         return {
//             P_13_5: props.wartoscNetto,
//             P_14_5: props.wartoscVat,
//         };
//     }

//     public newPodsumowanieStawekVat0(props: NewPodsumowanieStawekVat0Type): NewPodsumowanieStawekVat0DataType {
//         return {
//             P_13_6_1: props.sumaWartosci0krajowa,
//             P_13_6_2: props.sumaWartosci0WDT,
//             P_13_6_3: props.sumaWartosci0export,
//         };
//     }

//     public newPodsumowanieStawekVatPozostale(
//         props: NewPodsumowanieStawekVatPozostaleType
//     ): NewPodsumowanieStawekVatPozostaleDataType {
//         return {
//             P_13_7: props.sumaWartosciSprzedazyZwolnionej,
//             P_13_8: props.sumaWartosciPozaRP,
//             P_13_9: props.sumaWartosciObjetychWNT,
//             P_13_10: props.sumaWartosciOdwrotneObciazenie,
//             P_13_11: props.sumaWartosciProceduraMarzy,
//         };
//     }

//     // pole P_15 = Suma wszystkich P_13_X + Suma wszystkich P_14_X
//     public newKwotaNaleznosciOgolem(value: number): number {
//         return value;
//     }

//     public newKursWalutyZ(Value: number): KursWalutyZ {
//         return new KursWalutyZ(Value);
//     }

//     public newZwolnienie(props: NewZwolnienieFaType): Zwolnienie {
//         return new Zwolnienie(props.P_19, props.P_19A, props.P_19B, props.P_19C, props.P_19N);
//     }

//     public newPMarzy(props: NewPMarzyType): PMarzy {
//         return new PMarzy(props.znacznik, props.P_19A, props.P_19B, props.P_19C, props.P_19N);
//     }

//     public newAdnotacjeFa(props: NewAdnotacjeFaType): Adnotacje {
//         return new Adnotacje(
//             props.metodaKasowa,
//             props.samofakturowanie,
//             props.odwrotneObciazenie,
//             props.mechanizmPodzielonejPlatnosci,
//             props.dostawaTowarowUslugZwolnionych,
//             props.zwolnienie,
//             props.dostawaTowarowUslugZwolnionych
//         );
//     }

//     public setFa(props: SetFaType): void {
//         this.fa = new Fa(
//             props.kodWaluty,
//             props.dataWystawieniaFa,
//             props.miejsceWystawieniaFa,
//             props.numerFa,
//             props.wzFa,
//             props.dataWykonaniaFa,
//             props.okresFa,
//             props.podsumowanieStawekVat23?.P_13_1,
//             props.podsumowanieStawekVat23?.P_14_1,
//             props.podsumowanieStawekVat23?.P_14_1W,
//             props.podsumowanieStawekVat8?.P_13_2,
//             props.podsumowanieStawekVat8?.P_14_2,
//             props.podsumowanieStawekVat8?.P_14_2W,
//             props.podsumowanieStawekVat5?.P_13_3,
//             props.podsumowanieStawekVat5?.P_14_3,
//             props.podsumowanieStawekVat5?.P_14_3W,
//             props.podsumowanieStawekVat4?.P_13_4,
//             props.podsumowanieStawekVat4?.P_14_4,
//             props.podsumowanieStawekVat4?.P_14_4W,
//             props.podsumowanieStawekVatProceduraSzczegolna?.P_13_5,
//             props.podsumowanieStawekVatProceduraSzczegolna?.P_14_5,
//             props.podsumowanieStawekVat0?.P_13_6_1,
//             props.podsumowanieStawekVat0?.P_13_6_2,
//             props.podsumowanieStawekVat0?.P_13_6_3,
//             props.podsumowanieStawekVatPozostale?.P_13_7,
//             props.podsumowanieStawekVatPozostale?.P_13_8,
//             props.podsumowanieStawekVatPozostale?.P_13_9,
//             props.podsumowanieStawekVatPozostale?.P_13_10,
//             props.podsumowanieStawekVatPozostale?.P_13_11,
//             props.kwotaNaleznosciOgolem,
//             props.kursWalutyZ
//         );
//     }
// }

// const test = new Fa3RootBuilder();

// test.setNaglowek({
//     dataWytworzeniaFa: "2024-12-09T10:42:34",
//     kodFormularza: test.newKodFormularza(),
//     wariantFormularza: "3",
//     systemInfo: "System Info",
// });

// test.setPodmiot1({
//     nrEORI: "EORI123456",
//     daneIdentyfikacyjne: test.newDaneIdentyfikacyjne({
//         NIP: test.newNip({ nip: "1234567890" }),
//         Nazwa: test.newNazwa({ nazwa: "Test Company" }),
//     }),
//     adres: test.newAdres({
//         kodKraju: test.newKodKraju({ kod: "PL" }),
//         adresL1: test.newAdresL1({ adres: "ul. Przykładowa 1" }),
//     }),
// });

// test.setPodmiot2({
//     daneIdentyfikacyjne: test.newDaneIdentyfikacyjne2({
//         nazwa: test.newNazwa({ nazwa: "Another Company" }),
//         nip: test.newNip({ nip: "0987654321" }),
//     }),
//     adres: test.newAdres({
//         kodKraju: test.newKodKraju({ kod: "DE" }),
//         adresL1: test.newAdresL1({ adres: "Musterstrasse 5" }),
//     }),
//     jst: test.newJST({ value: 2 }),
//     gv: test.newGV({ value: 2 }),
// });

// test.setNaglowek({
//     DataWytworzeniaFa: "2024-01-01T12:00:00",
//     SystemInfo: "Test system",
// });
// test.setPodmiot1({
//     DaneIdentyfikacyjne: {
//         NIP: { Value: "1234567890" },
//         Nazwa: { Value: "Test Company" },
//     },
//     Adres: {
//         KodKraju: { Value: "PL" },
//         AdresL1: { Value: "ul. Testowa 1" },
//     },
// });
