import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { prisma } from "../../../src/data/init-postgres";
import { PostgresSubtaskRepository } from "../../../src/infraestructure/repositories/postgres-subtask.repository";
import {
  mockUserData1,
  mockBoardData1,
  mockStatusColumnData1,
  mockTask1,
  mockSubtask1,
  mockSubtask3,
  mockSubtask2,
} from "../../fixtures";
import { SubtaskEntity } from "../../../src/domain/entities/subtask.entity";
import { UpdateSubtaskDto } from "../../../src/application/dtos";

describe("Subtask Repository", async () => {
  beforeAll(async () => {
    await prisma.$connect();
  });
  beforeEach(async () => {
    await prisma.subtasks.deleteMany({});
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.board.deleteMany({});
    await prisma.statusColumn.deleteMany({});
    await prisma.task.deleteMany({});
  });

  const { id: userId } = await prisma.user.create({ data: mockUserData1 });
  const { id: boardId } = await prisma.board.create({
    data: { ...mockBoardData1, user_id: userId },
  });
  const { id: columnId } = await prisma.statusColumn.create({
    data: { ...mockStatusColumnData1, board_id: boardId },
  });
  const { id: taskId } = await prisma.task.create({
    data: { ...mockTask1, status_column_id: columnId },
  });

  const postgresSubtaskRepository = new PostgresSubtaskRepository();

  describe("Success cases", () => {
    test(`'create' returns a subtask entity`, async () => {
      const createdSubtask = await postgresSubtaskRepository.create(
        taskId,
        mockSubtask1,
      );
      expect(createdSubtask).toBeInstanceOf(SubtaskEntity);
      expect(createdSubtask.isCompleted).toBe(false);
    });

    test(`'checkRelation' checks that there's a relation bewtween user & subtask`, async () => {
      const { id: subtaskId } = await postgresSubtaskRepository.create(
        taskId,
        mockSubtask1,
      );

      const relatedSubastk = await postgresSubtaskRepository.checkRelation(
        userId,
        subtaskId,
      );

      expect(relatedSubastk).toBeInstanceOf(SubtaskEntity);
    });

    test(`'getAllByTask' returns an array of subtask entities`, async () => {
      await postgresSubtaskRepository.create(taskId, mockSubtask1);
      await postgresSubtaskRepository.create(taskId, mockSubtask2);
      await postgresSubtaskRepository.create(taskId, mockSubtask3);

      const subtasks = await postgresSubtaskRepository.getAllByTask(taskId);

      expect(subtasks).toHaveLength(3);

      subtasks.forEach((subtask) =>
        expect(subtask).toBeInstanceOf(SubtaskEntity),
      );
    });

    test(`'getById' returns a subtask entity`, async () => {
      const { id: subtaskId } = await postgresSubtaskRepository.create(
        taskId,
        mockSubtask1,
      );

      const subtaskFound = await postgresSubtaskRepository.getById(subtaskId);
      expect(subtaskFound).toBeInstanceOf(SubtaskEntity);
    });

    test(`'update' returns a subtask entity showing applied changes`, async () => {
      const updateData: UpdateSubtaskDto = {
        description: "new description for thsi subtask",
        isCompleted: true,
      };

      const { id: subtaskId } = await postgresSubtaskRepository.create(
        taskId,
        mockSubtask1,
      );
      const updatedSubtask = await postgresSubtaskRepository.update(
        subtaskId,
        updateData,
      );

      expect(updatedSubtask).toBeInstanceOf(SubtaskEntity);
      expect(updatedSubtask).toEqual(expect.objectContaining(updateData));
    });

    test(`'delete' returns a subtask entity instace showing deleted subtask`, async () => {
      const { id: subtaskId } = await postgresSubtaskRepository.create(
        taskId,
        mockSubtask1,
      );
      const deletedSubtask = await postgresSubtaskRepository.delete(subtaskId);

      const subtaskToCheck = await postgresSubtaskRepository.getById(subtaskId);
      expect(deletedSubtask).toBeInstanceOf(SubtaskEntity);
      expect(subtaskToCheck).toBeNull();
    });
  });

  describe("Failure cases", () => {
    test(`'checkRelation' returns null if relation between user & subtask doesn't exist`, async () => {
      const { id: subtaskId } = await postgresSubtaskRepository.create(
        taskId,
        mockSubtask1,
      );

      const relatedSubastk = await postgresSubtaskRepository.checkRelation(
        -1,
        subtaskId,
      );

      expect(relatedSubastk).toBeNull();
    });

    test(`'getById' returns null`, async () => {
      const subtaskFound = await postgresSubtaskRepository.getById(-1);
      expect(subtaskFound).toBeNull();
    });
  });
});
