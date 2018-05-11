
import conditioner from './components/conditioner'

const Conditioner = {
  install(Vue, options) {
    Vue.component('conditioner', conditioner)
  }
}

export default Conditioner
