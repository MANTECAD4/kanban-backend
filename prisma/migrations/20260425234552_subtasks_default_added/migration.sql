-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "subtasks" SET DEFAULT ARRAY[]::TEXT[];
