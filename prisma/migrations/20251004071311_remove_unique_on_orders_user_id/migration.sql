-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_userId_fkey`;

-- DropIndex
DROP INDEX `orders_userId_key` ON `orders`;

-- CreateIndex
CREATE INDEX `orders_userId_idx` ON `orders`(`userId`);

-- AddForeignKey
ALTER TABLE `cartDetails` ADD CONSTRAINT `cartDetails_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `carts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
