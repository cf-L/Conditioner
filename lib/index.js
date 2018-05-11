
const Conditioner = {
  install(Vue, options) {
    Vue.mixin({
      mounted() {
        console.log('Mounted!')
      }
    })
  }
}

export default Conditioner
