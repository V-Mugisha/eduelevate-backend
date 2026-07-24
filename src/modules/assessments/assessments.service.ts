import type {
  CreateAssessmentInput,
  UpdateAssessmentInput,
  CreateQuestionInput,
  UpdateQuestionInput,
  SubmitAssessmentInput,
} from "./assessments.dto.js";
import * as assessmentsRepository from "./assessments.repository.js";

async function authorizeLessonOwner(lessonId: string, userId: string, userRole?: string) {
  if (userRole === "admin") return;
  const lesson = await assessmentsRepository.findLessonOwner(lessonId);
  if (!lesson) throw new ServiceError("Lesson not found", 404);
  if (lesson.module.course.createdBy !== userId) throw new ServiceError("Not authorized", 403);
}

export async function getAssessment(lessonId: string) {
  const assessment = await assessmentsRepository.findAssessmentByLessonId(lessonId);
  return assessment;
}

export async function createAssessment(
  data: CreateAssessmentInput,
  lessonId: string,
  userId: string,
  userRole?: string,
) {
  await authorizeLessonOwner(lessonId, userId, userRole);
  const existing = await assessmentsRepository.findAssessmentByLessonId(lessonId);
  if (existing) throw new ServiceError("An assessment already exists for this lesson", 409);
  return assessmentsRepository.createAssessment(lessonId, data);
}

export async function updateAssessment(
  id: string,
  data: UpdateAssessmentInput,
  userId: string,
  userRole?: string,
) {
  const assessment = await assessmentsRepository.findAssessmentById(id);
  if (!assessment) throw new ServiceError("Assessment not found", 404);
  await authorizeLessonOwner(assessment.lessonId, userId, userRole);
  return assessmentsRepository.updateAssessment(id, data);
}

export async function removeAssessment(id: string, userId: string, userRole?: string) {
  const assessment = await assessmentsRepository.findAssessmentById(id);
  if (!assessment) throw new ServiceError("Assessment not found", 404);
  await authorizeLessonOwner(assessment.lessonId, userId, userRole);
  return assessmentsRepository.deleteAssessment(id);
}

export async function createQuestion(
  data: CreateQuestionInput,
  assessmentId: string,
  userId: string,
  userRole?: string,
) {
  const assessment = await assessmentsRepository.findAssessmentById(assessmentId);
  if (!assessment) throw new ServiceError("Assessment not found", 404);
  await authorizeLessonOwner(assessment.lessonId, userId, userRole);

  const invalid = data.correctAnswers.filter((a) => !data.answerOptions.includes(a));
  if (invalid.length > 0)
    throw new ServiceError(`Correct answers must be valid options: ${invalid.join(", ")}`, 400);

  const count = await assessmentsRepository.countQuestionsByAssessment(assessmentId);
  return assessmentsRepository.createQuestion(assessmentId, data, count);
}

export async function updateQuestion(
  id: string,
  data: UpdateQuestionInput,
  userId: string,
  userRole?: string,
) {
  const question = await assessmentsRepository.findQuestionById(id);
  if (!question) throw new ServiceError("Question not found", 404);

  const assessment = await assessmentsRepository.findAssessmentById(question.assessmentId);
  if (!assessment) throw new ServiceError("Assessment not found", 404);
  await authorizeLessonOwner(assessment.lessonId, userId, userRole);

  const answerOptions = data.answerOptions ?? question.answerOptions;
  const correctAnswers = data.correctAnswers ?? question.correctAnswers;
  const invalid = correctAnswers.filter((a) => !answerOptions.includes(a));
  if (invalid.length > 0)
    throw new ServiceError(`Correct answers must be valid options: ${invalid.join(", ")}`, 400);

  return assessmentsRepository.updateQuestion(id, data);
}

export async function removeQuestion(id: string, userId: string, userRole?: string) {
  const question = await assessmentsRepository.findQuestionById(id);
  if (!question) throw new ServiceError("Question not found", 404);

  const assessment = await assessmentsRepository.findAssessmentById(question.assessmentId);
  if (!assessment) throw new ServiceError("Assessment not found", 404);
  await authorizeLessonOwner(assessment.lessonId, userId, userRole);

  return assessmentsRepository.deleteQuestion(id);
}

export async function getQuestionsForStudent(assessmentId: string, userId: string) {
  const assessment = await assessmentsRepository.findAssessmentById(assessmentId);
  if (!assessment) throw new ServiceError("Assessment not found", 404);

  const enrollment = await assessmentsRepository.findEnrollmentForLesson(
    userId,
    assessment.lessonId,
  );
  if (!enrollment) throw new ServiceError("Not enrolled in this course", 403);

  const questions = await assessmentsRepository.findQuestionsByAssessmentForStudent(assessmentId);
  const submissions = await assessmentsRepository.findUserSubmissionsForAssessment(
    userId,
    assessmentId,
  );
  const submittedIds = new Set(submissions.map((s) => s.questionId));

  return questions.map((q) => ({
    ...q,
    isSubmitted: submittedIds.has(q.id),
  }));
}

export async function getQuestionsForOwner(
  assessmentId: string,
  userId: string,
  userRole?: string,
) {
  const assessment = await assessmentsRepository.findAssessmentById(assessmentId);
  if (!assessment) throw new ServiceError("Assessment not found", 404);
  await authorizeLessonOwner(assessment.lessonId, userId, userRole);
  return assessmentsRepository.findQuestionsByAssessment(assessmentId);
}

export async function submitAssessment(
  data: SubmitAssessmentInput,
  assessmentId: string,
  userId: string,
) {
  const assessment = await assessmentsRepository.findAssessmentById(assessmentId);
  if (!assessment) throw new ServiceError("Assessment not found", 404);

  const enrollment = await assessmentsRepository.findEnrollmentForLesson(
    userId,
    assessment.lessonId,
  );
  if (!enrollment) throw new ServiceError("Not enrolled in this course", 403);

  const questionIds = data.answers.map((a) => a.questionId);
  const questions = await Promise.all(
    questionIds.map((id) => assessmentsRepository.findQuestionById(id)),
  );

  for (const q of questions) {
    if (!q || q.assessmentId !== assessmentId)
      throw new ServiceError(
        `Question ${q?.id ?? "unknown"} does not belong to this assessment`,
        400,
      );
  }

  const existingSubmissions = await assessmentsRepository.findUserSubmissionsForAssessment(
    userId,
    assessmentId,
  );
  const alreadySubmitted = new Set(existingSubmissions.map((s) => s.questionId));
  const duplicates = questionIds.filter((id) => alreadySubmitted.has(id));
  if (duplicates.length > 0)
    throw new ServiceError("Some questions have already been submitted", 400);

  const results = [];
  let totalScore = 0;
  let totalPossible = 0;

  for (const answer of data.answers) {
    const question = questions.find((q) => q!.id === answer.questionId)!;
    const invalid = answer.providedAnswers.filter((a) => !question.answerOptions.includes(a));
    if (invalid.length > 0)
      throw new ServiceError(`Invalid answers for question: ${invalid.join(", ")}`, 400);

    const correctSet = new Set(question.correctAnswers);
    const providedSet = new Set(answer.providedAnswers);
    const isCorrect =
      correctSet.size === providedSet.size && [...correctSet].every((a) => providedSet.has(a));

    const submission = await assessmentsRepository.createSubmission(
      userId,
      question.id,
      answer.providedAnswers,
      question.correctAnswers,
      isCorrect,
    );

    results.push({
      questionId: question.id,
      isCorrect,
      providedAnswers: submission.providedAnswers,
      correctAnswers: submission.correctAnswers,
      grade: isCorrect ? question.grade : 0,
    });
    totalPossible += question.grade;
    if (isCorrect) totalScore += question.grade;
  }

  return { results, totalScore, totalPossible };
}

export class ServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ServiceError";
  }
}
