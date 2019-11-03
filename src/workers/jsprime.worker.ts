console.log('loaded jsprime.worker.ts');

addEventListener('message', async (e) => {
  console.log('called');
  const mod = await import('rust-wasm-prime');
  console.log('success', mod.calc_prime(100));
});
