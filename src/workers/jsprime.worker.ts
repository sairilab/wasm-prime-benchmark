import calcPrimeJs from '@/modules/primes';

addEventListener('message', async (e) => {
  const { target } = e.data;

  const start = performance.now();
  const result = calcPrimeJs(target);

  postMessage({ result, time: performance.now() - start });
});

postMessage('initialized');
