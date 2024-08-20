/*
  Warnings:

  - Added the required column `selectedProductSize` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_selectedSize_fkey";

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "selectedProductSize" TEXT NOT NULL;
