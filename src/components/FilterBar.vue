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
  if (tag && !selectedTags.value!.includes(tag)) {
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

const handleEnterKey = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    addTagToFilter(searchTerm.value);
    searchTerm.value = ""; 
  }
};
</script>

<template>
  <div class="searcher-bar">
    <div class="searcher-box">
      <input 
        class="searcher-container" 
        type="text" 
        v-model="searchTerm" 
        placeholder="Search any Tag" 
        @keyup="handleEnterKey"
      />
      <button class="button-container" @click="addTagToFilter(searchTerm)">Add Tag</button>
    </div>
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
  margin-bottom: 20px;
}

.searcher-box{
  display: flex;
 flex: 1;
  justify-content: space-between;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.searcher-container{
  width: 100%;
  flex: 1;
  margin-right: 20px;
  height: 30px;
  border: 2px solid #000000;
  border-radius: 8px;
  padding-left: 4px;
  font-size: 20px;
}

.button-container{
  width: 100px;
  height: 30px;
  flex: 0.2;
  font-size: 16px;
  background-color: #ffffff;
  align-self: center;
  border: 2px solid #000000;
  border-radius: 9999px;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}

.button-container:hover{
  box-shadow: 5px 2px 2px #000000;
  width: 120px;
  height: 35px;
  background-color: #eaffe6;
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
  max-width: 900px;
  gap: 5px;
}
</style>
