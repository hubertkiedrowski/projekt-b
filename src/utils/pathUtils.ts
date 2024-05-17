export interface TopicIdent {
  topicId: string;
}
export interface TrainingIdent extends TopicIdent {
  trainingId: string;
}
export interface QuestionaireIdent extends TrainingIdent {
  questionnaireId: string;
}
export interface QuestionIdent extends QuestionaireIdent {
  questionId: string;
}

export function extractQuestionaiereIdentFromPath(
  path: string
): QuestionaireIdent {
  const pathElements = path.split("/");
  return {
    topicId: pathElements[2],
    trainingId: pathElements[4],
    questionnaireId: pathElements[6],
  };
}

export const pathProgressTopic = ({ topicId }: TopicIdent) =>
  `/progress/topics/${topicId}`;

export const pathProgressTopicTrainings = ({ topicId }: TopicIdent) =>
  `/progress/topics/${topicId}/trainings`;

export const pathProgressTraining = ({ topicId, trainingId }: TrainingIdent) =>
  `/progress/topics/${topicId}/trainings/${trainingId}`;

export const pathProgressQuestionaireQuestions = ({
  topicId,
  trainingId,
  questionnaireId,
}: QuestionaireIdent) =>
  `/progress/topics/${topicId}/trainings/${trainingId}/questionnaires/${questionnaireId}/questions`;

export const pathProgressQuestionaireAnswer = ({
  topicId,
  trainingId,
  questionnaireId,
  questionId,
}: QuestionIdent) =>
  `/progress/topics/${topicId}/trainings/${trainingId}/questionnaires/${questionnaireId}/questions/${questionId}/answers`;
