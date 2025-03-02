/*
  Warnings:

  - Added the required column `business_profile` to the `name_card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job_position` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `name_card` ADD COLUMN `business_profile` VARCHAR(191) NOT NULL,
    MODIFY `qrcode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `social_link` MODIFY `url` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `job_position` VARCHAR(191) NOT NULL;
