// 冗長
class RustWasm {
  private wasmModule: any;

  private initialized = false;

  public async loadModule(): Promise<void> {
    this.wasmModule = await import('rust-wasm-prime');

    this.initialized = true;
  }

  public calcPrime(target: number): number {
    if (!this.initialized) {
      throw new Error('Wasm module is not loaded yet. Do \'loadModule()\' ahead!');
    }
    return this.wasmModule.calc_prime(target);
  }
}

const rustWasm = new RustWasm();
rustWasm.loadModule().then(() => {
  addEventListener('message', async (e) => {
    const { target } = e.data;

    const start = performance.now();
    const result = rustWasm.calcPrime(target);

    postMessage({ result, time: performance.now() - start});
  });

  postMessage('initialized');
});


