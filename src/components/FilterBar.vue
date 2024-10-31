<script setup lang="ts">
import { ref, computed, watch } from "vue";
import useTodos from "@/store/useTodos";
import { TodoStatus } from "@/types";

const { getTodosByStatus } = useTodos();

const searchTerm = ref("");
const selectedTags = defineModel<string[]>("selectedTags");

const groupLabel = {
  [TodoStatus.Pending]: "Pending",
  [TodoStatus.InProgress]: "InProgress",
  [TodoStatus.Completed]: "Completed",
};

const allTodos = computed(() => {
  return Object.keys(groupLabel).flatMap(statusKey =>
    getTodosByStatus(statusKey as TodoStatus).value
  );
});

const availableTags = computed(() => {
  const tagsSet = new Set<string>();
  allTodos.value.forEach(todo => {
    todo.tag.forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet);
});

const filteredTodos = computed(() => {
  if (selectedTags.value!.length === 0) return allTodos.value;
  return allTodos.value.filter(todo =>
    selectedTags.value!.every(tag => todo.tag.includes(tag))
  );
});

const addTagToFilter = (tag: string) => {
  if (!selectedTags.value!.includes(tag)) {
    selectedTags.value!.push(tag);
  }
};

const removeTagFromFilter = (tag: string) => {
  selectedTags.value = selectedTags.value!.filter(t => t !== tag);
};

watch(searchTerm, (newSearch) => {
  if (availableTags.value.includes(newSearch)) {
    addTagToFilter(newSearch);
    searchTerm.value = "";
  }
});
</script>

<template>
  <div class="searcher-bar">
    <input type="text" v-model="searchTerm" placeholder="Search any Tag" />
    <button @click="addTagToFilter(searchTerm)">Add Tag</button>

    <div class="selected-tags">
      <span v-for="tag in selectedTags" :key="tag" class="tag">
        {{ tag }}
        <button @click="removeTagFromFilter(tag)">x</button>
      </span>
    </div>

    <div class="available-tags">
      <span
        v-for="tag in availableTags"
        :key="tag"
        @click="addTagToFilter(tag)"
        class="tag-option"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.searcher-bar {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag, .tag-option {
  padding: 5px 10px;
  background-color: green;
  color: white;
  border-radius: 3px;
  cursor: pointer;
}

.available-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
</style>
