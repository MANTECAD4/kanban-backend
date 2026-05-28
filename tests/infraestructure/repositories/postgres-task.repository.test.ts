import {
  describe,
  beforeAll,
  beforeEach,
  afterAll,
  test,
  expect,
} from "vitest";
import { prisma } from "../../../src/data/init-postgres";
import {
  mockBoardData1,
  mockBoardData2,
  mockTask1,
  mockTask2,
  mockTask3,
  mockUserData1,
} from "../../fixtures";
import { PostgresTaskRepository } from "../../../src/infraestructure/repositories";
import { TaskEntity } from "../../../src/domain/entities";
import { UpdateDataInTaskDto } from "../../../src/application/dtos";

describe("Postgres Task Repository", async () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.task.deleteMany({});
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.board.deleteMany({});
    await prisma.statusColumn.deleteMany({});
    await prisma.$disconnect();
  });

  const { id: userId } = await prisma.user.create({ data: mockUserData1 });
  const { id: boardId } = await prisma.board.create({
    data: { ...mockBoardData1, user_id: userId },
  });
  const { id: columnId1 } = await prisma.statusColumn.create({
    data: { ...mockBoardData1, board_id: boardId },
  });
  const { id: columnId2 } = await prisma.statusColumn.create({
    data: { ...mockBoardData2, board_id: boardId },
  });

  const postgresTaskRepository = new PostgresTaskRepository();

  describe("Success cases", () => {
    test(`'create' returns a task entiity`, async () => {
      const createdTask = await postgresTaskRepository.create(
        columnId1,
        mockTask1,
      );
      expect(createdTask).toBeInstanceOf(TaskEntity);
    });

    test(`'checkRelation' returns a task entity if relation exists`, async () => {
      const { id: taskId } = await postgresTaskRepository.create(
        columnId1,
        mockTask1,
      );
      const relatedTask = await postgresTaskRepository.checkRelation(
        userId,
        taskId,
      );
      expect(relatedTask).toBeInstanceOf(TaskEntity);
    });

    test(`'getAllByStatusColumn' returns an array of tasks`, async () => {
      await postgresTaskRepository.create(columnId1, mockTask1);
      await postgresTaskRepository.create(columnId1, mockTask2);
      await postgresTaskRepository.create(columnId1, mockTask3);

      const tasks =
        await postgresTaskRepository.getAllByStatusColumn(columnId1);

      expect(tasks).toHaveLength(3);
    });

    test(`'getById' returns a task entity`, async () => {
      const { id: taskId } = await postgresTaskRepository.create(
        columnId1,
        mockTask1,
      );

      const taskFound = await postgresTaskRepository.getById(taskId);

      expect(taskFound).toBeInstanceOf(TaskEntity);
    });

    test(`'update' returns a task instance showing applied changes - data change`, async () => {
      const updateData: UpdateDataInTaskDto = {
        description: "some new description",
        title: "new title",
      };
      const { id: taskId } = await postgresTaskRepository.create(
        columnId1,
        mockTask1,
      );
      const updatedTask = await postgresTaskRepository.update(
        taskId,
        updateData,
      );
      expect(updatedTask).toBeInstanceOf(TaskEntity);
      expect(updatedTask).toEqual(expect.objectContaining(updateData));
    });

    test(`'update' returns a task instance showing applied changes - status column change`, async () => {
      const updateData = {
        status_column_id: columnId2,
      };
      const { id: taskId } = await postgresTaskRepository.create(
        columnId1,
        mockTask1,
      );
      const updatedTask = await postgresTaskRepository.update(
        taskId,
        updateData,
      );
      expect(updatedTask).toBeInstanceOf(TaskEntity);
      expect(updatedTask.statusColumnId).toBe(updateData.status_column_id);
    });

    test(`'delete' returns a task instance showing deleted task`, async () => {
      const { id: taskId } = await postgresTaskRepository.create(
        columnId1,
        mockTask1,
      );
      const deletedTask = await postgresTaskRepository.delete(taskId);
      const taskToCheck = await postgresTaskRepository.getById(taskId);
      expect(deletedTask).toBeInstanceOf(TaskEntity);
      expect(taskToCheck).toBeNull();
    });
  });

  describe("Failure cases", () => {
    test(`'checkRelation' returns null if relation doesn't exist`, async () => {
      const { id: taskId } = await postgresTaskRepository.create(
        columnId1,
        mockTask1,
      );
      const relatedTask = await postgresTaskRepository.checkRelation(
        101001,
        taskId,
      );
      expect(relatedTask).toBeNull();
    });

    test(`'getById' returns null inf task doesn't exist`, async () => {
      const taskFound = await postgresTaskRepository.getById(1000);

      expect(taskFound).toBeNull();
    });
  });
});
