<template>
  <div class="primes container">
    <div class="wasm-logo">
      <img src="../../static/wasm.png" alt="">
    </div>
    <div class="header">
      <h1 class="title is-size-4-mobile">Wasm Prime Benchmark</h1>
      <p class="subtitle is-size-6-mobile">いろんな言語をwasmにビルドしてみたよ</p>
    </div>

    <div class="input-area">
      <p class="has-text-weight-bold has-text-left">何番目の素数を求める？</p>
      <div class="field is-grouped">
        <div class="control is-expanded">
          <input type="number" class="input" placeholder="target index" v-model="target">
        </div>
        <div class="control">
          <button class="button is-primary" @click="startCalc">計算！</button>
        </div>
      </div>
    </div>

    <div class="results">
      <h2 class="has-text-weight-medium is-size-4">Results</h2>

      <!-- JavaScript -->
      <div class="js lang columns">
        <div class="lang-logo">
          <img src="../../static/js-logo.png" alt="">
        </div>
        <div class="results-wrapper">
          <p>JavaScript: {{ jsResult }}</p>
          <p>Time: {{ jsTime }} msec</p>
        </div>
      </div>

      <!-- Go -->
      <div class="go lang columns">
        <div class="lang-logo">
          <img src="../../static/gopher2.png" alt="">
        </div>
        <div class="results-wrapper">
          <p>Go: 0</p>
          <p>Time: 0 msec</p>
        </div>
      </div>

      <!-- rust -->
      <div class="rust lang columns">
        <div class="lang-logo">
          <img src="../../static/rustlogo.png" alt="">
        </div>
        <div class="results-wrapper">
          <p>Rust: {{ rustResult }}</p>
          <p>Time: {{ rustTime }} msec</p>
        </div>
      </div>

      <!-- c -->
      <div class="clang lang columns">
        <div class="lang-logo">
          <img src="../../static/c-logo.png" alt="">
        </div>
        <div class="results-wrapper">
          <p>C: {{ clangResult }}</p>
          <p>Time: {{ clangTime }} msec</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import calcPrimeJs from '@/modules/primes';

@Component
export default class Primes extends Vue {
  public target = '100000';

  private get targetIndex() {
    return parseInt(this.target, 10);
  }

  public rustWasm!: any;

  public async created() {
    this.rustWasm = await import('rust-wasm-prime');
  }

  public startCalc() {
    // this.jsCalc();
    // this.rustCalc();
    // this.clangCalc();

    this.jsCalc2();
    this.rustCalc2();
  }

  // JavaScript
  public jsResult = 0;

  public jsTime = 0;

  private jsCalc() {
    const start = performance.now();
    this.jsResult = calcPrimeJs(this.targetIndex);
    this.jsTime = performance.now() - start;
  }

  private jsCalc2() {
    const worker = new Worker('@/workers/jsprime.worker', { type: 'module' });
    worker.postMessage({});
    this.jsResult = 100;
  }

  // Rust
  public rustResult = '';

  public rustTime = 0;

  private rustCalc() {
    const start = performance.now();
    this.rustResult = this.rustWasm.calc_prime(this.targetIndex).toString(10);
    this.rustTime = performance.now() - start;
  }

  private rustCalc2() {
    this.rustResult = 'ohayosan';
  }

  // The Programming Language C (emscripten)
  public clangResult = '';

  public clangTime = 0;

  private clangCalc() {
    const start = performance.now();
    // TODO: Remove eval
    /* eslint-disable no-eval */
    this.clangResult = eval('Module._calc_prime_c(this.targetIndex).toString(10)');
    this.clangTime = performance.now() - start;
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

.lang {
  margin-top: 0px;
}

.lang-logo {
  min-width: 100px;
  max-height: 100px;

  img {
    display: block;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
  }
}

.results-wrapper {
  font-size: 1.5em;
  margin-top: 15px;
  margin-left: 15px;
}
</style>
