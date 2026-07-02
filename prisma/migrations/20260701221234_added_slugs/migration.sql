/*
  Warnings:

  - Added the required column `slug` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "slug" TEXT NOT NULL;
