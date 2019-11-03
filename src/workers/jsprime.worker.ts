// import calcPrimeJs from '@/modules/primes';

class Primes {
  private count: number = 0;

  private primes: number[];

  public constructor(target: number) {
    this.primes = new Array(target + 1);
  }

  public getPrimeCount = () => this.count;

  public getPrime = (i: number) => this.primes[i];

  public addPrime(p: number): void {
    this.primes[this.count] = p;
    this.count += 1;
  }

  public isPrimeDivisible(candidate: number): boolean {
    for (let i = 1; i < this.count; i += 1) {
      const currentPrime = this.primes[i];

      if (currentPrime * currentPrime > candidate) {
        return false;
      }

      if ((candidate % currentPrime) === 0) {
        return true;
      }
    }
    return false;
  }
}

function calcPrimeJs(targetIndex: number): number {
  const p = new Primes(targetIndex);
  let c = 1;
  while (p.getPrimeCount() < targetIndex + 1) {
    if (!p.isPrimeDivisible(c)) {
      p.addPrime(c);
      if (p.getPrimeCount() % 10000 === 0) {
        console.log(c, performance.now());
      }
    }
    c += 1;
  }

  return p.getPrime(targetIndex);
}

addEventListener('message', async (e) => {
  const { target } = e.data;

  const start = performance.now();
  const result = calcPrimeJs(target);
  console.log(performance.now() - start);

  postMessage({ result, time: performance.now() - start });
});

postMessage('initialized');
