/*
  Warnings:

  - You are about to drop the column `validate_at` on the `bookings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[payment_id]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payment_id` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "validate_at",
ADD COLUMN     "payment_id" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'confirmed';

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validated_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_payment_id_key" ON "bookings"("payment_id");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
