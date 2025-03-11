/*
  Warnings:

  - You are about to drop the column `resume` on the `application` table. All the data in the column will be lost.
  - You are about to alter the column `salary` on the `job` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `application` DROP COLUMN `resume`,
    ADD COLUMN `updatedAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `job` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME NULL,
    MODIFY `location` VARCHAR(191) NULL,
    MODIFY `salary` DOUBLE NULL;






