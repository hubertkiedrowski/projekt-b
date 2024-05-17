// main.ts
import { Reporter } from "./benchmarkReport.ts";
import { Topic } from "./interfaces.ts";
import { createIndividualWorkerConfigs, getDateAndTime } from "./helper.ts";
import { saveToFile } from "./helper.ts";
import {
  createEntryReport,
  loginUsers,
  setTasks,
} from "./utils/benchmarkUtils.ts";
import { ApiUser } from "./api/ApiUser.ts";
import { parseArgs } from "https://deno.land/std@0.223.0/cli/parse_args.ts";
import { Config } from "./config.ts";

const args = parseArgs(Deno.args);

const APIPathToQuestion = args.p;
const dokumentation = args.d;

const configPath = args.c;

export const config: Config = await JSON.parse(
  await Deno.readTextFile(configPath)
);

const dokumentationData: Topic = await JSON.parse(
  await Deno.readTextFile(dokumentation)
);
const configCopies = createIndividualWorkerConfigs(config);

configCopies.map(async (config) => {
  const reporter = new Reporter({
    ...config,
    users: undefined,
  });
  let users: ApiUser[] = [];

  if (!config.createNewWorkers) {
    users = await loginUsers(
      config.users,
      config.url,
      config.fetchTimeoutInMs,
      config.num_workers
    );
  }

  if (config.createNewWorkers) {
    const adminUser = new ApiUser(config.url, config.adminUser.login);

    await adminUser.login(
      config.adminUser.login,
      config.adminUser.password,
      5000
    );
  }
  await setTasks(reporter, config, dokumentationData, APIPathToQuestion, users);
  const report = reporter.outputReport();

  createEntryReport(report);

  saveToFile(
    `outputData/report:${getDateAndTime()}_${report.uuid}.json`,
    JSON.stringify(report, undefined, 3)
  );
});
