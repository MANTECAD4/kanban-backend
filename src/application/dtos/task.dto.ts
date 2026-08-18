import z from "zod";
import { TaskPriority } from "../../domain/entities";

export enum TaskTag {
  UI = "UI",
  UX = "UX",
  Bug = "Bug",
  Feature = "Feature",
  Refactor = "Refactor",
  Documentation = "Documentation",
  Testing = "Testing",
  Research = "Research",
  Performance = "Performance",
  Security = "Security",
  API = "API",
  Authentication = "Authentication",
  Database = "Database",
  Container = "Container",
  Git = "Git",
  CSS = "CSS",
  Accessibility = "Accessibility",
  Responsive = "Responsive",
  Animation = "Animation",
  Deployment = "Deployment",
  Hotfix = "Hotfix",
  Optimization = "Optimization",
  Cleanup = "Cleanup",
}
export const SubmitTaskSchema = z.object({
  title: z.string().normalize().min(3),
  slug: z.string(),
  description: z.string().normalize().nonempty(),
  dueDate: z.coerce.date(),
  priority: z.enum(TaskPriority),
  tags: z.array(z.enum(TaskTag)),
});

export type SubmitTaskDto = z.infer<typeof SubmitTaskSchema>;

export const UpcomingTaskSchema = z.object({
  task: z.object({
    id: z.int().min(1),
    title: z.string(),
    slug: z.string(),
    dueDate: z.date(),
  }),
  board: z.object({
    id: z.int().min(1),
    name: z.string(),
    slug: z.string(),
  }),
});

export type UpcomingTaskDto = z.infer<typeof UpcomingTaskSchema>;

export const TasksMetaByPrioritySchema = z.object({
  total: z.int().min(1),
  low: z.int().min(1),
  medium: z.int().min(1),
  high: z.int().min(1),
  urgent: z.int().min(1),
});

export type TasksMetaByPriorityDto = z.infer<typeof TasksMetaByPrioritySchema>;
