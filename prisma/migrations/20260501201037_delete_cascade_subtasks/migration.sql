-- DropForeignKey
ALTER TABLE "Subtasks" DROP CONSTRAINT "Subtasks_task_id_fkey";

-- AddForeignKey
ALTER TABLE "Subtasks" ADD CONSTRAINT "Subtasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
