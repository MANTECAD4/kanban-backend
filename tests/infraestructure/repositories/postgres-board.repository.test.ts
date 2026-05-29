import { afterAll, beforeAll, afterEach, describe, expect, test } from "vitest";
import { prisma } from "../../../src/data/init-postgres";
import {
  mockBoardData1,
  mockBoardData2,
  mockBoardData3,
  mockUserData1,
} from "../../fixtures";
import { PostgresBoardRepository } from "../../../src/infraestructure/repositories/postgres-board.repository";
import { BoardEntity } from "../../../src/domain/entities";
import { UpdateBoardDto } from "../../../src/application/dtos";

describe("Postgres Board Repository", async () => {
  let userId: number;
  let postgresBoardRepository: PostgresBoardRepository;

  beforeAll(async () => {
    await prisma.$connect();
    await prisma.user.deleteMany({});
    await prisma.board.deleteMany({});
    const createdUser = await prisma.user.create({
      data: { ...mockUserData1 },
    });
    userId = createdUser.id;
    postgresBoardRepository = new PostgresBoardRepository();
  });

  afterEach(async () => {
    await prisma.board.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("Success cases", () => {
    test(`'create' should return a board entity`, async () => {
      const createdBoard = await postgresBoardRepository.create(
        userId,
        mockBoardData1,
      );
      expect(createdBoard).toBeInstanceOf(BoardEntity);
      expect(createdBoard.userId).toBe(userId);
    });

    test(`'checkRelation' returns true if entities are related`, async () => {
      const createdBoard = await postgresBoardRepository.create(
        userId,
        mockBoardData1,
      );
      const relationExists = await postgresBoardRepository.checkRelation(
        userId,
        createdBoard.id,
      );
      expect(relationExists).toBeInstanceOf(BoardEntity);
    });

    test(`'getAll' returns an array of board entities`, async () => {
      await postgresBoardRepository.create(userId, mockBoardData1);
      await postgresBoardRepository.create(userId, mockBoardData2);
      await postgresBoardRepository.create(userId, mockBoardData3);

      const boards = await postgresBoardRepository.getAll(userId);
      expect(boards).toHaveLength(3);
    });

    test(`'getByUserAndBoardName' returns a board entity if user has a board with specified name in their collection`, async () => {
      await postgresBoardRepository.create(userId, mockBoardData1);

      const existingBoard = await postgresBoardRepository.getByUserAndBoardName(
        userId,
        mockBoardData1.name,
      );
      expect(existingBoard).toBeInstanceOf(BoardEntity);
    });

    test(`'getById' returns a board entity if id matches`, async () => {
      const createdBoard = await postgresBoardRepository.create(
        userId,
        mockBoardData1,
      );
      const boardFound = await postgresBoardRepository.getById(createdBoard.id);
      expect(boardFound).toBeDefined();
      expect(boardFound).toBeInstanceOf(BoardEntity);
      expect(boardFound!.userId).toBe(userId);
    });

    test(`'update' modifies the stored board & returns a board entity showing made changes`, async () => {
      const newData: UpdateBoardDto = { name: "new name uwu" };

      const { id: boardId } = await postgresBoardRepository.create(
        userId,
        mockBoardData1,
      );

      const updatedBoard = await postgresBoardRepository.update(
        boardId,
        newData,
      );
      const boardToCheck = await postgresBoardRepository.getById(boardId);

      expect(updatedBoard).toBeInstanceOf(BoardEntity);
      expect(updatedBoard).toEqual(boardToCheck);
    });

    test(`'delete' returns deleted board entity`, async () => {
      const { id: boardId } = await postgresBoardRepository.create(
        userId,
        mockBoardData1,
      );

      const deletedBoard = await postgresBoardRepository.delete(boardId);
      const boardCheck = await postgresBoardRepository.getById(boardId);

      expect(boardCheck).toBeNull();
      expect(deletedBoard).toEqual({ id: boardId, userId, ...mockBoardData1 });
    });
  });

  describe("Failure cases", () => {
    test(`'checkRelation' returns false if entities are not related`, async () => {
      const createdBoard = await postgresBoardRepository.create(
        userId,
        mockBoardData1,
      );
      const relationExists = await postgresBoardRepository.checkRelation(
        10100101,
        createdBoard.id,
      );
      expect(relationExists).toBeNull();
    });
    test(`'getByUserAndBoardName' returns null if user doesn't have a board with specified name in their collection`, async () => {
      const existingBoard = await postgresBoardRepository.getByUserAndBoardName(
        userId,
        mockBoardData1.name,
      );
      expect(existingBoard).toBeNull();
    });

    test(`'getById' returns null if board doesn't exist`, async () => {
      const fakeId = 101001;
      const boardFound = await postgresBoardRepository.getById(fakeId);
      expect(boardFound).toBeNull();
    });
  });
});
