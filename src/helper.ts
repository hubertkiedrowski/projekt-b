import { Config } from "./config.ts";

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function saveToFile(filepath: string, data: string) {
  if (!data) {
    console.error("No data to save.");
    return;
  }

  if (!filepath) {
    console.error("No filepath specified.");
    return;
  }

  if (typeof data === "object") {
    data = JSON.stringify(data, undefined, 4);
  }

  Deno.writeTextFileSync(filepath, data);
  console.log(`Data saved to ${filepath}`);
}
export function getDateAndTime() {
  const today = new Date();
  const min = today.getMinutes();
  const hour = today.getHours();

  const isoDate = today.toISOString().slice(0, 10);

  return isoDate + "_" + hour + ":" + min;
}

export const getRandomString = (size: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890";
  const charactersLength = characters.length;
  let password = "";
  for (let i = 0; i < size; ++i) {
    password += characters[Math.floor(Math.random() * charactersLength)];
  }
  return password;
};

export function createIndividualWorkerConfigs(data: Config): Config[] {
  const copies: Config[] = [];

  if (Array.isArray(data.num_workers)) {
    for (const worker of data.num_workers) {
      const configCopy: Config = JSON.parse(JSON.stringify(data));
      configCopy.num_workers = [worker];
      copies.push(configCopy);
    }
  } else {
    console.warn("num_workers ist kein Array.");
  }

  return copies;
}
