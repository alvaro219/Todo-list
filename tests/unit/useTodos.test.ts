import useTodos from "../../src/store/useTodos";
import { TodoStatus, type Todo } from "../../src/types";
import { describe, it, expect, beforeEach } from "vitest";

describe("useTodos", () => {
  let store: ReturnType<typeof useTodos>;

  beforeEach(() => {
    store = useTodos();

  });

  it("debería inicializar el store con datos predeterminados si no hay datos en localStorage", () => {
    expect(store.getTodosByStatus(TodoStatus.InProgress).value).toEqual([
      {
        id: 1,
        title: "Job search",
        description: "Find a job as a Front-End Developer",
        status: TodoStatus.InProgress,
        tag: [],
      },
    ]);
  });

  it("debería agregar un nuevo todo correctamente", () => {
    const newTodo: Todo = {
      id: 2,
      title: "New Todo",
      description: "This is a new todo",
      status: TodoStatus.Pending,
      tag: [],
    };

    store.addNewTodo(newTodo);
    expect(store.getTodosByStatus(TodoStatus.Pending).value).toContainEqual(newTodo);
  });

  it("debería actualizar el estado de un todo correctamente", () => {
    const todoToUpdate: Todo = {
      id: 1,
      title: "Job search",
      description: "Find a job as a Front-End Developer",
      status: TodoStatus.InProgress,
      tag: [],
    };

    store.updateTodo(todoToUpdate, TodoStatus.Completed);
    expect(store.getTodosByStatus(TodoStatus.Completed).value).toContainEqual({
      ...todoToUpdate,
      status: TodoStatus.Completed,
    });
    expect(store.getTodosByStatus(TodoStatus.InProgress).value).not.toContainEqual(todoToUpdate);
  });

  it("debería eliminar un todo correctamente", () => {
    const todoToDelete: Todo = {
      id: 1,
      title: "Job search",
      description: "Find a job as a Front-End Developer",
      status: TodoStatus.InProgress,
      tag: [],
    };

    store.deleteTodo(todoToDelete);
    expect(store.getTodosByStatus(TodoStatus.InProgress).value).not.toContainEqual(todoToDelete);
  });

  it("debería haber al menos un todo en cualquier columna", () => {
    const hasTodos = [
      TodoStatus.Pending,
      TodoStatus.InProgress,
      TodoStatus.Completed
    ].some((status) => store.getTodosByStatus(status).value.length > 0);

    expect(hasTodos).toBe(true);
  });

  it("ningún todo debería tener tags en ninguna columna", () => {
    const allTodos = [
      ...store.getTodosByStatus(TodoStatus.Pending).value,
      ...store.getTodosByStatus(TodoStatus.InProgress).value,
      ...store.getTodosByStatus(TodoStatus.Completed).value
    ];

    const todosWithoutTags = allTodos.every(todo => todo.tag.length === 0);
    expect(todosWithoutTags).toBe(true);
  });
});
