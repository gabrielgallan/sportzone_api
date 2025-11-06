/*
  Warnings:

  - You are about to drop the `court_blocked_times` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."court_blocked_times" DROP CONSTRAINT "court_blocked_times_sportCourt_id_fkey";

-- DropTable
DROP TABLE "public"."court_blocked_times";

-- CreateTable
CREATE TABLE "court_blocked_dates" (
    "id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "sportCourt_id" TEXT NOT NULL,

    CONSTRAINT "court_blocked_dates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "court_blocked_dates" ADD CONSTRAINT "court_blocked_dates_sportCourt_id_fkey" FOREIGN KEY ("sportCourt_id") REFERENCES "sport_courts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
