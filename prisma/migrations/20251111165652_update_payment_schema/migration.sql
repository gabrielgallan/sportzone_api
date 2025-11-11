-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "method" DROP NOT NULL,
ALTER COLUMN "external_id" DROP NOT NULL;
