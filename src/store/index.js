import Vue from 'vue'
import Vuex from 'vuex'
import selections from './selections'
import features from './features'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    selections,
    features
  }
})
