/*
  Warnings:

  - Made the column `ip` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `User_email_key` ON `User`;

-- DropIndex
DROP INDEX `User_schoolEmail_key` ON `User`;

-- AlterTable
ALTER TABLE `User` MODIFY `ip` VARCHAR(191) NOT NULL;
