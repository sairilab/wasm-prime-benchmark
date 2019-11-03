{
  let wasmMod: any;
  let initialized: boolean = false;

  addEventListener('message', async (e) => {
    const { target } = e.data;

    console.log(initialized);
    if (!initialized) {
      wasmMod = await import('rust-wasm-prime');
    }

    const start = performance.now();
    const result = wasmMod.calc_prime(target);
    console.log('success', result, performance.now() - start);
    postMessage({ result, time: performance.now() });
  });
}

console.log('loaded jsprime.worker.ts');
