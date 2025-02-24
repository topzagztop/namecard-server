/*
  Warnings:

  - You are about to drop the column `contact_name` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `name_card` table. All the data in the column will be lost.
  - You are about to drop the column `facebook` on the `social_link` table. All the data in the column will be lost.
  - You are about to drop the column `instagram` on the `social_link` table. All the data in the column will be lost.
  - You are about to drop the column `line` on the `social_link` table. All the data in the column will be lost.
  - You are about to drop the column `messenger` on the `social_link` table. All the data in the column will be lost.
  - You are about to drop the column `whatsapp` on the `social_link` table. All the data in the column will be lost.
  - You are about to drop the column `tel` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `business_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `name_card` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `namecard_id` to the `contact` table without a default value. This is not possible if the table is not empty.
  - The required column `slug` was added to the `name_card` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updated_at` to the `name_card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `social_link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `business_category` DROP FOREIGN KEY `business_category_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `business_category` DROP FOREIGN KEY `business_category_contact_id_fkey`;

-- DropForeignKey
ALTER TABLE `contact` DROP FOREIGN KEY `contact_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `name_card` DROP FOREIGN KEY `name_card_category_id_fkey`;

-- DropIndex
DROP INDEX `contact_user_id_fkey` ON `contact`;

-- DropIndex
DROP INDEX `name_card_category_id_fkey` ON `name_card`;

-- AlterTable
ALTER TABLE `contact` DROP COLUMN `contact_name`,
    DROP COLUMN `user_id`,
    ADD COLUMN `namecard_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `name_card` DROP COLUMN `category_id`,
    ADD COLUMN `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `qrcode` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` TIMESTAMP(0) NOT NULL,
    MODIFY `website` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `social_link` DROP COLUMN `facebook`,
    DROP COLUMN `instagram`,
    DROP COLUMN `line`,
    DROP COLUMN `messenger`,
    DROP COLUMN `whatsapp`,
    ADD COLUMN `social_name` VARCHAR(191) NULL,
    ADD COLUMN `url` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `tel`,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `business_category`;

-- DropTable
DROP TABLE `category`;

-- CreateTable
CREATE TABLE `ContactList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `user_id` INTEGER NOT NULL,
    `contact_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `name_card_slug_key` ON `name_card`(`slug`);

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `contact_namecard_id_fkey` FOREIGN KEY (`namecard_id`) REFERENCES `name_card`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactList` ADD CONSTRAINT `ContactList_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactList` ADD CONSTRAINT `ContactList_contact_id_fkey` FOREIGN KEY (`contact_id`) REFERENCES `contact`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
