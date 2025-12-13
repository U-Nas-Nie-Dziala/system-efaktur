import {
    Adres,
    AdresKoresp,
    AdresL1,
    AdresL2,
    DaneIdentyfikacyjne,
    DaneIdentyfikacyjne2,
    DaneKontaktowe,
    DaneKontaktowePU,
    Email,
    EmailPU,
    Fa,
    GLN,
    GV,
    IDaneIdentyfikacyjne,
    IFaktura,
    INaglowek,
    IPodmiot1,
    IPodmiot2,
    JST,
    KodFormularza,
    KodKraju,
    Naglowek,
    Nazwa,
    NIP,
    OpisRoli,
    Podmiot1,
    Podmiot2,
    Podmiot3,
    PodmiotUpowazniony,
    Rola,
    RolaInna,
    RolaPU,
    Telefon,
    TelefonPU,
} from "../data";
import {
    NewAdresKorespType,
    NewAdresL1Type,
    NewAdresL2Type,
    NewAdresType,
    NewDaneIdentyfikacyjne2Type,
    NewDaneIdentyfikacyjneType,
    NewDaneKontaktowePUType,
    NewDaneKontaktoweType,
    NewEmailPuType,
    NewEmailType,
    NewGLNType,
    NewGVType,
    NewJSTType,
    NewKodKrajuType,
    NewNazwaType,
    NewNipType,
    NewOpisRoli,
    NewRolaInna,
    NewRolaType,
    NewTelefonPuType,
    NewTelefonType,
    SetNaglowekType,
    SetPodmiot1Type,
    SetPodmiot2Type,
    SetPodmiot3Type,
    SetPodmiotUpowaznionyType,
} from "./types";

export class Fa3RootBuilder {
    private naglowek: Naglowek;
    private podmiot1: Podmiot1;
    private podmiot2: Podmiot2;
    private podmiot3?: Podmiot3;
    private podmiotUpowazniony?: PodmiotUpowazniony;
    private fa: Fa;

    constructor(params?: IFaktura) {}

    public newKodFormularza(): KodFormularza {
        return new KodFormularza();
    }

    public setNaglowek({ kodFormularza, wariantFormularza, dataWytworzeniaFa, systemInfo }: SetNaglowekType): void {
        this.naglowek = new Naglowek(kodFormularza, wariantFormularza, dataWytworzeniaFa, systemInfo);
    }

    public newNip(props: NewNipType): NIP {
        return new NIP(props.nip);
    }

    public newNazwa(props: NewNazwaType): Nazwa {
        return new Nazwa(props.nazwa);
    }

    public newDaneIdentyfikacyjne(props: NewDaneIdentyfikacyjneType): DaneIdentyfikacyjne {
        return new DaneIdentyfikacyjne(props.NIP, props.Nazwa);
    }

    public newKodKraju(props: NewKodKrajuType): KodKraju {
        return new KodKraju(props.kod);
    }

    public newAdresL1(props: NewAdresL1Type): AdresL1 {
        return new AdresL1(props.adres);
    }

    public newAdresL2(props: NewAdresL2Type): AdresL2 {
        return new AdresL2(props.adres);
    }

    public newGLN(props: NewGLNType): GLN {
        return new GLN(props.gln);
    }

    public newAdres(props: NewAdresType): Adres {
        const { kodKraju, adresL1, adresL2, gln } = props;
        return new Adres(kodKraju, adresL1, adresL2, gln);
    }

    public newAdresKoresp(props: NewAdresKorespType): AdresKoresp {
        const { kodKraju, adresL1, adresL2, gln } = props;
        return new AdresKoresp(kodKraju, adresL1, adresL2, gln);
    }

    public newTelefon(props: NewTelefonType): Telefon {
        return new Telefon(props.telefon);
    }

    public newEmail(props: NewEmailType): Email {
        return new Email(props.email);
    }

    public newDaneKontaktowe(props: NewDaneKontaktoweType): DaneKontaktowe {
        return new DaneKontaktowe(props.email, props.telefon);
    }

    public setPodmiot1(props: SetPodmiot1Type): void {
        this.podmiot1 = new Podmiot1(
            props.prefiksPodatnika,
            props.nrEORI,
            props.daneIdentyfikacyjne,
            props.adres,
            props.adresKoresp,
            props.daneKontaktowe,
            props.statusInfoPodatnika
        );
    }

    public newDaneIdentyfikacyjne2(props: NewDaneIdentyfikacyjne2Type): DaneIdentyfikacyjne2 {
        return new DaneIdentyfikacyjne2(
            props.nip,
            props.nazwa,
            props.kodUE,
            props.nrVatUE,
            props.kodKraju,
            props.nrID,
            props.brakID
        );
    }

    public newJST(props: NewJSTType): JST {
        return new JST(props.value);
    }

    public newGV(props: NewGVType): GV {
        return new GV(props.value);
    }

    public setPodmiot2(props: SetPodmiot2Type): void {
        this.podmiot2 = new Podmiot2(
            props.nrEORI,
            props.daneIdentyfikacyjne,
            props.adres,
            props.adresKoresp,
            props.daneKontaktowe,
            props.nrKlienta,
            props.idNabywcy,
            props.jst,
            props.gv
        );
    }

    public newRola(props: NewRolaType): Rola {
        return new Rola(props.value);
    }

    public newRolaInna(props: NewRolaInna): RolaInna {
        return new RolaInna(props.value);
    }

    public newOpisRoli(props: NewOpisRoli): OpisRoli {
        return new OpisRoli(props.value);
    }

    public setPodmiot3(props: SetPodmiot3Type): void {
        this.podmiot3 = new Podmiot3(
            props.idNabywcy,
            props.nrEORI,
            props.daneIdentyfikacyjne,
            props.adres,
            props.adresKoresp,
            props.daneKontaktowe,
            props.rola,
            props.rolaInna,
            props.opisRoli,
            props.udzial,
            props.nrKlienta
        );
    }

    public newEmailPU(props: NewEmailPuType): EmailPU {
        return new EmailPU(props.Value);
    }

    public newTelefonPU(props: NewTelefonPuType): TelefonPU {
        return new TelefonPU(props.Value);
    }

    public newDaneKontaktowePU(props: NewDaneKontaktowePUType): DaneKontaktowePU {
        return new DaneKontaktowePU(props.emailPU, props.telefonPU);
    }

    public newRolaPU(props: NewRolaType): RolaPU {
        return new RolaPU(props.value);
    }

    public setPodmiotUpowazniony(props: SetPodmiotUpowaznionyType): void {
        this.podmiotUpowazniony = new PodmiotUpowazniony(
            props.nrEORI,
            props.daneIdentyfikacyjne,
            props.adres,
            props.adresKoresp,
            props.daneKontaktowe,
            props.rolaPU
        );
    }
}

const test = new Fa3RootBuilder();

test.setNaglowek({
    dataWytworzeniaFa: "2024-12-09T10:42:34",
    kodFormularza: test.newKodFormularza(),
    wariantFormularza: "3",
    systemInfo: "System Info",
});

test.setPodmiot1({
    nrEORI: "EORI123456",
    daneIdentyfikacyjne: test.newDaneIdentyfikacyjne({
        NIP: test.newNip({ nip: "1234567890" }),
        Nazwa: test.newNazwa({ nazwa: "Test Company" }),
    }),
    adres: test.newAdres({
        kodKraju: test.newKodKraju({ kod: "PL" }),
        adresL1: test.newAdresL1({ adres: "ul. Przykładowa 1" }),
    }),
});

test.setPodmiot2({
    daneIdentyfikacyjne: test.newDaneIdentyfikacyjne2({
        nazwa: test.newNazwa({ nazwa: "Another Company" }),
        nip: test.newNip({ nip: "0987654321" }),
    }),
    adres: test.newAdres({
        kodKraju: test.newKodKraju({ kod: "DE" }),
        adresL1: test.newAdresL1({ adres: "Musterstrasse 5" }),
    }),
    jst: test.newJST({ value: 2 }),
    gv: test.newGV({ value: 2 }),
});

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
