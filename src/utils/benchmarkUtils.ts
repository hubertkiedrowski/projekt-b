import { ApiUser } from "../api/ApiUser.ts";
import { PromiseTimings, QuizApi } from "../api/QuizApi.ts";
import { BenchmarkReport } from "../benchmarkReport.ts";
import { Config, LoginUser } from "../config.ts";
import { Topic } from "../interfaces.ts";
import { Reporter } from "../benchmarkReport.ts";

export async function loginUsers(
  users: LoginUser[],
  url: string,
  fetchTimeoutInMs: number,
  numWorkers: number[]
): Promise<ApiUser[]> {
  const apiUsers: ApiUser[] = [];
  let loggedInUsers = 0;

  for (const user of users) {
    if (loggedInUsers >= numWorkers[0]) {
      break;
    }

    const apiUser = new ApiUser(url, user.login);

    try {
      await apiUser.login(user.login, user.password, fetchTimeoutInMs);
      apiUsers.push(apiUser);

      loggedInUsers++;
    } catch (error) {
      console.error(`Error logging in user ${user.login}:`, error);
    }
  }

  return apiUsers;
}

/**
 * Creates an entry report based on the provided benchmark report.
 * @param report - The benchmark report containing the results.
 */
export function createEntryReport(report: BenchmarkReport) {
  const perDescription: {
    [description: string]: undefined | Array<PromiseTimings>;
  } = {};
  const entries = Object.entries(report.results);
  entries.forEach(([_apiUserId, apiUserLog]) => {
    apiUserLog?.forEach((timeMeasurement) => {
      const entries = perDescription[timeMeasurement.description];
      if (entries == undefined) {
        perDescription[timeMeasurement.description] = [timeMeasurement.timings];
      } else {
        entries.push(timeMeasurement.timings);
      }
    });
  });
}

/**
 * Creates a new user using the provided admin user credentials.
 * @param adminUser - The admin user object used for authentication.
 * @param name - The name of the new user.
 * @param surname - The surname of the new user.
 * @param loginCredentials - The login credentials for the new user.
 */
// export async function createUser(
//   adminUser: ApiUser,
//   name: string,
//   surname: string,
//   loginCredentials: string
// ) {
//   try {
//     const response = await adminUser.post(
//       "/auth/admin/users",
//       {
//         name: name,
//         surname: surname,
//         salutation: "-",
//         login: loginCredentials,
//         password: "Passwort14!",
//         roles: ["employee"],
//         facility: null,
//         activities: ["1", "2", "3", "4", "5"],
//         qualifications: ["3", "2", "1"],
//       },
//       5000
//     );
//     const responseJson = await response.json();

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const payload = {
//       id: "",
//       topics: [
//         {
//           topic_id: "68126602-156b-464b-b188-edd32ecfee48",
//           trainings: [
//             { training_id: "21" },
//             { training_id: "dd760753-438c-4673-b7a7-1a177e34fa43" },
//             { training_id: "5" },
//             { training_id: "19" },
//             { training_id: "6" },
//             { training_id: "22" },
//             { training_id: "20" },
//           ],
//         },
//         {
//           topic_id: "59a9b42d-cae1-42ba-9904-c6b144f9d192",
//           trainings: [
//             { training_id: "5ad0be2b-2f72-4e38-a87b-a0dbd7e5c009" },
//             { training_id: "a9c754ea-72db-46af-a415-95936d870912" },
//             { training_id: "75265408-a462-40bb-bd8a-7c62d2fe4aa4" },
//             { training_id: "fec8c1f6-cd16-4f04-9e54-c2c1094d671a" },
//             { training_id: "68c0e961-53b1-45a8-9abe-4e2539a5036a" },
//           ],
//         },
//       ],
//       user_id: responseJson.id,
//     };

//     await adminUser.post("/filter/admin/trainingsmatrix", payload, 5000);

//     return { loginCredentials: loginCredentials, password: "Passwort14!" };
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }
//TODO username entsprichte auch den run
export async function setTasks(
  reporter: Reporter,
  config: Config,
  dokumentationData: Topic,
  APIPathToQuestion: string,
  users: ApiUser[]
  // adminUser?: ApiUser
) {
  // let userCreated = true;
  // if (config.createNewWorkers && userCreated) {
  //   // for (let i = 0; i < config.num_workers[0]; i++) {
  //   //   const report = reporter.outputReport();
  //   //   // const generatedUsers = await createUser(
  //   //   //   adminUser!,
  //   //   //   "SURNAME IS UUID OF TESTRUN PERFORMANCETEST",
  //   //   //   report.uuid,
  //   //   //   `${report.uuid}-${i}`
  //   //   // );
  //   //   if (generatedUsers) {
  //   //     const newApiUser: ApiUser = new ApiUser(
  //   //       config.url,
  //   //       generatedUsers.loginCredentials
  //   //     );
  //   //     try {
  //   //       await newApiUser.login(
  //   //         generatedUsers.loginCredentials,
  //   //         generatedUsers.password,
  //   //         config.fetchTimeoutInMs
  //   //       );
  //   //       users.push(newApiUser);
  //   //       userCreated = false;
  //   //     } catch (error) {
  //   //       console.error("Failed to log in user:", error);
  //   //       // Handle error appropriately, e.g., retry, log, or throw
  //   //     }
  //   //   } else {
  //   //     throw new Error("Failed to generate users.");
  //   //   }
  //   // }
  // }
  await Promise.all(
    config.tasks.map(async (task) => {
      if ("measureTTFB" in task) {
        const { num_attempts } = task.measureTTFB;
        await Promise.all(
          users.map(async (apiUser) => {
            const quizApi = new QuizApi(apiUser, reporter);
            await quizApi.measureTTFB(num_attempts);
          })
        );
      } else if ("CheckSpecificTrainingProgress" in task) {
        const { topicId, num_attempts } = task.CheckSpecificTrainingProgress;

        await Promise.all(
          users.map(async (apiUser) => {
            const quizApi = new QuizApi(apiUser, reporter);

            await quizApi.getTraininginfoSpecificTopic(
              num_attempts,
              apiUser,
              { topicId: topicId },
              config.fetchTimeoutInMs
            );
          })
        );
      } else if ("submitQuestionAndMeasureTime" in task) {
        const { probabilityOfAnsweringWrong, num_attempts } =
          task.submitQuestionAndMeasureTime;

        await Promise.all(
          users.map(async (apiUser) => {
            const quizApi = new QuizApi(apiUser, reporter);

            await quizApi.submitQuestion(
              dokumentationData,
              num_attempts,
              probabilityOfAnsweringWrong,
              APIPathToQuestion
            );
          })
        );
      } else if ("CheckTrainingTopics" in task) {
        const { num_attempts } = task.CheckTrainingTopics;

        await Promise.all(
          users.map(async (apiUser) => {
            const quizApi = new QuizApi(apiUser, reporter);

            await quizApi.getTraininginfoTopics(num_attempts);
          })
        );
      }
    })
  );

  console.log("Alle Aufgaben abgeschlossen");
}
