<template>
  <div id="app">
    <conditioner :options="options"></conditioner>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'app',
    components: {},
    data() {
      return {
        options: { 'd': 'tt' }
      }
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
