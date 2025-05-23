export let exampleConfig = {
  url: "https://preview.carely-app.de",
  fetchTimeoutInMs: 10000,
  num_workers: [2, 4],
  createNewWorkers: false,
  allowedDeviationPercent: 20,
  tasks: [
    {
      measureTTFB: {
        num_attempts: 1,
      },
    },
    {
      CheckTrainingTopics: {
        num_attempts: 1,
      },
    },
    {
      CheckSpecificTrainingProgress: {
        topicId: "c6906727-fbd8-419a-809e-4a24de352d0d",
        num_attempts: 1,
      },
    },
    {
      submitQuestionAndMeasureTime: {
        probabilityOfAnsweringWrong: 100,
        num_attempts: 3,
      },
    },
    {
      CheckTrainingTopics: {
        num_attempts: 1,
      },
    },
    {
      measureTTFB: {
        num_attempts: 1,
      },
    },
  ],
  adminUser: {
    login: "undefined",
    password: "undefined",
  },
  users: [
    {
      login: "testUser1",
      password: "XQ92V2v&",
    },
    {
      login: "testUser2",
      password: "XQ92V2v&",
    },
    {
      login: "testUser3",
      password: "XQ92V2v&",
    },
    {
      login: "testUser4",
      password: "XQ92V2v&",
    },
    {
      login: "testUser5",
      password: "XQ92V2v&",
    },
    {
      login: "testUser6",
      password: "XQ92V2v&",
    },
    {
      login: "testUser7",
      password: "XQ92V2v&",
    },
    {
      login: "testUser8",
      password: "XQ92V2v&",
    },
    {
      login: "testUser9",
      password: "XQ92V2v&",
    },
  ],
};
