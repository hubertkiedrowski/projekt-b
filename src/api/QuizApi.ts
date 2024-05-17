import { Reporter } from "../benchmarkReport.ts";
import { getRandomNumber } from "../helper.ts";
import {
  Answer,
  AnswerFetchedData,
  Question,
  Questionnaire,
  Topic,
} from "../interfaces.ts";
import { config } from "../main.ts";
import {
  QuestionaireIdent,
  extractQuestionaiereIdentFromPath,
  pathProgressTopicTrainings,
} from "../utils/pathUtils.ts";
import { ApiUser } from "./ApiUser.ts";
import * as https from "node:https";

export interface TopicIdent {
  topicId: string;
}
export interface TrainingIdent extends TopicIdent {
  trainingId: string;
}
export interface QuestionnaireIdent extends TrainingIdent {
  questionnaireId: string;
}
export interface QuestionIdent extends QuestionnaireIdent {
  questionId: string;
}
export interface AnswerIdent extends QuestionIdent {
  answerId: string;
}

export type ident = Partial<AnswerIdent>;

const _pathProgressTopic = ({ topicId }: TopicIdent) =>
  `/progress/topics/${topicId}`;

const _pathProgressTopicTrainings = ({ topicId }: TopicIdent) =>
  `/progress/topics/${topicId}/trainings`;

const _pathProgressTraining = ({ topicId, trainingId }: TrainingIdent) =>
  `/progress/topics/${topicId}/trainings/${trainingId}`;

const pathProgressQuestionaireQuestions = ({
  topicId,
  trainingId,
  questionnaireId,
}: QuestionaireIdent) =>
  `/progress/topics/${topicId}/trainings/${trainingId}/questionnaires/${questionnaireId}/questions`;

const pathProgressQuestionaireAnswer = ({
  topicId,
  trainingId,
  questionnaireId,
  questionId,
}: QuestionIdent) => {
  const res = `/progress/topics/${topicId}/trainings/${trainingId}/questionnaires/${questionnaireId}/questions/${questionId}/answers`;
  return res;
};

export type PromiseTimings = {
  startTime?: number | undefined;
  endTime?: number | undefined;
  duration?: number | undefined;
};

export function TimePromise<TData>(toTime: () => Promise<TData>) {
  const timings: PromiseTimings = {};

  const timedPromise = (async () => {
    timings.startTime = Date.now();
    const res = await toTime();
    timings.endTime = Date.now();
    timings.duration = timings.endTime - timings.startTime;
    return res;
  })();

  return {
    promise: timedPromise,
    timings,
  };
}
export class QuizApi {
  constructor(
    private readonly apiUser: ApiUser,
    private readonly reporter: Reporter,
    private timeoutMs: number = config.fetchTimeoutInMs || 9999
  ) {}

  static extractQuestionnaireIdentFromPath(path: string): QuestionnaireIdent {
    const pathElements = path.split("/");
    return {
      topicId: pathElements[2],
      trainingId: pathElements[4],
      questionnaireId: pathElements[6],
    };
  }

  async getQuestion(questionnaireIdent: QuestionaireIdent, timeoutMs?: number) {
    const url = pathProgressQuestionaireQuestions(questionnaireIdent);

    const { promise, timings } = TimePromise(() =>
      this.apiUser.get(url, timeoutMs ?? this.timeoutMs)
    );
    const infoActualQuestion = await promise;
    this.reporter.addMeasurement(this.apiUser.uuid, {
      ident: questionnaireIdent,
      description: "getQuestion",
      timings,
    });

    const responseDataActualQuestionnaire = await infoActualQuestion.json();
    const actualQuestionData = {
      $ident: {
        ...questionnaireIdent,
        questionId: responseDataActualQuestionnaire.id,
      },
      parentId: responseDataActualQuestionnaire.id,
      parentText: responseDataActualQuestionnaire.text,
      answers: responseDataActualQuestionnaire.answers.map(
        (answer: AnswerFetchedData) => ({
          $ident: {
            ...questionnaireIdent,
            answerId: answer.id,
          } as AnswerIdent,
          id: answer.id,
          text: answer.text,
        })
      ),
    };

    return actualQuestionData;
  }

  async getTraininginfoTopics(attempts: number) {
    //TODO check iff attempts work
    while (attempts > 0) {
      const { promise, timings: postTimings } = TimePromise(() =>
        // Timings gathered here
        this.apiUser.get("/progress/topics", this.timeoutMs)
      );

      this.reporter.addMeasurement(this.apiUser.uuid, {
        ident: null!,
        description: "getQuestion info training certificate all users",
        timings: postTimings,
      });

      const _res = await promise;
      attempts--;
    }
  }

  async getTraininginfoSpecificTopic(
    num_attempts: number,
    apiUser: ApiUser,
    topicIdent: TopicIdent,
    timeout: number
  ) {
    //TODO check iff attempts work

    while (num_attempts > 0) {
      const _infoTrainingProgressSpecificTraining = await apiUser.get(
        pathProgressTopicTrainings(topicIdent),
        timeout
      );

      const { promise, timings: postTimings } = TimePromise(() =>
        this.apiUser.get(
          pathProgressTopicTrainings(topicIdent),

          this.timeoutMs
        )
      );
      this.reporter.addMeasurement(this.apiUser.uuid, {
        ident: null!,
        description: "getQuestion info specific training certificate all users",
        timings: postTimings,
      });
      const _res = await promise;
      num_attempts--;
    }
  }

  async measureTTFB(attempts: number): Promise<void> {
    try {
      for (let index = 0; index < attempts; index++) {
        const { promise, timings: ttfbTimings } = TimePromise(async () => {
          const fetchResponse = await fetch(config.url);
          return fetchResponse;
        });
        const _res = await promise;

        this.reporter.addMeasurement(this.apiUser.uuid, {
          ident: null!,
          description: "mesasuring time to first byte",
          timings: ttfbTimings,
        });
      }
    } catch (error) {
      console.error(`Error fetching ${config.url}:`, error);
    }
  }

  async submitQuestion(
    dokumentationdata: Topic,
    attempts: number,
    probabilityWrongAnswerInPercent: number,
    APIPathToQuestion: string
  ) {
    const times: number[] = [];
    const questionaiereIdent =
      extractQuestionaiereIdentFromPath(APIPathToQuestion);

    while (attempts > 0) {
      const randomValue: number = getRandomNumber(0, 101);

      const rightAnswers: string[] = [];

      const fetchedQuestionaireData = await this.getQuestion(
        questionaiereIdent
      );

      dokumentationdata.questionnaires.forEach(
        (questionnaire: Questionnaire) => {
          questionnaire.questions.forEach((question: Question) => {
            if (question.id == fetchedQuestionaireData.parentId) {
              question.answers.forEach((chosableAnswers: Answer) => {
                fetchedQuestionaireData.answers.forEach(
                  (question: AnswerFetchedData) => {
                    if (chosableAnswers.text == question.text) {
                      if (randomValue >= probabilityWrongAnswerInPercent) {
                        if (chosableAnswers.correct) {
                          rightAnswers.push(question.id);
                        }
                      } else {
                        if (!chosableAnswers.correct) {
                          rightAnswers.push(question.id);
                        }
                      }
                    }
                  }
                );
              });
            }
          });
        }
      );

      const { promise, timings: postTimings } = TimePromise(() =>
        this.apiUser.post(
          pathProgressQuestionaireAnswer(fetchedQuestionaireData.$ident),
          rightAnswers,
          this.timeoutMs
        )
      );

      this.reporter.addMeasurement(this.apiUser.uuid, {
        ident: fetchedQuestionaireData.$ident,
        description: "postAnswer",
        timings: postTimings,
      });
      const _res = await promise;

      attempts--;
    }

    return times;
  }
}
