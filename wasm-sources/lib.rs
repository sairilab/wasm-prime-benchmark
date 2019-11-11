mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

struct Primes {
    count: usize,
    primes: Vec<i32>,
}

impl Primes {
    fn new(target: usize) -> Primes {
        Primes {
            count: 0,
            // primes: Vec::new(),
            primes: Vec::with_capacity(target+1)
        }
    }

    fn get_prime_count(&self) -> usize {
        self.count
    }

    fn get_prime(&self, i: usize) -> i32 {
        self.primes[i]
    }

    fn add_prime(&mut self, prime: i32) {
        // self.primes[self.count] = prime;
        self.primes.push(prime);
        self.count += 1;
    }

    fn is_divisible(i: i32, by: i32) -> bool {
        (i % by) == 0
    }

    fn is_prime_divisible(&self, candidate: i32) -> bool {
        for i in 1..self.count {
            if self.primes[i] * self.primes[i] > candidate {
                return false;
            }
            if Primes::is_divisible(candidate, self.primes[i]) {
                return true;
            }
        }
        false
    }
}

#[wasm_bindgen]
pub fn calc_prime(target_index: usize) -> i32 {
    let mut p = Primes::new(target_index);

    let mut i = 1;

    while p.get_prime_count() < target_index + 1 {
        if !p.is_prime_divisible(i) {
            p.add_prime(i);
        }
        i += 1;
    }

    p.get_prime(target_index)
}

#[test]
fn calc_prime_works () {
    assert_eq!(calc_prime(100), 541);
    // assert_eq!(calc_prime(1000), 7919);
    // assert_eq!(calc_prime(10000), 104729);
    // assert_eq!(calc_prime(100000), 1299709);
    // assert_eq!(calc_prime(1000000), 15485863);
}
