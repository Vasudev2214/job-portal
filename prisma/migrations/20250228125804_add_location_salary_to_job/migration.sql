/*
  Warnings:

  - Added the required column `location` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `job` ADD COLUMN `location` VARCHAR(191) NOT NULL,
    ADD COLUMN `salary` INTEGER NULL;
