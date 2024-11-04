import { TodoStatus, type Todo } from "../types";
import { reactive, computed, watch } from "vue";

interface TodoStore {
  [TodoStatus.Pending]: Todo[];
  [TodoStatus.InProgress]: Todo[];
  [TodoStatus.Completed]: Todo[];
}

const loadTodosFromLocalStorage = (): TodoStore => {
  const savedTodos = window.localStorage.getItem("todos");
  if (savedTodos) {
    try {
      return JSON.parse(savedTodos);
    } catch (e) {
      console.error("Error parsing todos from localStorage:", e);
    }
  }
  return {
    [TodoStatus.Pending]: [],
    [TodoStatus.InProgress]: [
      {
        id: 1,
        title: "Job search",
        description: "Find a job as a Front-End Developer",
        status: TodoStatus.InProgress,
        tag: [],
      },
    ],
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

  const updateTodo = (todo: Todo, newStatus?: TodoStatus) => {
    if (newStatus && todo.status !== newStatus) {
      todoStore[todo.status] = todoStore[todo.status].filter((t) => t.id !== todo.id);
  
      const todoCopy = { ...todo, status: newStatus };
  
      todoStore[newStatus].push(todoCopy);
    } else {
      const index = todoStore[todo.status].findIndex((t) => t.id === todo.id);
      if (index !== -1) {
        todoStore[todo.status][index] = { ...todo };
      }
    }
  };
  
  

  const addNewTodo = (todo: Todo) => {
    todoStore[todo.status].push(todo);
  };

  const deleteTodo = (todoToDelete: Todo) => {
    Object.values(todoStore).forEach((todos) => {
      const index = todos.findIndex((todo) => todo.id === todoToDelete.id);
      if (index !== -1) {
        todos.splice(index, 1);
      }
    });
    saveTodosToLocalStorage();
  };
  

  return { getTodosByStatus, addNewTodo, deleteTodo, updateTodo };
};
