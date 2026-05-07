import { afterEach, describe, expect, test, vi } from "vitest";
import { envs } from "../../src/configs/envs";

describe("Envs adapter & checker", () => {
  afterEach(() => vi.clearAllMocks());
  //   describe("SUCCESS CASES", () => {
  test("should return an object containing all env variables correctly coerced", () => {
    const envVariables = envs();
    expect(envVariables).toMatchObject({
      PORT: expect.any(Number),
      POSTGRES_URL: expect.any(String),
      TOKEN_SECRET: expect.any(String),
      ACCESS_TOKEN_DURATION: expect.any(Number),
      REFRESH_TOKEN_DURATION: expect.any(Number),
    });
  });
  // });
});
