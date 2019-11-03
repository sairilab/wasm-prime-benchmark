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

export default function calcPrimeJs(targetIndex: number): number {
  const p = new Primes(targetIndex);
  let c = 1;
  while (p.getPrimeCount() < targetIndex + 1) {
    if (!p.isPrimeDivisible(c)) {
      p.addPrime(c);
    }
    c += 1;
  }

  return p.getPrime(targetIndex);
}
