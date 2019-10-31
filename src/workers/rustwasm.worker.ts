// const wasm = import('rust-wasm-prime');
/* eslint-disable */
// const _import = require('dynamic-import-polyfill');
import _import from 'dynamic-import-polyfill';

_import.initialize({

})
console.log(_import);
const wasm = _import('rust-wasm-prime');
wasm.then((mod) => {
  const calc = (target: number) => {
    const start = performance.now();
    const prime = mod.calc_prime(target);
    const end = performance.now();

    const time = end - start;

    return {
      prime,
      time,
    };
  };

  addEventListener('message', (message) => {
    postMessage(calc(message.data.target), '*');
  });
});
