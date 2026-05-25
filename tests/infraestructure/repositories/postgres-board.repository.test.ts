import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
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

describe("Postgres Board Repository", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany({});
    await prisma.board.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const postgresBoardRepository = new PostgresBoardRepository();

  describe("Success cases", () => {
    test(`'create' should return a board entity`, async () => {
      const registeredUser = await prisma.user.create({
        data: { ...mockUserData1 },
      });
      const createdBoard = await postgresBoardRepository.create(
        registeredUser.id,
        mockBoardData1,
      );
      expect(createdBoard).toBeInstanceOf(BoardEntity);
      expect(createdBoard.userId).toBe(registeredUser.id);
    });

    test(`'checkRelationship' returns true if entities are related`, async () => {
      const registeredUser = await prisma.user.create({
        data: { ...mockUserData1 },
      });
      const createdBoard = await postgresBoardRepository.create(
        registeredUser.id,
        mockBoardData1,
      );
      const relationExists = await postgresBoardRepository.checkRelationship(
        registeredUser.id,
        createdBoard.id,
      );
      expect(relationExists).toBe(true);
    });

    test(`'getAll' returns an array of board entities`, async () => {
      const { id: userId } = await prisma.user.create({
        data: { ...mockUserData1 },
      });
      await postgresBoardRepository.create(userId, mockBoardData1);
      await postgresBoardRepository.create(userId, mockBoardData2);
      await postgresBoardRepository.create(userId, mockBoardData3);

      const boards = await postgresBoardRepository.getAll(userId);
      expect(boards).toHaveLength(3);
    });

    test(`'getByUserAndBoardName' returns a board entity if user has a board with specified name in their collection`, async () => {
      const { id: userId } = await prisma.user.create({
        data: { ...mockUserData1 },
      });
      await postgresBoardRepository.create(userId, mockBoardData1);

      const existingBoard = await postgresBoardRepository.getByUserAndBoardName(
        userId,
        mockBoardData1.name,
      );
      expect(existingBoard).toBeInstanceOf(BoardEntity);
    });

    test(`'getById' returns a board entity if id matches`, async () => {
      const { id: userId } = await prisma.user.create({
        data: { ...mockUserData1 },
      });
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
      const { id: userId } = await prisma.user.create({
        data: { ...mockUserData1 },
      });
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
      const { id: userId } = await prisma.user.create({
        data: { ...mockUserData1 },
      });
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
    test(`'checkRelationship' returns false if entities are not related`, async () => {
      const registeredUser = await prisma.user.create({
        data: { ...mockUserData1 },
      });
      const createdBoard = await postgresBoardRepository.create(
        registeredUser.id,
        mockBoardData1,
      );
      const relationExists = await postgresBoardRepository.checkRelationship(
        10100101,
        createdBoard.id,
      );
      expect(relationExists).toBe(false);
    });
    test(`'getByUserAndBoardName' returns null if user doesn't have a board with specified name in their collection`, async () => {
      const { id: userId } = await prisma.user.create({
        data: { ...mockUserData1 },
      });

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
