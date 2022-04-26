<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { reactive } from 'vue'
const styleObj: CSSProperties = reactive({
  top: '2rem',
  left: '2rem',
  position: 'relative',
  maxWidth: '60rem',
})
function updateStyle() {
  styleObj.position = styleObj.position === 'absolute' ? 'relative' : 'absolute'
}
function updateWidth() {
  styleObj.maxWidth = styleObj.maxWidth === '' ? '30rem' : ''
}
</script>

<template>
  <div>
    <div>
      <button style="height:1rem" @click="updateStyle">
        Change Position
      </button><span>now Position:{{ styleObj.position }}</span>
      <button style="height:1rem" @click="updateWidth">
        Change max-width
      </button>
    </div>

    <div class="outer-container">
      <div class="before">
        before
      </div>
      <div v-sizeDrag class="drag-container moving" :style="styleObj" />
      <div class="before">
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
  width: 80%;
  height: 80%;

}

.drag-container {
  --color:#42b983;
  border: var(--color) 2px solid;
  background: #b95242;
  width: 30rem;
  height: 30rem;
  /* max-width: 50rem;
  max-height: 40rem; */
  /* min-height: 20rem;
  min-width: 20rem; */
  position: relative;
  z-index:2;
  /* top:2rem;
  left: 2rem; */
}
.before{
  border: #6e42b9 2px solid;
  margin:0 1rem;
  width: 10rem;
  height: 10rem;
   z-index: 10;
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
