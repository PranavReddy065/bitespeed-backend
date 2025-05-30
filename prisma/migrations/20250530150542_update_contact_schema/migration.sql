/*
  Warnings:

  - The primary key for the `Contact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Contact` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `linkedId` column on the `Contact` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `linkPrecedence` on the `Contact` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LinkPrecedence" AS ENUM ('primary', 'secondary');

-- DropIndex
DROP INDEX "Contact_email_key";

-- DropIndex
DROP INDEX "Contact_phoneNumber_key";

-- AlterTable
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_pkey",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "linkedId",
ADD COLUMN     "linkedId" INTEGER,
DROP COLUMN "linkPrecedence",
ADD COLUMN     "linkPrecedence" "LinkPrecedence" NOT NULL,
ADD CONSTRAINT "Contact_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Contact_email_idx" ON "Contact"("email");

-- CreateIndex
CREATE INDEX "Contact_phoneNumber_idx" ON "Contact"("phoneNumber");
