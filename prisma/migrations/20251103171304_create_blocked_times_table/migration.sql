/*
  Warnings:

  - Added the required column `type` to the `sport_courts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "validate_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "sport_courts" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "court_blocked_times" (
    "id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "sportCourt_id" TEXT NOT NULL,

    CONSTRAINT "court_blocked_times_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "court_blocked_times" ADD CONSTRAINT "court_blocked_times_sportCourt_id_fkey" FOREIGN KEY ("sportCourt_id") REFERENCES "sport_courts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
