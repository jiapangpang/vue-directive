<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <div>
    <div v-sizeDrag class="drag-container" />
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}

.drag-container {
  border: #42b983 2px solid;
  width: 30rem;
  height: 30rem;
  max-width: 50rem;
  max-height: 40rem;
}
</style>
