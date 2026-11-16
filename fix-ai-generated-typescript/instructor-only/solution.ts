interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const task: Task = {
  id: 101,
  title: "Review API",
  completed: false,
};

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.title === "string" &&
    typeof candidate.completed === "boolean"
  );
}

export function getTaskTitle(value: unknown): string {
  if (!isTask(value)) {
    throw new TypeError("Invalid task data");
  }

  return value.title;
}

console.log(getTaskTitle(task));
