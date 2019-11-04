class GoWasm {
  private initialized = false;

  public async loadModule() {
    importScripts('wasm_go.js');

    const go = new Go();

    // Apple信者用
    if (!WebAssembly.instantiateStreaming) {
			WebAssembly.instantiateStreaming = async (resp, importObject) => {
				const source = await (await resp).arrayBuffer();
				return await WebAssembly.instantiate(source, importObject);
			};
		}
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