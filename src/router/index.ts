import Vue from 'vue';
import VueRouter from 'vue-router';
import Primes from '../views/Primes.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'primes',
    component: Primes,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
