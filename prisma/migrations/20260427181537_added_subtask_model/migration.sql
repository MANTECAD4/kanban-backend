/*
  Warnings:

  - You are about to drop the column `status_id` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `subtasks` on the `Task` table. All the data in the column will be lost.
  - Added the required column `description` to the `StatusColumn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_column_id` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_status_id_fkey";

-- AlterTable
ALTER TABLE "StatusColumn" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status_id",
DROP COLUMN "subtasks",
ADD COLUMN     "status_column_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Subtasks" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL,
    "task_id" INTEGER NOT NULL,

    CONSTRAINT "Subtasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_status_column_id_fkey" FOREIGN KEY ("status_column_id") REFERENCES "StatusColumn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subtasks" ADD CONSTRAINT "Subtasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
