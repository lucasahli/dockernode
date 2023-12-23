/*
Redis UserRepository
*/
import {jest} from "@jest/globals";
import {expect} from "@jest/globals";
import {RedisRepository} from "../../../infrastructure/persistence/redis/RedisRepository.js";
import {UserRole} from "../../sharedKernel/index.js";
import {User} from "../../components/reminderContext/domain/entities/index.js";

describe("RedisRepository as UserRepository", () => {
  // RUN DOCKER REDIS to connect to Redis single use database!
  const redisRepository = new RedisRepository(
      `${process.env.REDIS_TEST_HOST}`,
      `${process.env.REDIS_TEST_PORT}`
  );


  test("Can be instanciated", async () => {
    expect(redisRepository).toBeInstanceOf(RedisRepository);
  });

  describe(".addUser", () => {
    test("Returns User if it could be added", async () => {
      expect.assertions(1);
      const existingLogin = await redisRepository.createLogin("usertest@mail.com", "passwordTest", [], [], []);
      const result = await redisRepository.createUser(
          existingLogin.id,
          UserRole.freemium,
          "Manfred Sahli"
      );
      expect(result).toBeInstanceOf(User);
    });

    test("Rejects if it could not be added", async () => {
      // If you expect a promise to be rejected, use the .catch method
      // Make sure to add expect.assertions to verify that a certain number of assertions are called.
      // Otherwise, a fulfilled promise would not fail the test.
      const existingLogin = await redisRepository.getLoginByEmail("usertest@mail.com")
      const existingLoginId = existingLogin !== null ? existingLogin.id : "0"
      return expect(
          redisRepository.createUser(
              existingLoginId,
              UserRole.freemium,
              "Manfred",
              "Sahli"
          )).rejects.toMatch("This Login is already associated with a user of role " + UserRole.freemium.toString());
    });
  });

  describe(".getUserById", () => {
    test("Returns User if it exists", async () => {
      expect.assertions(1);
      const result = await redisRepository.getUserById("1");
      expect(result).toBeInstanceOf(User);
    });

    test("Returns null if it does not exist", async () => {
      return expect(redisRepository.getUserById("5")).resolves.toBeNull();
    });
  });

  describe(".deleteUser", () => {
    test("Resolves true if successful", async () => {
      return expect(redisRepository.deleteUser("1")).resolves.toBeTruthy();
    });

    test("Returns null if it does not exist", async () => {
      return expect(redisRepository.deleteUser("5")).rejects.toMatch("No user found with id: " + "5");
    });
  });

});
