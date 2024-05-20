import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { QuizApi } from "./QuizApi.ts";

Deno.test("getQuestion should return the actual question data", async () => {
  const apiUser = /* create an instance of ApiUser */;
  const reporter = /* create an instance of Reporter */;
  const timeoutMs = /* set the timeout in milliseconds */;

  const quizApi = new QuizApi(apiUser, reporter, timeoutMs);

  const questionnaireIdent = {
    topicId: "topic1",
    trainingId: "training1",
    questionnaireId: "questionnaire1",
  };

  const actualQuestionData = await quizApi.getQuestion(questionnaireIdent);

  const expectedQuestionData = {
    $ident: {
      ...questionnaireIdent,
      questionId: "actualQuestionId",
    },
    parentId: "actualQuestionId",
    parentText: "Actual question text",
    answers: [
      {
        $ident: {
          ...questionnaireIdent,
          answerId: "answer1",
        },
        id: "answer1",
        text: "Answer 1",
      },
      {
        $ident: {
          ...questionnaireIdent,
          answerId: "answer2",
        },
        id: "answer2",
        text: "Answer 2",
      },
    ],
  };

  assertEquals(actualQuestionData, expectedQuestionData);
});