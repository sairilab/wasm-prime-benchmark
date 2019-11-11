#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>

#define true 1
#define false 0

struct Primes {
    int primes_count;
    int* primes;
};

void add_prime(struct Primes* p, int i) {
    p->primes[p->primes_count++] = i;
}

int is_divisible(int i, int by) {
    return (i % by) == 0 ? true : false;
}

int is_prime_divisible(struct Primes* p, int candidate) {
    for (int i = 1; i < p->primes_count; ++i) {
        if (p->primes[i] * p->primes[i] > candidate) {
            return false;
        }

        if (is_divisible(candidate, p->primes[i])) {
            return true;
        }
    }
    return false;
}

EMSCRIPTEN_KEEPALIVE
int calc_prime_c(int target) {
    struct Primes p = {
        0,
        (int *)malloc(sizeof(int) * (target + 1)),
    };

    int c = 1;
    while (p.primes_count < target + 1) {
        if (!is_prime_divisible(&p, c)) {
            add_prime(&p, c);
        }
        c++;
    }

    int target_prime = p.primes[target];
    free(p.primes);
    return target_prime;
}

// int main(void) {
//     int target = 1000000;

//     printf("%d\n", calc_prime_c(target));
// }
