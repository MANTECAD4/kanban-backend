/*
  Warnings:

  - Added the required column `icon` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon_color` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "icon" TEXT NOT NULL,
ADD COLUMN     "icon_color" TEXT NOT NULL,
ADD COLUMN     "project_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "icon_color" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
