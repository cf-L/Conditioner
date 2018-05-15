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
        options: {
          names: ['副标题', '时间', '标题', '排名'],
          alias: ['subtitle', 'date', 'title', 'rank'],
          model: [
            {
              alias: 'subtitle',
              type: 'String',
              sopt: ['cn', 'nc', 'ge'],
              required: false
            },
            {
              alias: 'date',
              type: 'Date',
              sopt: ['eq', 'ne', 'bt'],
              required: false
            },
            {
              alias: 'title',
              type: 'String',
              sopt: ['cn', 'nc'],
              required: true
            },
            {
              alias: 'rank',
              type: 'Int',
              sopt: ['cn', 'nc', 'ge'],
              required: true
            }
          ]
        }
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
