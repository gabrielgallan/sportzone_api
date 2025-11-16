/*
  Warnings:

  - You are about to drop the column `validated_at` on the `payments` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'PENDING', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "validated_at",
ADD COLUMN     "order_id" TEXT,
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" DROP DEFAULT;
