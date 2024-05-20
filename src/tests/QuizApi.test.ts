import { assertFalse } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { exampleConfig } from "./exampleConfig.ts";
import { ApiUser } from "../api/ApiUser.ts";
import { Reporter } from "../benchmarkReport.ts";
import { extractQuestionaiereIdentFromPath } from "../utils/pathUtils.ts";
import {
  Questionnaire,
  Question,
  Answer,
  AnswerFetchedData,
} from "../interfaces.ts";
import { dokumentationData } from "./dokumentation.ts";
import { QuizApi } from "../api/QuizApi.ts";

Deno.test("getQuestion should return the actual question data", async () => {
  const apiUser = new ApiUser(exampleConfig.url, exampleConfig.users[0].login);
  const timeoutMs = exampleConfig.fetchTimeoutInMs;

  await apiUser.login(
    exampleConfig.users[0].login,
    exampleConfig.users[0].password,
    timeoutMs
  );
  const reporter = new Reporter({
    ...exampleConfig,
    users: undefined,
  });

  const quizApi = new QuizApi(apiUser, reporter, timeoutMs);

  const apiPathToQuestion =
    "progress/topics/c6906727-fbd8-419a-809e-4a24de352d0d/trainings/26408628-a743-4f28-9d36-e4f7b4bcf636/questionnaires/4ec93c9d-53ac-4769-9ec0-d1c7220ed0c7/questions";
  const questionaiereIdent =
    extractQuestionaiereIdentFromPath(apiPathToQuestion);

  const fetchedQuestionaireData = await quizApi.getQuestion(questionaiereIdent);

  dokumentationData.questionnaires.forEach((questionnaire: Questionnaire) => {
    questionnaire.questions.forEach((question: Question) => {
      if (question.id == fetchedQuestionaireData.parentId) {
        question.answers.forEach((chosableAnswers: Answer) => {
          fetchedQuestionaireData.answers.forEach(
            (answer: AnswerFetchedData) => {
              if (chosableAnswers.text == answer.text) {
                assertFalse(false);
              }
            }
          );
        });
      }
    });
  });
});
