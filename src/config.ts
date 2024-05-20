import z from "https://deno.land/x/zod@v3.22.4/index.ts";

export const UserSchema = z.object({
  login: z.string(),
  password: z.string(),
});

export type LoginUser = z.infer<typeof UserSchema>;

export const TaskSchema = z.array(
  z.union([
    z.object({
      CheckSpecificTrainingProgress: z.object({
        topicId: z.string(),
        num_attempts: z.number(),
      }),
    }),
    z.object({
      submitQuestionAndMeasureTime: z.object({
        probabilityOfAnsweringWrong: z.number(),
        num_attempts: z.number(),
      }),
    }),
    z.object({
      CheckTrainingTopics: z.object({
        num_attempts: z.number(),
      }),
    }),
    z.object({
      measureTTFB: z.object({
        num_attempts: z.number(),
      }),
    }),
  ])
);

export type Tasks = z.infer<typeof TaskSchema>;

export const ConfigSchema = z.object({
  url: z.string(),
  num_workers: z.array(z.number()),
  fetchTimeoutInMs: z.number(),
  tasks: TaskSchema,
  users: UserSchema.array(),
  adminUser: UserSchema,
  createNewWorkers: z.boolean(),
  allowedDeviationPercent: z.number(),
});

export type Config = z.infer<typeof ConfigSchema>;

export function parseConfig(configPath: string) {
  const fileContent = Deno.readTextFileSync(configPath);
  const configJson = JSON.parse(fileContent);
  const config = ConfigSchema.parse(configJson);
  return config;
}
