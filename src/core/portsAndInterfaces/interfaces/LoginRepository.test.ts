/*
Redis LoginRepository
*/
import {jest} from "@jest/globals";
import {RedisRepository} from "../../../infrastructure/persistence/redis/RedisRepository.js";
import {Login} from "../../components/reminderContext/domain/entities/index.js";

describe("RedisRepository as LoginRepository", () => {
  // RUN DOCKER COMPOSE DEV to connect to Redis single use database!
  const redisRepository = new RedisRepository(
    `${process.env.REDIS_TEST_HOST}`,
    `${process.env.REDIS_TEST_PORT}`
  );

  test("Can be instanciated", async () => {
    expect(redisRepository).toBeInstanceOf(RedisRepository);
  });

  describe(".addLogin", () => {
    test("Returns Login if it could be added", async () => {
      expect.assertions(1);
      const result = await redisRepository.createLogin(
        "test@mail.com",
        "passwordTest",
        []
      );
      expect(result).toBeInstanceOf(Login);
    });

    test("Throws if it could not be added", async () => {
      // If you expect a promise to be rejected, use the .catch method
      // Make sure to add expect.assertions to verify that a certain number of assertions are called.
      // Otherwise, a fulfilled promise would not fail the test.
      return expect(
        redisRepository.createLogin("test@mail.com", "passwordTest", [])
      ).rejects.toMatch("Login with that email already exists!");
    });
  });

  describe(".getLoginById", () => {
    test("Returns Login if it exists", async () => {
      expect.assertions(1);
      const result = await redisRepository.getLoginById("1");
      expect(result).toBeInstanceOf(Login);
    });

    test("Returns null if it does not exist", async () => {
      return expect(redisRepository.getLoginById("5")).resolves.toBeNull();
    });
  });
});
