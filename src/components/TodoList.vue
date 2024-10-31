<script setup lang="ts">
import { ref } from "vue";
import { TodoStatus } from "@/types";
import TodoGroup from "./TodoGroup.vue";
import FilterBar from "./FilterBar.vue";

const selectedTags = ref<string[]>([]);
</script>

<template>
  <div>
    
  </div>
  <div class="groups-wrapper">
    <FilterBar v-model:selectedTags="selectedTags"/>
    <TodoGroup :status="TodoStatus.Pending" :selectedTags="selectedTags" />
    <TodoGroup :status="TodoStatus.InProgress" :selectedTags="selectedTags" />
    <TodoGroup :status="TodoStatus.Completed" :selectedTags="selectedTags" />
  </div>
</template>

<style scoped>
.groups-wrapper {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}
</style>
