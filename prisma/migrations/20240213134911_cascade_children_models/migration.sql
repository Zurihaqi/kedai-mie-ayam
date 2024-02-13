-- DropForeignKey
ALTER TABLE `jadwal` DROP FOREIGN KEY `Jadwal_idKedai_fkey`;

-- DropForeignKey
ALTER TABLE `kedai` DROP FOREIGN KEY `Kedai_idPemilik_fkey`;

-- DropForeignKey
ALTER TABLE `menu` DROP FOREIGN KEY `Menu_idKedai_fkey`;

-- DropForeignKey
ALTER TABLE `ulasan` DROP FOREIGN KEY `Ulasan_idKedai_fkey`;

-- DropForeignKey
ALTER TABLE `ulasan` DROP FOREIGN KEY `Ulasan_idPenulis_fkey`;

-- AddForeignKey
ALTER TABLE `Kedai` ADD CONSTRAINT `Kedai_idPemilik_fkey` FOREIGN KEY (`idPemilik`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jadwal` ADD CONSTRAINT `Jadwal_idKedai_fkey` FOREIGN KEY (`idKedai`) REFERENCES `Kedai`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Menu` ADD CONSTRAINT `Menu_idKedai_fkey` FOREIGN KEY (`idKedai`) REFERENCES `Kedai`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ulasan` ADD CONSTRAINT `Ulasan_idPenulis_fkey` FOREIGN KEY (`idPenulis`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ulasan` ADD CONSTRAINT `Ulasan_idKedai_fkey` FOREIGN KEY (`idKedai`) REFERENCES `Kedai`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
