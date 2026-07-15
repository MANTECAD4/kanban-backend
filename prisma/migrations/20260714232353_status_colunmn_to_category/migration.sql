/*
  Warnings:

  - You are about to drop the column `status_column_id` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `StatusColumn` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category_id` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StatusColumn" DROP CONSTRAINT "StatusColumn_board_id_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_status_column_id_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status_column_id",
ADD COLUMN     "category_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "StatusColumn";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "board_id" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
