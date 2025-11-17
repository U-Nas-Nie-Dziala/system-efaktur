-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(64) NOT NULL,
    `lastname` VARCHAR(64) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(64) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tokens` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `invalided` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `usersId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Companies` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` ENUM('Jednoosobowa działalność gospodarcza', 'Spółka cywilna', 'Spółka jawna', 'Spółka partnerska', 'Spółka komandytowa', 'Spółka komandytowo-akcyjna', 'Spółka z ograniczoną odpowiedzialnością', 'Prosta spółka akcyjna', 'Spółka akcyjna', 'Spółdzielnia', 'Fundacja', 'Stowarzyszenie rejestrowe', 'Samodzielny publiczny zakład opieki zdrowotnej', 'Jednostka budżetowa', 'Oddział przedsiębiorcy zagranicznego', 'Inna forma prawna') NOT NULL,
    `nip` CHAR(10) NOT NULL,
    `regon` CHAR(14) NOT NULL,
    `bdo` CHAR(20) NULL,
    `krs` CHAR(10) NULL,
    `street` VARCHAR(100) NOT NULL,
    `address` CHAR(10) NOT NULL,
    `zipcode` CHAR(6) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `country` VARCHAR(50) NOT NULL,
    `registerDate` DATE NOT NULL,
    `vat` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Companies_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Clients` (
    `id` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `nip` CHAR(10) NOT NULL,
    `regon` CHAR(14) NOT NULL,
    `street` VARCHAR(100) NOT NULL,
    `address` CHAR(10) NOT NULL,
    `zipcode` CHAR(6) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `country` VARCHAR(50) NOT NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(12) NULL,
    `isCompany` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoices` (
    `id` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `nr` VARCHAR(50) NOT NULL,
    `type` ENUM('FA_VAT', 'FA_KOR', 'FA_RR', 'FA_MP', 'FA_ZAL', 'FA_WNT', 'FA_WDT', 'FA_EXP', 'FA_UPR', 'FA_ZB') NOT NULL,
    `status` ENUM('DRAFT', 'CREATED', 'SIGNED', 'SENT', 'ACCEPTED', 'REJECTED', 'RECEIVED') NOT NULL,
    `exhibitorId` VARCHAR(191) NULL,
    `issueDate` DATE NOT NULL,
    `issuePlace` VARCHAR(100) NOT NULL,
    `executeDate` DATE NOT NULL,
    `paymentDate` DATE NULL,
    `currency` ENUM('PLN') NOT NULL DEFAULT 'PLN',
    `ksefId` VARCHAR(100) NULL,
    `ksefReference` VARCHAR(100) NULL,
    `netto` DECIMAL(12, 2) NOT NULL,
    `vat` DECIMAL(12, 2) NOT NULL,
    `brutto` DECIMAL(12, 2) NOT NULL,
    `vatFree` BOOLEAN NOT NULL,
    `vatFreeReason` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Invoices_nr_key`(`nr`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceItems` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `unit` ENUM('SZT', 'KG', 'USŁ', 'L') NOT NULL,
    `count` DECIMAL(12, 3) NOT NULL,
    `netto` DECIMAL(12, 2) NOT NULL,
    `varRate` DECIMAL(5, 2) NOT NULL,
    `vat` DECIMAL(12, 2) NOT NULL,
    `brutto` DECIMAL(12, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tokens` ADD CONSTRAINT `Tokens_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Companies` ADD CONSTRAINT `Companies_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clients` ADD CONSTRAINT `Clients_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoices` ADD CONSTRAINT `Invoices_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoices` ADD CONSTRAINT `Invoices_exhibitorId_fkey` FOREIGN KEY (`exhibitorId`) REFERENCES `Clients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItems` ADD CONSTRAINT `InvoiceItems_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
