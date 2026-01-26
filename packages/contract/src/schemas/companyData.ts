import z from "zod";

export default z.object({
    name: z.string().max(512),
    type: z.enum([
        "Jednoosobowa działalność gospodarcza",
        "Spółka cywilna",
        "Spółka jawna",
        "Spółka partnerska",
        "Spółka komandytowa",
        "Spółka komandytowo-akcyjna",
        "Spółka z ograniczoną odpowiedzialnością",
        "Prosta spółka akcyjna",
        "Spółka akcyjna",
        "Spółdzielnia",
        "Fundacja",
        "Stowarzyszenie rejestrowe",
        "Samodzielny publiczny zakład opieki zdrowotnej",
        "Jednostka budżetowa",
        "Oddział przedsiębiorcy zagranicznego",
        "Inna forma prawna",
    ]),
    nip: z.string().max(10),
    regon: z.string().max(14),
    bdo: z.string().max(20),
    krs: z.string().max(10),
    street: z.string().max(100),
    address: z.string().max(10),
    zipcode: z.string().max(6),
    city: z.string().max(100),
    country: z.string().max(50),
    registerDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format daty rejestracji firmy musi być YYYY-MM-DD.")
        .refine((v) => {
            const date = new Date(v);
            return !isNaN(date.getTime());
        }, "Data rejestracji jest niepoprawna.")
        .transform((value) => new Date(value)),
    vat: z.coerce.boolean(),
});
