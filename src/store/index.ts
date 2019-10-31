import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    rustResult: 0,
  },
  mutations: {
    setRustResult(state, { result }) {
      state.rustResult = result;
    },
  },
  actions: {
    async calc({ commit }, { target }) {
      const wasmRust = await import('rust-wasm-prime');
      const prime = wasmRust.calc_prime(target);
      commit('setRustResult', { result: prime });
    },
  },
  modules: {
  },
});
