import { prisma } from "../../../data/init-postgres";
import { TaskPriority } from "../../../domain/entities";
import {
  BoardRepository,
  CategoryRepository,
  SubtaskRepository,
  TaskRepository,
  UserRepository,
} from "../../../domain/repositories";
import { HasherService } from "../../../domain/services";
import { TaskTag } from "../../dtos";
import { IconColor } from "../../dtos/project.dto";

interface Dependencies {
  userRepository: UserRepository;
  boardRepository: BoardRepository;
  categoryRepository: CategoryRepository;
  taskRepository: TaskRepository;
  subtaskRepository: SubtaskRepository;
  strongHasher: HasherService;
}

export class SeedDatabaseUseCase {
  private readonly userRepository: UserRepository;
  private readonly categoryRepository: CategoryRepository;
  private readonly boardRepository: BoardRepository;
  private readonly taskRepository: TaskRepository;
  private readonly subtaskRepository: SubtaskRepository;
  private readonly strongHasher: HasherService;

  constructor(dependencies: Dependencies) {
    const {
      userRepository,
      boardRepository,
      taskRepository,
      categoryRepository,
      subtaskRepository,
      strongHasher,
    } = dependencies;
    this.userRepository = userRepository;
    this.categoryRepository = categoryRepository;
    this.boardRepository = boardRepository;
    this.taskRepository = taskRepository;
    this.subtaskRepository = subtaskRepository;
    this.strongHasher = strongHasher;
  }

  public execute = async () => {
    await prisma.attachment.deleteMany({});
    await prisma.subtask.deleteMany({});
    await prisma.task.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.board.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.refreshToken.deleteMany({});
    const password1 = await this.strongHasher.hash("MyPassword1*");
    const password2 = await this.strongHasher.hash("rI0.4&OC");

    const user1 = await this.userRepository.register({
      name: "Daniel Martinez",
      email: "nanel2002@gmail.com",
      password: password1,
    });
    const user2 = await this.userRepository.register({
      name: "Esme Thomesson",
      email: "ethomesson1@cam.ac.uk",
      password: password2,
    });

    const board1 = await this.boardRepository.create(user1.id, {
      name: "E-Commerce Platform",
      slug: "e-commerce-platform",
      description: "Online shopping platform development",
      icon: "shoppingcart",
      iconColor: IconColor.ORANGE,
    });
    const board2 = await this.boardRepository.create(user1.id, {
      name: "Food Delivery",
      slug: "food-delivery",
      description: "Food ordering and delivery platform",
      icon: "utensils",
      iconColor: IconColor.RED,
    });
    const board3 = await this.boardRepository.create(user1.id, {
      name: "Chat Platform",
      slug: "chat-platform",
      description: "Real-time communication platform",
      icon: "messagecircle",
      iconColor: IconColor.CYAN,
    });

    await this.boardRepository.create(user2.id, {
      name: "Kanban Pro",
      slug: "kanban-pro",
      description: "Project management platform for teams",
      icon: "layoutdashboard",
      iconColor: IconColor.INDIGO,
    });
    await this.boardRepository.create(user2.id, {
      name: "Social Network",
      slug: "social-network",
      description: "Social networking platform for communities",
      icon: "users",
      iconColor: IconColor.PURPLE,
    });
    await this.boardRepository.create(user2.id, {
      name: "Inventory System",
      slug: "inventory-system",
      description: "Inventory and warehouse management system",
      icon: "package",
      iconColor: IconColor.GRAY,
    });

    const category1 = await this.categoryRepository.create(board1.id, {
      name: "Backlog",
      icon: "inbox",
      order: 1,
    });
    const category2 = await this.categoryRepository.create(board1.id, {
      name: "To Do",
      icon: "list-todo",
      order: 2,
    });
    const category3 = await this.categoryRepository.create(board1.id, {
      name: "In Progress",
      icon: "loader",
      order: 3,
    });
    const category4 = await this.categoryRepository.create(board1.id, {
      name: "Review",
      icon: "eye",
      order: 4,
    });
    const category5 = await this.categoryRepository.create(board1.id, {
      name: "Done",
      icon: "circlecheck",
      order: 5,
    });

    const category6 = await this.categoryRepository.create(board2.id, {
      name: "Ideas",
      icon: "lightbulb",
      order: 1,
    });
    const category7 = await this.categoryRepository.create(board2.id, {
      name: "Planned",
      icon: "calendar",
      order: 2,
    });
    const category8 = await this.categoryRepository.create(board2.id, {
      name: "Development",
      icon: "code",
      order: 3,
    });
    const category9 = await this.categoryRepository.create(board2.id, {
      name: "Testing",
      icon: "flaskconical",
      order: 4,
    });
    const category10 = await this.categoryRepository.create(board2.id, {
      name: "Released",
      icon: "rocket",
      order: 5,
    });

    const category11 = await this.categoryRepository.create(board3.id, {
      name: "Pending",
      icon: "clock",
      order: 1,
    });
    const category12 = await this.categoryRepository.create(board3.id, {
      name: "Design",
      icon: "palette",
      order: 2,
    });
    const category13 = await this.categoryRepository.create(board3.id, {
      name: "Implementation",
      icon: "wrench",
      order: 3,
    });
    const category14 = await this.categoryRepository.create(board3.id, {
      name: "QA",
      icon: "shieldcheck",
      order: 4,
    });
    const category15 = await this.categoryRepository.create(board3.id, {
      name: "Completed",
      icon: "checkcircle",
      order: 5,
    });

    const task1 = await this.taskRepository.create(category1.id, {
      title: "Set up project structure",
      slug: "set-up-project-structure",
      description:
        "Create the initial project structure and organize the main modules.",
      order: 1,
      priority: TaskPriority.High,
      dueDate: new Date("2026-10-02T18:00:00.000Z"),
      tags: [
        TaskTag.Animation,
        TaskTag.Deployment,
        TaskTag.Git,
        TaskTag.Accessibility,
      ],
    });
    const task2 = await this.taskRepository.create(category1.id, {
      title: "Create authentication flow",
      slug: "create-authentication-flow",
      description: "Implement login, registration and session management.",
      order: 2,
      priority: TaskPriority.High,
      tags: [TaskTag.API, TaskTag.Database, TaskTag.Cleanup],
      dueDate: new Date("2026-10-04T18:00:00.000Z"),
    });
    const task3 = await this.taskRepository.create(category1.id, {
      title: "Design dashboard layout",
      slug: "design-dashboard-layout",
      description:
        "Create the initial dashboard layout and navigation structure.",
      order: 3,
      priority: TaskPriority.Medium,
      tags: [
        TaskTag.Documentation,
        TaskTag.Research,
        TaskTag.Database,
        TaskTag.Responsive,
      ],
      dueDate: new Date("2026-10-06T18:00:00.000Z"),
    });
    const task4 = await this.taskRepository.create(category1.id, {
      title: "Add responsive navigation",
      slug: "add-responsive-navigation",
      description:
        "Make the main navigation work properly on mobile and desktop.",
      order: 4,
      priority: TaskPriority.Medium,
      tags: [TaskTag.API, TaskTag.Git, TaskTag.UX],
      dueDate: new Date("2026-10-08T18:00:00.000Z"),
    });
    const task5 = await this.taskRepository.create(category1.id, {
      title: "Implement user profile",
      slug: "implement-user-profile",
      description: "Add profile information and account settings.",
      order: 5,
      priority: TaskPriority.Low,
      tags: [TaskTag.CSS, TaskTag.Bug],
      dueDate: new Date("2026-10-10T18:00:00.000Z"),
    });
    const task6 = await this.taskRepository.create(category1.id, {
      title: "Configure environment variables",
      slug: "configure-environment-variables",
      description:
        "Configure development and production environment variables.",
      order: 6,
      priority: TaskPriority.Medium,
      tags: [TaskTag.Database],
      dueDate: new Date("2026-10-11T18:00:00.000Z"),
    });

    const task7 = await this.taskRepository.create(category2.id, {
      title: "Create database schema",
      slug: "create-database-schema",
      description:
        "Define the database models and relationships required by the application.",
      order: 1,
      priority: TaskPriority.High,
      tags: [TaskTag.Animation, TaskTag.CSS],
      dueDate: new Date("2026-10-03T18:00:00.000Z"),
    });
    const task8 = await this.taskRepository.create(category2.id, {
      title: "Implement user repository",
      slug: "implement-user-repository",
      description: "Create the repository responsible for user persistence.",
      order: 2,
      priority: TaskPriority.High,
      tags: [TaskTag.Documentation],
      dueDate: new Date("2026-10-05T18:00:00.000Z"),
    });
    const task9 = await this.taskRepository.create(category2.id, {
      title: "Add API validation",
      slug: "add-api-validation",
      description: "Validate incoming API requests before processing them.",
      order: 3,
      priority: TaskPriority.Medium,
      tags: [TaskTag.Refactor, TaskTag.Feature, TaskTag.Deployment],
      dueDate: new Date("2026-10-07T18:00:00.000Z"),
    });
    const task10 = await this.taskRepository.create(category2.id, {
      title: "Implement error handling",
      slug: "implement-error-handling",
      description: "Create consistent error responses across the API.",
      order: 4,
      priority: TaskPriority.High,
      tags: [TaskTag.Container, TaskTag.Performance, TaskTag.Authentication],
      dueDate: new Date("2026-10-09T18:00:00.000Z"),
    });
    const task11 = await this.taskRepository.create(category2.id, {
      title: "Add pagination to endpoints",
      slug: "add-pagination-to-endpoints",
      description:
        "Add pagination support to endpoints returning large collections.",
      order: 5,
      priority: TaskPriority.Medium,
      tags: [TaskTag.Refactor, TaskTag.Feature],
      dueDate: new Date("2026-10-12T18:00:00.000Z"),
    });
    const task12 = await this.taskRepository.create(category2.id, {
      title: "Document API endpoints",
      slug: "document-api-endpoints",
      description:
        "Document available endpoints, parameters and response formats.",
      order: 6,
      priority: TaskPriority.Low,
      tags: [TaskTag.Cleanup, TaskTag.Documentation, TaskTag.Testing],
      dueDate: new Date("2026-10-14T18:00:00.000Z"),
    });

    const task13 = await this.taskRepository.create(category3.id, {
      title: "Create project page",
      slug: "create-project-page",
      description:
        "Build the main project page and its basic information section.",
      order: 1,
      priority: TaskPriority.High,
      dueDate: new Date("2026-10-04T18:00:00.000Z"),
      tags: [TaskTag.Testing, TaskTag.Security, TaskTag.Accessibility],
    });
    const task14 = await this.taskRepository.create(category3.id, {
      title: "Implement task creation",
      slug: "implement-task-creation",
      description:
        "Allow users to create new tasks from the project interface.",
      order: 2,
      priority: TaskPriority.High,
      dueDate: new Date("2026-10-06T18:00:00.000Z"),
      tags: [TaskTag.Security, TaskTag.Cleanup],
    });
    const task15 = await this.taskRepository.create(category3.id, {
      title: "Add task editing",
      slug: "add-task-editing",
      description: "Allow users to edit task information after creation.",
      order: 3,
      priority: TaskPriority.Medium,
      dueDate: new Date("2026-10-08T18:00:00.000Z"),
      tags: [
        TaskTag.CSS,
        TaskTag.Documentation,
        TaskTag.UX,
        TaskTag.Refactor,
        TaskTag.Container,
      ],
    });
    const task16 = await this.taskRepository.create(category3.id, {
      title: "Implement drag and drop",
      slug: "implement-drag-and-drop",
      description: "Allow tasks to be reordered and moved between categories.",
      order: 4,
      priority: TaskPriority.High,
      dueDate: new Date("2026-10-10T18:00:00.000Z"),
      tags: [TaskTag.Bug, TaskTag.Hotfix, TaskTag.Research],
    });
    const task17 = await this.taskRepository.create(category3.id, {
      title: "Add task priority selector",
      slug: "add-task-priority-selector",
      description:
        "Add a priority selector to the task creation and editing forms.",
      order: 5,
      priority: TaskPriority.Low,
      dueDate: new Date("2026-10-12T18:00:00.000Z"),
      tags: [TaskTag.Documentation],
    });
    const task18 = await this.taskRepository.create(category3.id, {
      title: "Create task details modal",
      slug: "create-task-details-modal",
      description: "Create a modal displaying the complete task information.",
      order: 6,
      priority: TaskPriority.Medium,
      dueDate: new Date("2026-10-15T18:00:00.000Z"),
      tags: [TaskTag.Bug, TaskTag.Documentation, TaskTag.Git],
    });

    const task19 = await this.taskRepository.create(category4.id, {
      title: "Write authentication tests",
      slug: "write-authentication-tests",
      description: "Cover login, registration and token refresh scenarios.",
      order: 1,
      priority: TaskPriority.High,
      dueDate: new Date("2026-10-05T18:00:00.000Z"),
      tags: [TaskTag.Container, TaskTag.Documentation, TaskTag.Deployment],
    });
    const task20 = await this.taskRepository.create(category4.id, {
      title: "Test task endpoints",
      slug: "test-task-endpoints",
      description: "Create integration tests for task-related API endpoints.",
      order: 2,
      priority: TaskPriority.High,
      dueDate: new Date("2026-10-07T18:00:00.000Z"),
      tags: [TaskTag.Feature, TaskTag.Performance],
    });
    const task21 = await this.taskRepository.create(category4.id, {
      title: "Fix task ordering bug",
      slug: "fix-task-ordering-bug",
      description:
        "Investigate and fix incorrect task ordering after drag and drop.",
      order: 3,
      priority: TaskPriority.High,
      dueDate: new Date("2026-10-09T18:00:00.000Z"),
      tags: [
        TaskTag.Database,
        TaskTag.Refactor,
        TaskTag.UX,
        TaskTag.Git,
        TaskTag.Accessibility,
      ],
    });
    const task22 = await this.taskRepository.create(category4.id, {
      title: "Improve form validation",
      slug: "improve-form-validation",
      description:
        "Improve validation messages and edge case handling in forms.",
      order: 4,
      priority: TaskPriority.Medium,
      dueDate: new Date("2026-10-11T18:00:00.000Z"),
      tags: [TaskTag.Container],
    });
    const task23 = await this.taskRepository.create(category4.id, {
      title: "Check mobile layout",
      slug: "check-mobile-layout",
      description: "Review the interface on different mobile screen sizes.",
      order: 5,
      priority: TaskPriority.Medium,
      dueDate: new Date("2026-10-13T18:00:00.000Z"),
      tags: [TaskTag.Authentication, TaskTag.Optimization, TaskTag.UX],
    });
    const task24 = await this.taskRepository.create(category4.id, {
      title: "Review accessibility",
      slug: "review-accessibility",
      description:
        "Check keyboard navigation, labels and accessible interactive elements.",
      order: 6,
      priority: TaskPriority.Low,
      dueDate: new Date("2026-10-16T18:00:00.000Z"),
      tags: [TaskTag.UX, TaskTag.UI, TaskTag.Testing, TaskTag.API],
    });

    const task25 = await this.taskRepository.create(category5.id, {
      title: "Prepare production build",
      slug: "prepare-production-build",
      description: "Configure the application for a production deployment.",
      order: 1,
      priority: TaskPriority.High,
      dueDate: new Date("2026-10-06T18:00:00.000Z"),
      tags: [TaskTag.Accessibility],
    });
    const task26 = await this.taskRepository.create(category5.id, {
      title: "Configure Docker image",
      slug: "configure-docker-image",
      description: "Create and optimize the Docker image for deployment.",
      order: 2,
      priority: TaskPriority.Medium,
      dueDate: new Date("2026-10-08T18:00:00.000Z"),
      tags: [TaskTag.API, TaskTag.Accessibility, TaskTag.Animation],
    });
    const task27 = await this.taskRepository.create(category5.id, {
      title: "Set up CI pipeline",
      slug: "set-up-ci-pipeline",
      description:
        "Create a CI pipeline to run tests and validation automatically.",
      order: 3,
      priority: TaskPriority.High,
      dueDate: new Date("2026-10-10T18:00:00.000Z"),
      tags: [TaskTag.Bug, TaskTag.Cleanup, TaskTag.Accessibility],
    });
    const task28 = await this.taskRepository.create(category5.id, {
      title: "Optimize database queries",
      slug: "optimize-database-queries",
      description: "Review slow queries and improve database performance.",
      order: 4,
      priority: TaskPriority.Medium,
      dueDate: new Date("2026-10-13T18:00:00.000Z"),
      tags: [TaskTag.Cleanup, TaskTag.Testing],
    });
    const task29 = await this.taskRepository.create(category5.id, {
      title: "Clean up unused code",
      slug: "clean-up-unused-code",
      description: "Remove unused components, dependencies and obsolete code.",
      order: 5,
      priority: TaskPriority.Low,
      dueDate: new Date("2026-10-15T18:00:00.000Z"),
      tags: [
        TaskTag.Refactor,
        TaskTag.Git,
        TaskTag.Accessibility,
        TaskTag.CSS,
        TaskTag.Optimization,
      ],
    });
    const task30 = await this.taskRepository.create(category5.id, {
      title: "Deploy first release",
      slug: "deploy-first-release",
      description: "Deploy the first stable version of the application.",
      order: 6,
      priority: TaskPriority.High,
      dueDate: new Date("2026-10-18T18:00:00.000Z"),
      tags: [TaskTag.Accessibility, TaskTag.Deployment],
    });

    await this.subtaskRepository.create(task4.id, {
      description: "Fix loading-page bug",
      isCompleted: true,
    });
    await this.subtaskRepository.create(task4.id, {
      description: "Give permissions to team members",
      isCompleted: true,
    });
    await this.subtaskRepository.create(task17.id, {
      description: "Normalize database",
      isCompleted: false,
    });
    await this.subtaskRepository.create(task17.id, {
      description: "Compare IA Models",
      isCompleted: false,
    });
    await this.subtaskRepository.create(task17.id, {
      description: "Draw and share DB diagrams",
      isCompleted: false,
    });
    await this.subtaskRepository.create(task29.id, {
      description: "Make backend documentation",
      isCompleted: true,
    });
    await this.subtaskRepository.create(task29.id, {
      description: "Improve server memory",
      isCompleted: false,
    });
    await this.subtaskRepository.create(task29.id, {
      description: "Ask stakeholders",
      isCompleted: false,
    });
    await this.subtaskRepository.create(task8.id, {
      description: "Prepare milestone presentation",
      isCompleted: true,
    });
    await this.subtaskRepository.create(task8.id, {
      description: "Add access keys",
      isCompleted: true,
    });
    await this.subtaskRepository.create(task23.id, {
      description: "Share official enviroment keys",
      isCompleted: false,
    });
    await this.subtaskRepository.create(task23.id, {
      description: "Push latest app version",
      isCompleted: false,
    });
    await this.subtaskRepository.create(task11.id, {
      description: "Merge chatbot new feature",
      isCompleted: false,
    });
    await this.subtaskRepository.create(task11.id, {
      description: "Check trainee's pull requests",
      isCompleted: true,
    });
    await this.subtaskRepository.create(task11.id, {
      description: "Open new ticket",
      isCompleted: false,
    });
    await this.subtaskRepository.create(task2.id, {
      description: "Test login page",
      isCompleted: true,
    });
    await this.subtaskRepository.create(task2.id, {
      description: "Create new github action for semantic versioning",
      isCompleted: true,
    });
    await this.subtaskRepository.create(task2.id, {
      description: "Pull backend image for development",
      isCompleted: true,
    });
    await this.subtaskRepository.create(task2.id, {
      description: "Create app's seeder",
      isCompleted: false,
    });
    await this.subtaskRepository.create(task26.id, {
      description: "Implent connection with discord via webhooks",
      isCompleted: false,
    });
    await this.subtaskRepository.create(task26.id, {
      description: "Create live-time chat funcionatilty",
      isCompleted: false,
    });
    await this.subtaskRepository.create(task26.id, {
      description: "Add entry animations",
      isCompleted: false,
    });
    await this.subtaskRepository.create(task14.id, {
      description: "Complete new capacitation course",
      isCompleted: false,
    });
    await this.subtaskRepository.create(task14.id, {
      description: "Fix technical debt",
      isCompleted: false,
    });
    await this.subtaskRepository.create(task14.id, {
      description: "Migrate database from firebase to postgres",
      isCompleted: false,
    });
  };
}
