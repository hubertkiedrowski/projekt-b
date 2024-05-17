import { z as zod } from "https://deno.land/x/zod@v3.22.4/index.ts";

const UserSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  surname: zod.string(),
  login: zod.string(),
  facility: zod.string(),
  roles: zod.any(),
});
export type User = zod.infer<typeof UserSchema>;
export interface LoginResponse {
  token: string;
  user: User;
}

const TranslationSchema = zod.object({
  text: zod.string(),
});

const AnswerSchema = zod.object({
  text: zod.string(),
  correct: zod.boolean(),
  translations: zod.record(TranslationSchema),
});

export type Answer = zod.infer<typeof AnswerSchema>;

const QuestionSchema = zod.object({
  id: zod.string(),
  text: zod.string(),
  explanation: zod.string(),
  media: zod.any(),
  hint: zod.any(),
  answers: AnswerSchema.array(),
  translations: zod.any(),
});

export type Question = zod.infer<typeof QuestionSchema>;

const QuestionOrAnySchema = zod.union([QuestionSchema, zod.any()]); // TODO: Brauchen wir das wirklich?

const QuestionnaireSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  qualification_ids: zod.any(),
  questions: QuestionOrAnySchema.array(),
  translations: zod.any(),
  points: zod.number(),
  time: zod.number(),
  link: zod.string(),
});
export type Questionnaire = zod.infer<typeof QuestionnaireSchema>;

const TopicSchema = zod.object({
  id: zod.string(),
  topic_id: zod.string(),
  name: zod.string(),
  icon: zod.string(),
  valid_for: zod.string(),
  questionnaires: QuestionnaireSchema.array(),
});
export type Topic = zod.infer<typeof TopicSchema>;

export interface FetchedQuestionData {
  parentId: string;
  parentText: string;
  answers: AnswerFetchedData[];
}

export interface AnswerFetchedData {
  id: string;
  text: string;
}
