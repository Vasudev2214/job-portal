/*
  Warnings:

  - You are about to drop the column `salary` on the `job` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `job` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `job` DROP FOREIGN KEY `Job_userId_fkey`;

-- AlterTable
ALTER TABLE `job` DROP COLUMN `salary`,
    DROP COLUMN `userId`;

-- CreateTable
CREATE TABLE `Application` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `jobId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
