/*
  Warnings:

  - You are about to drop the column `description` on the `sport_courts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[booking_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `booking_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "booking_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sport_courts" DROP COLUMN "description";

-- CreateIndex
CREATE UNIQUE INDEX "payments_booking_id_key" ON "payments"("booking_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
