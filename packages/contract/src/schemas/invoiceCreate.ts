import { z } from "zod";
import { TFormaPlatnosci, TKodWaluty, TKodyKrajowUE, TRodzajFaktury, TStawkaPodatku } from "../ksef/enums";

const TZnakowy = z.string().min(1).max(256);
const TZnakowy512 = z.string().min(1).max(512);
const TNIP = z.string().regex(/^[1-9](((\d[1-9])|([1-9]\d))\d{7}|\d{8})$/);
const TData = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const TKwotowy = z.string().regex(/^-?\d{1,16}(\.\d{1,2})?$/);
const TIlosc = z.string().regex(/^-?\d{1,16}(\.\d{1,6})?$/);

const TAdres = z.object({
    kodKraju: z.union([z.nativeEnum(TKodyKrajowUE), z.string()]),
    adresL1: TZnakowy,
    adresL2: TZnakowy.optional(),
});

const Podmiot1 = z.object({
    daneIdentyfikacyjne: z.object({
        nip: TNIP,
        nazwa: TZnakowy512,
    }),
    adres: TAdres,
});

const Podmiot2 = z.object({
    daneIdentyfikacyjne: z.object({
        nip: TNIP.optional(),
        kodUE: z.nativeEnum(TKodyKrajowUE).optional(),
        nrVatUE: TZnakowy.optional(),
        kodKraju: z.union([z.nativeEnum(TKodyKrajowUE), z.string()]).optional(),
        nrID: z.string().optional(),
        brakID: z.literal(1).optional(),
        nazwa: TZnakowy512.optional(),
    }),
    adres: TAdres.optional(),
    jst: z.union([z.literal(1), z.literal(2)]),
    gv: z.union([z.literal(1), z.literal(2)]),
});

const FaWiersz = z.object({
    numerWiersza: z.number().int().positive(),
    nazwa: TZnakowy,
    jednostkaMiary: TZnakowy.optional(),
    ilosc: TIlosc.optional(),
    cenaJednostkowaNetto: TKwotowy.optional(),
    wartoscNetto: TKwotowy.optional(),
    stawkaVat: z.nativeEnum(TStawkaPodatku).optional(),
    kwotaVat: TKwotowy.optional(),
    wartoscBrutto: TKwotowy.optional(),
});

const Adnotacje = z.object({
    metodaKasowa: z.union([z.literal(1), z.literal(2)]),
    samofakturowanie: z.union([z.literal(1), z.literal(2)]),
    odwrotneObciazenie: z.union([z.literal(1), z.literal(2)]),
    splitPayment: z.union([z.literal(1), z.literal(2)]),
    zwolnienie: z.object({
        zwolnienieTak: z.literal(1).optional(),
        podstawaUstawa: TZnakowy.optional(),
        podstawaDyrektywa: TZnakowy.optional(),
        podstawaInna: TZnakowy.optional(),
        zwolnienieNie: z.literal(1).optional(),
    }),
    noweSrodkiTransportu: z.object({
        wdtNstTak: z.literal(1).optional(),
        wdtNstNie: z.literal(1).optional(),
    }),
    proceduraUproszczonaWNT: z.union([z.literal(1), z.literal(2)]),
    proceduraMarzy: z.object({
        marzyTak: z.literal(1).optional(),
        marzyNie: z.literal(1).optional(),
    }),
});

const Fa = z.object({
    waluta: z.nativeEnum(TKodWaluty),
    dataWystawienia: TData,
    numerFaktury: TZnakowy,
    kwotaBrutto: TKwotowy,
    adnotacje: Adnotacje,
    rodzajFaktury: z.nativeEnum(TRodzajFaktury),
    pozycje: z.array(FaWiersz).min(1),
    dataDostawy: TData.optional(),
    miejsceWystawienia: TZnakowy.optional(),
    platnosc: z
        .object({
            formaPlatnosci: z.nativeEnum(TFormaPlatnosci).optional(),
            opisPlatnosci: TZnakowy.optional(),
            terminPlatnosci: z.array(z.object({ termin: TData.optional() })).optional(),
        })
        .optional(),
});

export default z.object({
    podmiot1: Podmiot1,
    podmiot2: Podmiot2,
    fa: Fa,
});
