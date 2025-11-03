/*
  Warnings:

  - You are about to drop the column `payment_id` on the `bookings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."bookings" DROP CONSTRAINT "bookings_payment_id_fkey";

-- DropIndex
DROP INDEX "public"."bookings_payment_id_key";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "payment_id";
