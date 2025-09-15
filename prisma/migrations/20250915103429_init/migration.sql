/*
  Warnings:

  - You are about to drop the column `ip` on the `User` table. All the data in the column will be lost.
  - Added the required column `country` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `geoData` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timezone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `geoData` to the `VerificationRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Chain` MODIFY `description` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `Thread` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `ip`,
    ADD COLUMN `country` VARCHAR(191) NOT NULL,
    ADD COLUMN `geoData` VARCHAR(255) NOT NULL,
    ADD COLUMN `timezone` VARCHAR(191) NOT NULL,
    MODIFY `bio` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `VerificationRequest` ADD COLUMN `geoData` VARCHAR(255) NOT NULL;
