import { describe, expect, test } from "vitest";
import { BoardEntity } from "../../../src/domain/entities/board.entity";

describe("Board Entity", () => {
  test('should have a "fromObject" method that takes an object & returns an instance', () => {
    const testObject = {
      id: 1,
      name: "test name uuw",
      description: "test description uwu",
      user_id: 1, // Asigns user_id to userId
    };
    const boardInstance = BoardEntity.fromObject(testObject);
    expect(boardInstance).toBeInstanceOf(BoardEntity);
    expect(boardInstance).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      userId: expect.any(Number),
    });
  });
});
