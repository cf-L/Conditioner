<template>
  <div id="app">
    <conditioner :options="options" @search="handleSearch"></conditioner>
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
          names: ['副标题', '时间', '标题', '排名', '国家'],
          alias: ['subtitle', 'date', 'title', 'rank', 'country'],
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
              required: true
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
            },
            {
              alias: 'country',
              type: 'String',
              sopt: ['eq'],
              required: true,
              // selectOptions: [
              //   { key: '1', value: 'us', label: '美国' },
              //   { key: '2', value: 'cn', label: '中国' }
              // ]
              remote: {
                url: 'http://localhost:9528/selectorResearchCountries',
                method: 'GET'
              }
            }
          ]
        }
      }
    },
    methods: {
      handleSearch(evt, finalEl) {
        console.log('seaerch: ', finalEl)
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
