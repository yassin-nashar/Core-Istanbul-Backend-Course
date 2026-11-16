interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const task: Task = {
  id: "101",
  title: "Review API",
  completed: "false"
};

function getTaskTitle(value: unknown) {
  return value.title;
}

console.log(getTaskTitle(task));
