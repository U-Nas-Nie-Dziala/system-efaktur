import { RouteCtx, contract } from "@repo/contract";
import { useRepository } from "../../core/database";
import { Invoice } from "../../models/Invoice";
import { XmlSerializer } from "../../core/ksef";
import {
    Adnotacje,
    DaneIdentyfikacyjneNabywcy,
    DaneIdentyfikacyjnePodatnika,
    Fa,
    FaWiersz,
    Faktura,
    NoweSrodkiTransportu,
    PMarzy,
    Podmiot1,
    Podmiot2,
    TAdres,
    Zwolnienie,
} from "../../core/ksef/types";
import { KodFormularzaFa, Naglowek } from "../../core/ksef/types/header";
import { StorageService } from "../../services/StorageService";

export type Route = RouteCtx<typeof contract.invoicesSave>;

export const invoicesSave = async (ctx: Route["ctx"]): Promise<Route["response"]> => {
    if (!ctx.req.auth?.token.user.company) {
        return {
            status: 400,
            body: { message: "Brak przypisanej firmy użytkownika." },
        };
    }

    const invoicesRepository = useRepository<Invoice>(Invoice);

    const invoice = await invoicesRepository.findOne({
        where: {
            id: ctx.params.id,
            company: {
                user: {
                    id: ctx.req.auth.payload.userId,
                },
            },
        },
        relations: {
            company: true,
        },
    });

    if (!invoice) {
        return {
            status: 404,
            body: {
                message: "Faktura o podanym ID nie istnieje.",
            },
        };
    }

    if (!invoice.sprzedawca?.podmiot1 || !invoice.nabywca?.podmiot2 || !invoice.body?.fa) {
        return {
            status: 400,
            body: { message: "Brak danych faktury do zapisu." },
        };
    }

    const serializer = new XmlSerializer();
    const faktura = new Faktura();
    faktura.naglowek = new Naglowek();
    faktura.naglowek.kodFormularza = new KodFormularzaFa();
    faktura.naglowek.systemInfo = "UNasNieDzialaApp";
    faktura.naglowek.dataWytworzeniaFa = new Date().toISOString();
    const mapAdres = (adres: { kodKraju: string; adresL1: string; adresL2?: string }) => {
        const mapped = new TAdres();
        mapped.kodKraju = adres.kodKraju as never;
        mapped.adresL1 = adres.adresL1 as never;
        if (adres.adresL2) {
            mapped.adresL2 = adres.adresL2 as never;
        }
        return mapped;
    };

    const mapPodmiot1 = (source: typeof invoice.sprzedawca.podmiot1) => {
        const podmiot = new Podmiot1();
        const ident = new DaneIdentyfikacyjnePodatnika();
        ident.nip = source.daneIdentyfikacyjne.nip as never;
        ident.nazwa = source.daneIdentyfikacyjne.nazwa as never;
        podmiot.daneIdentyfikacyjne = ident;
        podmiot.adres = mapAdres(source.adres);
        return podmiot;
    };

    const mapPodmiot2 = (source: typeof invoice.nabywca.podmiot2) => {
        const podmiot = new Podmiot2();
        const ident = new DaneIdentyfikacyjneNabywcy();
        ident.nip = source.daneIdentyfikacyjne.nip as never;
        ident.nazwa = source.daneIdentyfikacyjne.nazwa as never;
        ident.kodUE = source.daneIdentyfikacyjne.kodUE as never;
        ident.nrVatUE = source.daneIdentyfikacyjne.nrVatUE as never;
        ident.kodKraju = source.daneIdentyfikacyjne.kodKraju as never;
        ident.nrID = source.daneIdentyfikacyjne.nrID;
        ident.brakID = source.daneIdentyfikacyjne.brakID as 1 | undefined;
        podmiot.daneIdentyfikacyjne = ident;
        if (source.adres) {
            podmiot.adres = mapAdres(source.adres);
        }
        podmiot.jst = source.jst;
        podmiot.gv = source.gv;
        return podmiot;
    };

    const mapAdnotacje = (source: typeof invoice.body.fa.adnotacje) => {
        const adnotacje = new Adnotacje();
        adnotacje.metodaKasowa = source.metodaKasowa;
        adnotacje.samofakturowanie = source.samofakturowanie;
        adnotacje.odwrotneObciazenie = source.odwrotneObciazenie;
        adnotacje.splitPayment = source.splitPayment;

        const zwolnienie = new Zwolnienie();
        zwolnienie.zwolnienieTak = source.zwolnienie.zwolnienieTak;
        zwolnienie.podstawaUstawa = source.zwolnienie.podstawaUstawa as never;
        zwolnienie.podstawaDyrektywa = source.zwolnienie.podstawaDyrektywa as never;
        zwolnienie.podstawaInna = source.zwolnienie.podstawaInna as never;
        zwolnienie.zwolnienieNie = source.zwolnienie.zwolnienieNie;
        adnotacje.zwolnienie = zwolnienie;

        const nst = new NoweSrodkiTransportu();
        nst.wdtNstTak = source.noweSrodkiTransportu.wdtNstTak;
        nst.wdtNstNie = source.noweSrodkiTransportu.wdtNstNie;
        adnotacje.noweSrodkiTransportu = nst;

        adnotacje.proceduraUproszczonaWNT = source.proceduraUproszczonaWNT;

        const marzy = new PMarzy();
        marzy.marzyTak = source.proceduraMarzy.marzyTak;
        marzy.marzyNie = source.proceduraMarzy.marzyNie;
        adnotacje.proceduraMarzy = marzy;

        return adnotacje;
    };

    const mapPozycje = (source: typeof invoice.body.fa.pozycje) => {
        return source.map((pozycja) => {
            const item = new FaWiersz();
            item.numerWiersza = pozycja.numerWiersza as never;
            item.nazwa = pozycja.nazwa as never;
            item.wartoscNetto = pozycja.wartoscNetto;
            item.jednostkaMiary = pozycja.jednostkaMiary as never;
            item.ilosc = pozycja.ilosc as never;
            item.cenaJednostkowaNetto = pozycja.cenaJednostkowaNetto as never;
            item.stawkaVat = pozycja.stawkaVat;
            item.kwotaVat = pozycja.kwotaVat as never;
            return item;
        });
    };

    const mapFa = (source: typeof invoice.body.fa) => {
        const fa = new Fa();
        fa.waluta = source.waluta;
        fa.dataWystawienia = source.dataWystawienia as never;
        fa.numerFaktury = source.numerFaktury as never;
        fa.kwotaBrutto = source.kwotaBrutto as never;
        fa.adnotacje = mapAdnotacje(source.adnotacje);
        fa.rodzajFaktury = source.rodzajFaktury;
        fa.pozycje = mapPozycje(source.pozycje);
        fa.dataDostawy = source.dataDostawy as never;
        fa.miejsceWystawienia = source.miejsceWystawienia as never;
        return fa;
    };

    faktura.podmiot1 = mapPodmiot1(invoice.sprzedawca.podmiot1);
    faktura.podmiot2 = mapPodmiot2(invoice.nabywca.podmiot2);
    faktura.fa = mapFa(invoice.body.fa);

    const XML = serializer.serialize(faktura);

    const companyId = invoice.company?.id ?? ctx.req.auth.token.user.company.id;
    const result = await StorageService.saveInvoiceOnDisk(companyId, invoice.id, XML);

    if (!result) {
        return {
            status: 400,
            body: { message: "Nie udało się zapisać faktury." },
        };
    }

    invoice.draft = false;
    await invoicesRepository.save(invoice);

    return {
        status: 200,
        body: {},
    };
};
