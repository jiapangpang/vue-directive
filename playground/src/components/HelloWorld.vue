<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <div>
    <div class="outer-container">
      <div class="before">
        before
      </div>
      <div v-sizeDrag class="drag-container moving" style="top: 2rem; z-index: 10;" />
      <div class="before after">
        after
      </div>
    </div>
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

.outer-container {
  border: #b942b3 2px solid;
  padding: 1rem;
  position: absolute;
  display: flex;
}

.drag-container {
  border: #42b983 2px solid;
  background: #b95242;
  width: 30rem;
  height: 30rem;
  max-width: 50rem;
  max-height: 40rem;
  position: relative;
  /* top:2rem;
  left: 2rem; */
}
.before{
  border: #6e42b9 2px solid;
  margin:0 1rem;
  width: 10rem;
  height: 10rem;
}
.after{
  position: absolute;
   background: #42b983;
  left: 60rem;
  z-index:100;
}
.moving {
  transition: all 0.3s ease-in-out;
}
</style>
