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
            <input type="text" v-model="newTags[todo.id]" placeholder="Add new tag"/>
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
  padding: 20px;
  background-color: rgb(226, 226, 226);
  width: 300px;
  min-height: 350px;
  border-radius: 8px;
}

.draggable {
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 10px;
}

.todo-container {
  margin-top: auto;
  border-radius: 8px;
}

.group-wrapper li {
  list-style-type: none;
  background-color: aliceblue;
  color: #000000;
  padding: 2px 5px;
  cursor: grab;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
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
  font-size: 12px;
  color: #ffffff;
  padding: 6px;
  margin: 4px;
  background-color: green;
}

.todo-description {
  margin-top: 4px;
  font-size: 12px;
}
</style>
