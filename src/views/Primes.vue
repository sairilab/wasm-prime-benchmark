<template>
  <div class="primes container">
    <div class="wasm-logo">
      <img src="../../static/wasm.png" alt="">
    </div>
    <div class="header">
      <h1 class="title is-size-4-mobile">Wasm Prime Benchmark</h1>
      <!-- <p class="subtitle is-size-6-mobile">いろんな言語をwasmにビルドしてみたよ</p> -->
    </div>

    <div class="input-area">
      <p class="has-text-weight-bold has-text-left">How many prime numbers will you calculate?</p>
      <div class="field is-grouped">
        <div class="control is-expanded">
          <input type="number" class="input" placeholder="target index" v-model="target">
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

      <!-- JavaScript -->
      <div class="js lang columns">
        <div class="lang-logo">
          <img src="../../static/js-logo.png" alt="">
        </div>
        <div class="results-wrapper">
          <p>JS(not wasm): {{ jsResult }}</p>
          <p>Time: {{ jsTime }} msec</p>
        </div>
      </div>

      <!-- Go -->
      <div class="go lang columns">
        <div class="lang-logo">
          <img src="../../static/gopher2.png" alt="">
        </div>
        <div class="results-wrapper">
          <p>Go: {{ goResult }}</p>
          <p>Time: {{ goTime }} msec</p>
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
          <p>C(emscripten): {{ clangResult }}</p>
          <p>Time: {{ clangTime }} msec</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Primes extends Vue {
  public target = '1000000';

  private get targetIndex() {
    return parseInt(this.target, 10);
  }

  private initialized = false;

  private calculating = false;

  get disable() {
    return !this.initialized || this.calculating;
  }

  // TODO: いろいろとコンポーネント化したい；；
  public async created() {
    await Promise.all([
      this.initJsWorker(),
      this.initRustWorker(),
      this.initClangWorker(),
      this.initGoWorker(),
    ]);
    this.initialized = true;
  }

  public async startCalc() {
    this.calculating = true;
    await Promise.all([
      this.jsCalc(),
      this.rustCalc(),
      this.clangCalc(),
      this.goCalc(),
    ]);
    this.calculating = false;
  }

  // JavaScript
  public jsResult = 0;

  public jsTime = 0;

  private jsWorker!: Worker;

  private initJsWorker() {
    this.jsWorker = new Worker('@/workers/jsprime.worker', { type: 'module' });

    return new Promise((resolve) => {
      this.jsWorker.onmessage = (e) => {
        if (e.data === 'initialized') {
          resolve();
        }
      };
    });
  }

  private async jsCalc() {
    return new Promise((resolve) => {
      this.jsResult = 0;
      const start = performance.now();
      const timer = setInterval(() => { this.jsTime = performance.now() - start; }, 1);

      this.jsWorker.onmessage = (e) => {
        const { result, time } = e.data;

        clearInterval(timer);

        this.jsResult = result;
        this.jsTime = time;
        resolve();
      };

      this.jsWorker.postMessage({ target: this.targetIndex });
    });
  }

  // Go
  public goResult = 0;

  public goTime = 0;

  private goWorker!: Worker;

  private initGoWorker() {
    this.goWorker = new Worker('@/workers/gowasm.worker', { type: 'module' });

    return new Promise((resolve) => {
      this.goWorker.onmessage = (e) => {
        if (e.data === 'initialized') {
          resolve();
        }
      };
    });
  }

  private goCalc() {
    return new Promise((resolve) => {
      this.goResult = 0;
      const start = performance.now();
      const timer = setInterval(() => { this.goTime = performance.now() - start; }, 1);

      this.goWorker.onmessage = (e) => {
        const { result, time } = e.data;

        clearInterval(timer);

        this.goResult = result;
        this.goTime = time;
        resolve();
      };

      this.goWorker.postMessage({ target: this.targetIndex });
    });
  }


  // Rust
  public rustResult = '';

  public rustTime = 0;

  public rustWorker!: Worker;

  private initRustWorker() {
    this.rustWorker = new Worker('@/workers/rustwasm.worker', { type: 'module' });

    return new Promise((resolve) => {
      this.rustWorker.onmessage = (e) => {
        if (e.data === 'initialized') {
          resolve();
        }
      };
    });
  }

  private async rustCalc() {
    return new Promise((resolve) => {
      this.rustResult = '0';
      const start = performance.now();
      const timer = setInterval(() => { this.rustTime = performance.now() - start; }, 1);

      this.rustWorker.onmessage = (e) => {
        const { result, time } = e.data;

        clearInterval(timer);

        this.rustResult = result;
        this.rustTime = time;
        resolve();
      };

      this.rustWorker.postMessage({ target: this.targetIndex });
    });
  }

  // The Programming Language C (emscripten)
  public clangResult = '0';

  public clangTime = 0;

  private clangWorker!: Worker;

  private initClangWorker() {
    this.clangWorker = new Worker('@/workers/cwasm.worker', { type: 'module' });

    return new Promise((resolve) => {
      this.clangWorker.onmessage = (e) => {
        if (e.data === 'initialized') {
          resolve();
        }
      };
    });
  }

  private clangCalc() {
    return new Promise((resolve) => {
      this.clangResult = '0';

      const start = performance.now();
      const timer = setInterval(() => { this.clangTime = performance.now() - start; }, 1);

      this.clangWorker.onmessage = (e) => {
        const { result, time } = e.data;

        clearInterval(timer);

        this.clangResult = result;
        this.clangTime = time;
        resolve();
      };

      this.clangWorker.postMessage({ target: this.targetIndex });
    });
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
  max-width: 100px;
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
