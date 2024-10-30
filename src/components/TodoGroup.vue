<script setup lang="ts">
import { TodoStatus } from "@/types";
import Draggable from "vuedraggable";
import useTodos from "@/store/useTodos";
import CreateTodo from "./CreateTodo.vue";
import { ref } from "vue";

interface Props {
  status: TodoStatus;
}

const props = defineProps<Props>();

const { getTodosByStatus, deleteTodo, updateTodo } = useTodos();
const todoList = getTodosByStatus(props.status);

const groupLabel = {
  [TodoStatus.Pending]: "Pending",
  [TodoStatus.InProgress]: "In Progress",
  [TodoStatus.Completed]: "Completed",
};

const newTags = ref<{ [key: number]: string }>({});

const addTag = (todo: any) => {
  if (newTags.value[todo.id]) {
    if (!Array.isArray(todo.tag))
      todo.tag = [];
  }
  todo.tag.push(newTags.value[todo.id]);
  updateTodo(todo, props.status);

  newTags.value[todo.id] = "";
}

const removeTag = (todo: any, index: number) => {
  todo.tag.splice(index, 1);
  updateTodo(todo, props.status);
}

const onDraggableChange = (payload: any) => {
  if (payload?.added?.element?.status) {
    updateTodo(payload?.added?.element, props.status);
  }
};
</script>

<template>
  <div class="group-wrapper">
    <h3>{{ groupLabel[props.status] }}</h3>

    <Draggable
      class="draggable"
      :list="todoList"
      group="todos"
      itemKey="id"
      @change="onDraggableChange"
    >
      <template #item="{ element: todo }">
        <li>
          {{ todo.title }}
          <span class="delete-icon" @click="deleteTodo(todo)">x</span>
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

    <CreateTodo :status="props.status" />
  </div>
</template>

<style scoped>
.group-wrapper {
  flex: 1;
  padding: 20px;
  background-color: rgb(56, 80, 103);
  width: 300px;
}

.group-wrapper li {
  list-style-type: none;
  background-color: aliceblue;
  color: rgb(56, 80, 103);
  padding: 2px 5px;
  cursor: grab;
  margin-bottom: 10px;
}

.draggable {
  min-height: 200px;
}

.delete-icon {
  float: right;
  cursor: pointer;
}

.todo-tag {
  font-size: 12px;
}

.todo-description {
  font-size: 12px;
}
</style>
