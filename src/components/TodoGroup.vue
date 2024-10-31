<script setup lang="ts">
import { TodoStatus } from "@/types";
import Draggable from "vuedraggable";
import useTodos from "@/store/useTodos";
import CreateTodo from "./CreateTodo.vue";
import { computed, ref, defineProps } from "vue";

interface Props {
  status: TodoStatus;
  selectedTags: string[];
}

const props = defineProps<Props>();

const { getTodosByStatus, deleteTodo, updateTodo } = useTodos();
const todoList = computed(() => getTodosByStatus(props.status).value);

const groupLabel = {
  [TodoStatus.Pending]: "Pending",
  [TodoStatus.InProgress]: "In Progress",
  [TodoStatus.Completed]: "Completed",
};

const isTodoVisible = (todo: any) => {
  return props.selectedTags.length === 0 || todo.tag.some((tag: string) => props.selectedTags.includes(tag));
};

const sortedTodoList = computed(() => {
  return todoList.value.sort((a, b) => {
    const aVisible = isTodoVisible(a);
    const bVisible = isTodoVisible(b);
    return aVisible === bVisible ? 0 : aVisible ? -1 : 1;
  });
});

const newTags = ref<{ [key: number]: string }>({});

const addTag = (todo: any) => {
  if (newTags.value[todo.id]) {
    if (!Array.isArray(todo.tag)) {
      todo.tag = [];
    }
    if (!todo.tag.includes(newTags.value[todo.id])) {
      todo.tag.push(newTags.value[todo.id]);
      updateTodo(todo);
    }
    newTags.value[todo.id] = "";
  }
};

const removeTag = (todo: any, index: number) => {
  todo.tag.splice(index, 1);
  updateTodo(todo);
};

const onDraggableChange = (payload: any) => {
  if (payload?.added?.element?.status !== props.status) {
  }
};

// Nueva función para manejar Enter en el campo de entrada
const handleEnterKey = (event: KeyboardEvent, todo: any) => {
  if (event.key === "Enter") {
    addTag(todo);
  }
};
</script>

<template>
  <div class="group-wrapper">
    <h3>{{ groupLabel[props.status] }}</h3>

    <Draggable
      class="draggable"
      :list="sortedTodoList"
      group="todos"
      itemKey="id"
      @change="onDraggableChange"
    >
      <template #item="{ element: todo }">
        <li :class="{ 'darkened': !isTodoVisible(todo) }">
          {{ todo.title }}
          <span class="delete-icon" @click="() => deleteTodo(todo)">x</span>
          <div>
            <span class="todo-description">{{ todo.description }}</span>
          </div>
          <div>
            <span class="todo-tag" v-for="(tag, index) in todo.tag" :key="index">
              {{ tag }}
              <button @click="removeTag(todo, index)">x</button>
            </span>            
          </div>
          <div>
            <!-- Agregamos el evento keyup para escuchar Enter y ejecutar addTag -->
            <input 
              type="text" 
              v-model="newTags[todo.id]" 
              placeholder="Add new tag" 
              @keyup="handleEnterKey($event, todo)"
            />
            <button @click="addTag(todo)">Add Tag</button>
          </div>
        </li>
      </template>
    </Draggable>

    <div class="todo-container">
      <CreateTodo :status="props.status" />
    </div>
  </div>
</template>

<style scoped>
.group-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 12px;
  background-color: #f4f5f7;
  width: 280px;
  min-height: 380px;
  border-radius: 6px;
  border: 1px solid #dfe1e6;
}

.draggable {
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 10px;
}

.group-wrapper h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #5e6c84;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.todo-container {
  margin-top: auto;
  border-radius: 8px;
}

.group-wrapper li {
  list-style-type: none;
  background-color: #ffffff;
  color: #172b4d;
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 3px;
  box-shadow: 0px 1px 2px rgba(9, 30, 66, 0.25);
  cursor: grab;
  transition: background-color 0.2s ease;
}

.group-wrapper li:hover {
  background-color: #f0f0f0;
}

.darkened {
  opacity: 0.5 !important;
  background-color: grey !important;
}

.delete-icon {
  float: right;
  cursor: pointer;
}

.todo-tag {
  display: inline-block;
  font-size: 12px;
  color: #42526e;
  background-color: #e2e4e7;
  padding: 2px 6px;
  margin: 4px;
  border-radius: 3px;
  transition: background-color 0.2s;
}

.todo-tag button {
  margin-left: 5px;
  font-size: 10px;
  color: #ff5a5f;
  background: none;
  border: none;
  cursor: pointer;
}

.todo-description {
  margin-top: 4px;
  font-size: 12px;
}
</style>
