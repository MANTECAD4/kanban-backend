import { afterAll, beforeAll, afterEach, describe, expect, test } from "vitest";
import { prisma } from "../../../src/data/init-postgres";
import {
  mockBoardData1,
  mockStatusColumnData1,
  mockStatusColumnData2,
  mockStatusColumnData3,
  mockUserData1,
} from "../../fixtures";
import { PostgresStatusColumnRepository } from "../../../src/infraestructure/repositories";
import { StatusColumnEntity } from "../../../src/domain/entities";
import { UpdateStatusColumnDto } from "../../../src/application/dtos";

describe(`Status Column Repository`, async () => {
  let userId: number;
  let boardId: number;

  let postgresStatusColumnRepository: PostgresStatusColumnRepository;

  beforeAll(async () => {
    await prisma.$connect();
    await prisma.statusColumn.deleteMany({});
    await prisma.board.deleteMany({});
    await prisma.user.deleteMany({});

    postgresStatusColumnRepository = new PostgresStatusColumnRepository();

    const createdUser = await prisma.user.create({
      data: { ...mockUserData1 },
    });

    userId = createdUser.id;

    const createdBoard = await prisma.board.create({
      data: { user_id: userId, ...mockBoardData1 },
    });
    boardId = createdBoard.id;
  });

  afterEach(async () => {
    await prisma.statusColumn.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("Success cases", () => {
    test(`'create' returns a status column entity`, async () => {
      const createdStatusColumn = await postgresStatusColumnRepository.create(
        boardId,
        mockStatusColumnData1,
      );
      expect(createdStatusColumn).toBeInstanceOf(StatusColumnEntity);
    });

    test(`'checkRelation' returns a status column entity if relation between entities exist`, async () => {
      const { id: columnId } = await postgresStatusColumnRepository.create(
        boardId,
        mockStatusColumnData1,
      );
      const existRelation = await postgresStatusColumnRepository.checkRelation(
        userId,
        columnId,
      );
      expect(existRelation).toBeInstanceOf(StatusColumnEntity);
    });

    test(`'getAll' returns an array of cstatus column entities`, async () => {
      await postgresStatusColumnRepository.create(
        boardId,
        mockStatusColumnData1,
      );

      await postgresStatusColumnRepository.create(
        boardId,
        mockStatusColumnData2,
      );

      await postgresStatusColumnRepository.create(
        boardId,
        mockStatusColumnData3,
      );

      const columns = await postgresStatusColumnRepository.getAll(boardId);

      expect(columns).toHaveLength(3);
    });

    test(`'getById' returns a status column entity`, async () => {
      const { id: columnId } = await postgresStatusColumnRepository.create(
        boardId,
        mockStatusColumnData1,
      );
      const columnFound =
        await postgresStatusColumnRepository.getById(columnId);
      expect(columnFound).toBeInstanceOf(StatusColumnEntity);
    });

    test(`'getByBoardAndName' returns a status column entity`, async () => {
      const { name: columnName } = await postgresStatusColumnRepository.create(
        boardId,
        mockStatusColumnData1,
      );
      const columnFound =
        await postgresStatusColumnRepository.getByBoardAndName(
          boardId,
          columnName,
        );
      expect(columnFound).toBeInstanceOf(StatusColumnEntity);
    });

    test(`'update' returns a status column instance, showing applied changes`, async () => {
      const updateData: UpdateStatusColumnDto = {
        description: "some new description",
        name: "new name ou yeah",
      };
      const { id: columnId } = await postgresStatusColumnRepository.create(
        boardId,
        mockStatusColumnData1,
      );

      const updatedColumn = await postgresStatusColumnRepository.update(
        columnId,
        updateData,
      );

      expect(updatedColumn).toBeInstanceOf(StatusColumnEntity);
      expect(updatedColumn).toEqual(expect.objectContaining(updateData));
    });

    test(`'delete' returns a status column instace, corresponding to the deleted column`, async () => {
      const { id: columnId } = await postgresStatusColumnRepository.create(
        boardId,
        mockStatusColumnData1,
      );

      const deletedColumn =
        await postgresStatusColumnRepository.delete(columnId);
      const columnToCheck =
        await postgresStatusColumnRepository.getById(columnId);
      expect(deletedColumn).toBeInstanceOf(StatusColumnEntity);
      expect(deletedColumn.id).toBe(columnId);
      expect(columnToCheck).toBeNull();
    });
  });

  describe("Failure cases", () => {
    test(`'checkRelation' returns null if there's no relation between entities`, async () => {
      const { id: columnId } = await postgresStatusColumnRepository.create(
        boardId,
        mockStatusColumnData1,
      );

      const existRelation = await postgresStatusColumnRepository.checkRelation(
        101010,
        columnId,
      );
      expect(existRelation).toBeNull();
    });

    test(`'getById' returns null if column doesn't exist`, async () => {
      const columnFound = await postgresStatusColumnRepository.getById(101010);
      expect(columnFound).toBeNull();
    });

    test(`'getByBoardAndName' returns null if the board doesn't have a status column with that name`, async () => {
      const columnFound =
        await postgresStatusColumnRepository.getByBoardAndName(
          101010,
          "column that does not exist",
        );
      expect(columnFound).toBeNull();
    });
  });
});
