import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.192.0/testing/asserts.ts";

import { type Config } from "../config.ts";
import {
  createIndividualWorkerConfigs,
  delay,
  getRandomNumber,
  getRandomString,
} from "../helper.ts";
import { exampleConfig } from "./exampleConfig.ts";

Deno.test(
  "getRandomNumber should return a random number within the specified range",
  () => {
    const min = 1;
    const max = 10;
    const randomNumber = getRandomNumber(min, max);
    assertEquals(typeof randomNumber, "number");
    assertEquals(randomNumber >= min && randomNumber <= max, true);
  }
);

Deno.test("delay should resolve after the specified delay", async () => {
  const ms = 1000;
  const start = Date.now();
  await delay(ms);
  const end = Date.now();
  const elapsed = end - start;
  assertEquals(elapsed >= ms, true);
});

Deno.test(
  "getRandomString should return a random string of the specified size",
  () => {
    const size = 10;
    const randomString = getRandomString(size);
    const randomString2 = getRandomString(size);

    assertEquals(typeof randomString, "string");
    assertEquals(randomString.length, size);
    assertNotEquals(randomString2, randomString);
  }
);

Deno.test(
  "createIndividualWorkerConfigs should create individual worker configs",
  () => {
    const data = exampleConfig;
    const individualConfigs = createIndividualWorkerConfigs(data);

    individualConfigs.forEach((config: Config) => {
      const dataNoWorkerEntry = data.num_workers.splice(0, -1);
      const individuialConfigNoWorkerEntry = config.num_workers.splice(0, -1);

      assertEquals(dataNoWorkerEntry, individuialConfigNoWorkerEntry);
    });
  }
);

Deno.test(
  "createIndividualWorkerConfigs should create individual worker configs",
  () => {
    const data = exampleConfig;
    const individualConfigs = createIndividualWorkerConfigs(data);

    assertEquals(Array.isArray(individualConfigs), true);
    assertEquals(individualConfigs.length, data.num_workers.length);
  }
);
