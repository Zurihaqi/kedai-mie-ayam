/*
  Warnings:

  - You are about to drop the column `nama` on the `menu` table. All the data in the column will be lost.
  - Added the required column `makanan` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `menu` DROP COLUMN `nama`,
    ADD COLUMN `makanan` VARCHAR(255) NOT NULL,
    MODIFY `harga` INTEGER NOT NULL;
