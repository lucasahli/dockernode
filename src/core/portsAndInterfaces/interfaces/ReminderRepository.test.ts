/*
Redis ReminderRepository
*/
import {jest} from "@jest/globals";
import {expect} from "@jest/globals";
import {RedisRepository} from "../../../infrastructure/persistence/redis/RedisRepository.js";
import {Reminder} from "../../components/reminderContext/domain/entities/index.js";

describe("RedisRepository as ReminderRepository", () => {
    // RUN DOCKER REDIS to connect to Redis single use database!
    const redisRepository = new RedisRepository(
        `${process.env.REDIS_TEST_HOST}`,
        `${process.env.REDIS_TEST_PORT}`
    );


    test("Can be instanciated", async () => {
        expect(redisRepository).toBeInstanceOf(RedisRepository);
    });

    describe(".addReminder", () => {
        test("Returns added Reminder if it could be added", async () => {
            return expect(redisRepository.addReminder("Reminder Title", "1", ["1"], false, new Date(Date.now() + 15 * 60 * 1000), undefined)).resolves.toBeInstanceOf(Reminder);
        });
    });

    describe(".getReminderById", () => {
        test("Returns Reminder if it exists", async () => {
            const reminderToGet = await redisRepository.addReminder("Reminder Title", "8", ["8"], false, new Date(Date.now() + 15 * 60 * 1000), undefined)
            return expect(redisRepository.getReminderById(reminderToGet.id)).resolves.toBeInstanceOf(Reminder);
        });

        test("Returns null if it does not exist", async () => {
            return expect(redisRepository.getReminderById("5")).resolves.toBeNull();
        });
    });

    describe(".deleteReminder", () => {
        test("Resolves true if successful", async () => {
            const addedReminder = await redisRepository.addReminder("Reminder To Delete", "1", ["1"], false, new Date(Date.now() + 15 * 60 * 1000), undefined);
            //TODO fix this test
            console.log("Added Reminder Id: ", addedReminder.id);
            return expect(redisRepository.deleteReminder(addedReminder.id)).resolves.toBeTruthy();
        });

        test("Rejects if it does not exist", async () => {
            return expect(redisRepository.deleteReminder("5")).rejects.toMatch("No reminderData found with id: " + "5");
        });
    });

    describe(".getRemindersByOwnerId", () => {
        test("Returns Reminders array if user owns some", async () => {
            await redisRepository.addReminder("ReminderTitle01", "3", ["3"], false, new Date(Date.now() + 15 * 60 * 1000), undefined);
            await redisRepository.addReminder("ReminderTitle02", "3", ["3"], false, new Date(Date.now() + 15 * 60 * 1000), undefined);
            await redisRepository.addReminder("ReminderTitle03", "3", ["3"], false, new Date(Date.now() + 15 * 60 * 1000), undefined);
            await redisRepository.addReminder("ReminderTitle04", "3", ["3"], false, new Date(Date.now() + 15 * 60 * 1000), undefined);
            return expect(redisRepository.getReminderIdsByOwnerId("3")).resolves.toHaveLength(4);
        });

        test("Returns null if it does not exist", async () => {
            return expect(redisRepository.getReminderIdsByOwnerId("5")).resolves.toStrictEqual([]);
        });
    });

});
