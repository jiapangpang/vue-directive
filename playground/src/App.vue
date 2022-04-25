<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="appcontainer">
    <img class="imgitem" alt="Vue logo" src="./assets/logo.png">
    <HelloWorld class="hello" />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

:root {
  width: 100%;
  height: 100%;
}

body {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}

.appcontainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.imgitem {
  width: 10rem;
  align-self: center;
  flex: none;
}

.hello {
  flex: 1 1 auto;
  padding: 0 1rem;
}
</style>
