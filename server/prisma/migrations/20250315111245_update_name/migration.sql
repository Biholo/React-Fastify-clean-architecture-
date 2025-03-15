/*
  Warnings:

  - You are about to drop the column `created_at` on the `token` table. All the data in the column will be lost.
  - You are about to drop the column `device_ip` on the `token` table. All the data in the column will be lost.
  - You are about to drop the column `device_name` on the `token` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `token` table. All the data in the column will be lost.
  - You are about to drop the column `owned_by_id` on the `token` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `token` table. All the data in the column will be lost.
  - Added the required column `deviceIp` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deviceName` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownedById` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `token` DROP FOREIGN KEY `Token_owned_by_id_fkey`;

-- DropIndex
DROP INDEX `Token_owned_by_id_fkey` ON `token`;

-- AlterTable
ALTER TABLE `token` DROP COLUMN `created_at`,
    DROP COLUMN `device_ip`,
    DROP COLUMN `device_name`,
    DROP COLUMN `expires_at`,
    DROP COLUMN `owned_by_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deviceIp` VARCHAR(191) NOT NULL,
    ADD COLUMN `deviceName` VARCHAR(191) NOT NULL,
    ADD COLUMN `expiresAt` DATETIME(3) NOT NULL,
    ADD COLUMN `ownedById` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_ownedById_fkey` FOREIGN KEY (`ownedById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
