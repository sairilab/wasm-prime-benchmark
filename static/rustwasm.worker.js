console.log('hello');

let wasm;
const calc = (target) => {
  const start = performance.now();
  const prime = mod.calc_prime(target);
  const end = performance.now();

  return {
    prime,
    time: end - start,
  };
};
console.log('aa');
addEventListener('message', (e) => {
  const { type, wasmModule, target } = e.data;

  if (type === 'initialize') {
    wasm = wasmModule;
  }
  if (type === 'calc') {
    postMessage(calc(target), '*');
  }
});

console.log('loaded');
