class GoWasm {
  private initialized = false;

  public async loadModule() {
    importScripts('wasm_go.js');

    const go = new Go();

    const mod = await WebAssembly.instantiateStreaming(fetch('primes-go.wasm'), go.importObject);
    go.run(mod.instance);

    this.initialized = true;
  }

  public calcPrime = (target: number) => global.calcPrimeGo(target)
}

const goWasm = new GoWasm();
goWasm.loadModule().then(() => {
  addEventListener('message', async (e) => {
    const { target } = e.data;

    const start = performance.now();
    const result = goWasm.calcPrime(target);

    postMessage({ result, time: performance.now() - start});
  });

  postMessage('initialized');
})