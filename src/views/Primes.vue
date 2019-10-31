<template>
  <div class="primes container">
    <div class="header">
      <h1 class="title is-size-4-mobile">Wasm Prime Benchmark</h1>
      <p class="subtitle is-size-6-mobile">いろんな言語をwasmにビルドしてみたよ</p>
    </div>

    <div class="input-area">
      <p class="has-text-weight-bold has-text-left">何番目の素数を求める？</p>
      <div class="field is-grouped">
        <div class="control is-expanded">
          <input type="text" class="input" placeholder="target index" v-model="target">
        </div>
        <div class="control">
          <button class="button is-primary" @click="startCalc">計算！</button>
          <button class="button is-primary" @click="startCalc2">Action</button>
        </div>
      </div>
    </div>

    <div class="results">
      <h2 class="has-text-weight-medium is-size-4">Results</h2>
      <div class="rust">
        <p>Rust: {{ rustResult }}</p>
        <p>time: {{ time }} msec</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Primes extends Vue {
  public target = 1000000;

  public rustResult = '';

  public time = 0;

  private modules = {};

  public startCalc() {
    const start = performance.now();
    const timer = setInterval(() => { this.time = performance.now() - start; }, 10);

    const worker = new Worker('../workers/rustwasm.worker.ts', { type: 'module' });

    worker.onmessage = (message: Object) => {
      clearInterval(timer);
      this.time = message.data.time;
      this.rustResult = message.data.prime;
    };
    worker.postMessage({ target: this.target });
  }

  get rustResultAct(): number {
    return this.$store.state.rustResult;
  }

  public async startCalc2() {
    const start = performance.now();
    const timer = setInterval(() => { this.time = performance.now() - start; }, 10);

    await this.$store.dispatch('calc', { target: this.target });

    clearInterval(timer);
    this.time = performance.now() - start;
    this.rustResult = this.rustResultAct.toString(10);
  }
}
</script>

<style lang="scss" scoped>
.primes {
  margin-top: 60px;
  max-width: 600px;
  padding: 0 20px;
}

.header {
  text-align: center;
}

.input-area {
  margin: 30px auto;
}
</style>
