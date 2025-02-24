/*
  Warnings:

  - You are about to drop the `ContactList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ContactList` DROP FOREIGN KEY `ContactList_contact_id_fkey`;

-- DropForeignKey
ALTER TABLE `ContactList` DROP FOREIGN KEY `ContactList_user_id_fkey`;

-- DropTable
DROP TABLE `ContactList`;

-- CreateTable
CREATE TABLE `contact_list` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `user_id` INTEGER NOT NULL,
    `contact_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contact_list` ADD CONSTRAINT `contact_list_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact_list` ADD CONSTRAINT `contact_list_contact_id_fkey` FOREIGN KEY (`contact_id`) REFERENCES `contact`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
