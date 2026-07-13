import z from "zod";
import { Priority } from "../../domain/entities";

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
  priority: z.enum(Priority),
  tags: z.array(z.enum(TaskTag)),
});

export type SubmitTaskDto = z.infer<typeof SubmitTaskSchema>;
