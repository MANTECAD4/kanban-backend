/*
  Warnings:

  - Changed the type of `icon_color` on the `Project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "IconColor" AS ENUM ('RED', 'ORANGE', 'YELLOW', 'GREEN', 'SKY', 'CYAN', 'INDIGO', 'PURPLE', 'PINK', 'GRAY');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "icon_color",
ADD COLUMN     "icon_color" "IconColor" NOT NULL;
