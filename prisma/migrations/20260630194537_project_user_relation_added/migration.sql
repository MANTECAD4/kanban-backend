/*
  Warnings:

  - You are about to drop the column `user_id` on the `Board` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_user_id_fkey";

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
