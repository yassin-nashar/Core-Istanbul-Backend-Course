const validationError = Object.freeze({
  error: 'title and completed are required'
});

export function replaceTaskCorrectly(currentTask, id, body) {
  const hasValidTitle = typeof body?.title === 'string'
    && body.title.trim().length > 0;
  const hasValidCompleted = typeof body?.completed === 'boolean';

  if (!hasValidTitle || !hasValidCompleted) {
    return {
      status: 400,
      response: validationError,
      task: currentTask
    };
  }

  const task = {
    id,
    title: body.title,
    completed: body.completed
  };

  return {
    status: 200,
    response: task,
    task
  };
}
