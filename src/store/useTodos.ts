import { TodoStatus, type Todo } from "../types";
import { reactive, computed, watch } from "vue";

interface TodoStore {
  [TodoStatus.Pending]: Todo[];
  [TodoStatus.InProgress]: Todo[];
  [TodoStatus.Completed]: Todo[];
}

const loadTodosFromLocalStorage = (): TodoStore => {
  const savedTodos = localStorage.getItem("todos");
  if (savedTodos) {
    try {
      return JSON.parse(savedTodos);
    } catch (e) {
      console.error("Error parsing todos from localStorage:", e);
    }
  }
  return {
    [TodoStatus.Pending]: [
      {
        id: 1,
        title: "Job search",
        description: "Find a job as a Front-End Developer",
        status: TodoStatus.Pending,
        tag: [""],
      },
    ],
    [TodoStatus.InProgress]: [],
    [TodoStatus.Completed]: [],
  };
};

const todoStore = reactive<TodoStore>(loadTodosFromLocalStorage());

const saveTodosToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todoStore));
};

watch(
  () => todoStore,
  saveTodosToLocalStorage,
  { deep: true }
);

export default () => {
  const getTodosByStatus = (todoStatus: TodoStatus) => {
    return computed(() => todoStore[todoStatus]);
  };

  const updateTodo = (todo: Todo, newStatus: TodoStatus) => {
    if (todo.status === newStatus) return; // Solo actualiza si el estado cambia
    todoStore[todo.status] = todoStore[todo.status].filter((t) => t.id !== todo.id);
    todo.status = newStatus;
    todoStore[newStatus].push(todo);
  };

  const addNewTodo = (todo: Todo) => {
    todoStore[todo.status].push(todo);
  };

  const deleteTodo = (todoToDelete: Todo) => {
    todoStore[todoToDelete.status] = todoStore[todoToDelete.status].filter(
      (todo) => todo.id !== todoToDelete.id
    );
    saveTodosToLocalStorage(); // Fuerza la actualización del localStorage
};


  return { getTodosByStatus, addNewTodo, deleteTodo, updateTodo };
};
