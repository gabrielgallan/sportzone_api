/*
  Warnings:

  - Added the required column `owner_id` to the `sport_courts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sport_courts" ADD COLUMN     "owner_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "sport_courts" ADD CONSTRAINT "sport_courts_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
