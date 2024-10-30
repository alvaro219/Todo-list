<script setup lang="ts">
import type { Todo, TodoStatus } from "src/types";
import { reactive, ref } from "vue";
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
  <div>
    <h3 
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
          <input type="text" placeholder="Tag" v-model="newTodo.tag" />
        </div>
        <div>
          <textarea
            type="text"
            placeholder="Title"
            v-model="newTodo.description"
          />
        </div>

        <button type="submit">Submit</button>
        <button type="button" @click="resetForm">Cancel</button>
      </form>
    </template>
  </div>
</template>
