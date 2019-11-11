package main

import (
	"syscall/js"
)

type Primes struct {
	count int
	primes []int
}

func (p *Primes) addPrime(c int) {
	p.primes = append(p.primes, c)
	p.count++
}

func isDivisible(c int, by int) bool {
	return (c % by) == 0
}

func (p *Primes) isPrimeDivisible(candidate int) bool {
	for i := 1; i < p.count; i++ {
		var currentPrime = p.primes[i]

		if currentPrime * currentPrime > candidate {
			return false
		}

		if isDivisible(candidate, currentPrime) {
			return true
		}
	}
	return false
}

func calcPrime(target int) int {
	p := Primes {
		0,
		make([]int, 0, target + 1),
	}

	var c = 1
	for p.count < target + 1 {
		if !p.isPrimeDivisible(c) {
			p.addPrime(c)
		}
		c++
	}

	return p.primes[target]
}

func calcPrimeGo(this js.Value, args []js.Value) interface{} {
	var target = args[0].Int()
	return calcPrime(target)
}

func registerFunctions() {
	js.Global().Set("calcPrimeGo", js.FuncOf(calcPrimeGo))
}

func main() {
	c := make(chan struct{}, 0)
	registerFunctions()
	<-c
}
