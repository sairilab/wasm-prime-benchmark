<template>
  <div class="primes container">
    <div class="wasm-logo">
      <img src="@/assets/wasm.png" alt="">
    </div>
    <div class="header">
      <h1 class="title is-size-4-mobile">Wasm Prime Benchmark</h1>
      <!-- <p class="subtitle is-size-6-mobile">いろんな言語をwasmにビルドしてみたよ</p> -->
    </div>

    <div class="input-area">
      <p class="has-text-weight-bold has-text-left">How many prime numbers will you calculate?</p>
      <div class="field is-grouped">
        <div class="control is-expanded">
          <input type="number" class="input" placeholder="target index" v-model="targetIndex">
        </div>
        <div class="control">
          <button class="button is-primary"
          @click="startCalc"
          :disabled="disable">
          Calc
        </button>
        </div>
      </div>
    </div>

    <div class="results">
      <h2 class="has-text-weight-medium is-size-4">Results</h2>

      <calc-result language="TypeScript"></calc-result>

      <calc-result language="Rust"></calc-result>

      <calc-result language="C"></calc-result>

      <calc-result language="Go"></calc-result>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import primeModules from '@/store/modules/primeModules';
import CalcResult from '@/components/CalcResult.vue';

@Component({
  components: {
    CalcResult,
  },
})
export default class Primes extends Vue {
  private get targetIndex() {
    return this.$store.state.target;
  }

  private set targetIndex(newTarget: string) {
    this.$store.commit('updateTarget', { target: parseInt(newTarget, 10) });
  }

  private initialized = false;

  private calculating = false;

  get disable() {
    return !this.initialized || this.calculating;
  }

  // eslint-disable-next-line class-methods-use-this
  get languages() {
    return primeModules.availableLanguages;
  }

  public async created() {
    await primeModules.initModules();
    this.initialized = true;
  }

  public async startCalc() {
    this.calculating = true;
    await this.$store.dispatch('calc');
    this.calculating = false;
  }
}
</script>

<style lang="scss" scoped>
.primes {
  margin-top: 60px;
  max-width: 600px;
  padding: 0 20px;
}

.wasm-logo {
  width: 100px;
  margin: 0 auto;
}

.header {
  text-align: center;
}

.input-area {
  margin: 30px auto;
}
</style>
