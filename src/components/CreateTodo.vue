<script setup lang="ts">
import type { Todo, TodoStatus } from "src/types";
import { reactive, ref, computed } from "vue";
import useTodos from "@/store/useTodos";

interface Props {
  status: TodoStatus;
}
const props = defineProps<Props>();
const shouldDisplayForm = ref(false);

const { addNewTodo } = useTodos();

const newTodo = reactive<Omit<Todo, "id">>({
  title: "",
  description: "",
  status: props.status,
  tag: [],
});

const tagInput = computed({
  get: () => newTodo.tag.join(", "), 
  set: (value: string) => {
    newTodo.tag = value.split(",").map((tag) => tag.trim()).filter(tag => tag !== "");
  },
});

const resetForm = () => {
  shouldDisplayForm.value = false;
  newTodo.title = "";
  newTodo.description = "";
  newTodo.tag = [];
};

const handleOnSubmit = () => {
  addNewTodo({
    id: Math.random() * 10000000000000000,
    ...newTodo,
  });

  resetForm();
};
</script>

<template>
  <div class="todo-container">
    <h3 
      class="adder"
      style="cursor: pointer"
      v-if="!shouldDisplayForm"
      @click="shouldDisplayForm = !shouldDisplayForm"
    >
      Add New
    </h3>
    <template v-else>
      <form @submit.prevent="handleOnSubmit">
        <div>
          <input type="text" placeholder="Title" v-model="newTodo.title" />
        </div>        
        <div>
          <textarea
            type="text"
            placeholder="Description"
            v-model="newTodo.description"
          />
        </div>
        <div>
          <input type="text" placeholder="Tag" v-model="tagInput" />
        </div>

        <button type="submit">Submit</button>
        <button type="button" @click="resetForm">Cancel</button>
      </form>
    </template>
  </div>
</template>

<style scoped>
.todo-container{
  bottom: 0;
}
.adder {
  justify-content: space-around;
  background-color: #ffffff;
  border: 2px solid black;
  text-align: center;
  transition: 0.2s ease-in-out;
}
.adder:hover{
    background-color: #cacaca;
}
</style>