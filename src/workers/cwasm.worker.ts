class ClangWasm {
  private wasmModule: any;

  private initialized = false;

  public async loadModule() {
    importScripts('primesc.js');
    this.wasmModule = await Module.ready;

    this.initialized = true;
  }

  public calcPrime(target: number) {
    if (!this.initialized) {
      throw new Error('Wasm module is not loaded yet. Do \'loadModule()\' ahead!');
    }
    return this.wasmModule.calc_prime_c(target);
  }
}

const clangWasm = new ClangWasm();
clangWasm.loadModule().then(() => {
  addEventListener('message', async (e) => {
    const { target } = e.data;

    const start = performance.now();
    const result = clangWasm.calcPrime(target);

    postMessage({ result, time: performance.now() - start});
  });

  postMessage('initialized');
})