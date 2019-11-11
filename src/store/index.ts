import Vue from 'vue';
import Vuex from 'vuex';

// import PrimeModules from './primes';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    target: 1000000,
    calcTasks: [] as (() => void)[],
  },
  mutations: {
    updateTarget(state, { target }) {
      state.target = target;
    },
    addCalcEvent(state, { task }) {
      state.calcTasks.push(task);
    },
  },
  actions: {
    async calc({ state }) {
      state.calcTasks.forEach(async t => t());
    },
  },
  modules: {
  },
});
