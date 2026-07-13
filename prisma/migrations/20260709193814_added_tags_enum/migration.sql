/*
  Warnings:

  - You are about to drop the column `description` on the `StatusColumn` table. All the data in the column will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TagToTask` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `icon` to the `StatusColumn` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskTag" AS ENUM ('UI', 'UX', 'Bug', 'Feature', 'Refactor', 'Documentation', 'Testing', 'Research', 'Performance', 'Security', 'API', 'Authentication', 'Database', 'Container', 'Git', 'CSS', 'Accessibility', 'Responsive', 'Animation', 'Deployment', 'Hotfix', 'Optimization', 'Cleanup');

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_board_id_fkey";

-- DropForeignKey
ALTER TABLE "_TagToTask" DROP CONSTRAINT "_TagToTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_TagToTask" DROP CONSTRAINT "_TagToTask_B_fkey";

-- AlterTable
ALTER TABLE "StatusColumn" DROP COLUMN "description",
ADD COLUMN     "icon" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "tags" "TaskTag"[];

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_TagToTask";
