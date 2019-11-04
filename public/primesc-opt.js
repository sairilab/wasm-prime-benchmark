
const Module = (function () {
  const _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  return (
    function (Module) {
      Module = Module || {};

      let b; b || (b = typeof Module !== 'undefined' ? Module : {}); let k = {}; let m; for (m in b)b.hasOwnProperty(m) && (k[m] = b[m]); let n = !1; let q = !1; let v = !1; let aa = !1; let w = !1; n = typeof window === 'object'; q = typeof importScripts === 'function'; v = (aa = typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string') && !n && !q; w = !n && !v && !q; let x = ''; let y; let z;
      if (v) { x = `${__dirname}/`; let A; let B; y = function (a, c) { A || (A = require('fs')); B || (B = require('path')); a = B.normalize(a); a = A.readFileSync(a); return c ? a : a.toString(); }; z = function (a) { a = y(a, !0); a.buffer || (a = new Uint8Array(a)); assert(a.buffer); return a; }; process.argv.length > 1 && process.argv[1].replace(/\\/g, '/'); process.argv.slice(2); process.on('uncaughtException', (a) => { throw a; }); process.on('unhandledRejection', C); b.inspect = function () { return '[Emscripten Module object]'; }; } else if (w) {
        typeof read !== 'undefined' && (y = function (a) { return read(a); }),
        z = function (a) { if (typeof readbuffer === 'function') return new Uint8Array(readbuffer(a)); a = read(a, 'binary'); assert(typeof a === 'object'); return a; }, typeof print !== 'undefined' && (typeof console === 'undefined' && (console = {}), console.log = print, console.warn = console.error = typeof printErr !== 'undefined' ? printErr : print);
      } else if (n || q) {
        q ? x = self.location.href : document.currentScript && (x = document.currentScript.src), _scriptDir && (x = _scriptDir), x.indexOf('blob:') !== 0 ? x = x.substr(0, x.lastIndexOf('/') + 1) : x = '', y = function (a) {
          const c = new XMLHttpRequest(); c.open('GET', a, !1); c.send(null); return c.responseText;
        }, q && (z = function (a) { const c = new XMLHttpRequest(); c.open('GET', a, !1); c.responseType = 'arraybuffer'; c.send(null); return new Uint8Array(c.response); });
      } const ba = b.print || console.log.bind(console); const D = b.printErr || console.warn.bind(console); for (m in k)k.hasOwnProperty(m) && (b[m] = k[m]); k = null; const ca = { 'f64-rem': function (a, c) { return a % c; }, debugger() {} }; let E; b.wasmBinary && (E = b.wasmBinary); typeof WebAssembly !== 'object' && D('no native wasm support detected');
      let F; let G = !1; function assert(a, c) { a || C(`Assertion failed: ${c}`); } function H(a) { const c = b[`_${a}`]; assert(c, `Cannot call unknown function ${a}, make sure it is exported`); return c; }
      function da(a, c, d, l) {
        const r = {
          string(a) {
            let c = 0; if (a !== null && void 0 !== a && a !== 0) {
              let p = (a.length << 2) + 1; c = I(p); let f = c; const e = J; if (p > 0) {
                p = f + p - 1; for (let d = 0; d < a.length; ++d) { let g = a.charCodeAt(d); if (g >= 55296 && g <= 57343) { const h = a.charCodeAt(++d); g = 65536 + ((g & 1023) << 10) | h & 1023; } if (g <= 127) { if (f >= p) break; e[f++] = g; } else { if (g <= 2047) { if (f + 1 >= p) break; e[f++] = 192 | g >> 6; } else { if (g <= 65535) { if (f + 2 >= p) break; e[f++] = 224 | g >> 12; } else { if (f + 3 >= p) break; e[f++] = 240 | g >> 18; e[f++] = 128 | g >> 12 & 63; }e[f++] = 128 | g >> 6 & 63; }e[f++] = 128 | g & 63; } }e[f] = 0;
              }
            } return c;
          },
          array(a) { const c = I(a.length); K.set(a, c); return c; },
        }; const h = H(a); const t = []; a = 0; if (l) for (let u = 0; u < l.length; u++) { const V = r[d[u]]; V ? (a === 0 && (a = ea()), t[u] = V(l[u])) : t[u] = l[u]; }d = h.apply(null, t); d = (function (a) {
          if (c === 'string') {
            if (a) {
              for (var d = J, h = a + void 0, f = a; d[f] && !(f >= h);)++f; if (f - a > 16 && d.subarray && L)a = L.decode(d.subarray(a, f)); else {
                for (h = ''; a < f;) {
                  let e = d[a++]; if (e & 128) {
                    const t = d[a++] & 63; if ((e & 224) == 192)h += String.fromCharCode((e & 31) << 6 | t); else {
                      const g = d[a++] & 63; e = (e & 240) == 224 ? (e & 15) << 12 | t << 6 | g : (e & 7)
<< 18 | t << 12 | g << 6 | d[a++] & 63; e < 65536 ? h += String.fromCharCode(e) : (e -= 65536, h += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023));
                    }
                  } else h += String.fromCharCode(e);
                }a = h;
              }
            } else a = '';
          } else a = c === 'boolean' ? !!a : a; return a;
        }(d)); a !== 0 && fa(a); return d;
      } var L = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : void 0; typeof TextDecoder !== 'undefined' && new TextDecoder('utf-16le'); let buffer; let K; let J; let M; let N = b.TOTAL_MEMORY || 16777216; b.wasmMemory ? F = b.wasmMemory : F = new WebAssembly.Memory({ initial: N / 65536, maximum: N / 65536 });
      F && (buffer = F.buffer); N = buffer.byteLength; const O = buffer; buffer = O; b.HEAP8 = K = new Int8Array(O); b.HEAP16 = new Int16Array(O); b.HEAP32 = M = new Int32Array(O); b.HEAPU8 = J = new Uint8Array(O); b.HEAPU16 = new Uint16Array(O); b.HEAPU32 = new Uint32Array(O); b.HEAPF32 = new Float32Array(O); b.HEAPF64 = new Float64Array(O); M[680] = 5245632; function P(a) { for (;a.length > 0;) { const c = a.shift(); if (typeof c === 'function')c(); else { const d = c.l; typeof d === 'number' ? void 0 === c.j ? b.dynCall_v(d) : b.dynCall_vi(d, c.j) : d(void 0 === c.j ? null : c.j); } } }
      const Q = []; const ha = []; const ia = []; const R = []; function ja() { const a = b.preRun.shift(); Q.unshift(a); } let S = 0; let T = null; let U = null; b.preloadedImages = {}; b.preloadedAudios = {}; function W() { const a = X; return String.prototype.startsWith ? a.startsWith('data:application/octet-stream;base64,') : a.indexOf('data:application/octet-stream;base64,') === 0; } var X = 'primesc.wasm'; if (!W()) { const ka = X; X = b.locateFile ? b.locateFile(ka, x) : x + ka; }
      function la() { try { if (E) return new Uint8Array(E); if (z) return z(X); throw 'both async and sync fetching of the wasm failed'; } catch (a) { C(a); } } function ma() { return E || !n && !q || typeof fetch !== 'function' ? new Promise(((a) => { a(la()); })) : fetch(X, { credentials: 'same-origin' }).then((a) => { if (!a.ok) throw `failed to load wasm binary file at '${X}'`; return a.arrayBuffer(); }).catch(() => la()); }
      function na(a) {
        function c(a) { b.asm = a.exports; S--; b.monitorRunDependencies && b.monitorRunDependencies(S); S == 0 && (T !== null && (clearInterval(T), T = null), U && (a = U, U = null, a())); } function d(a) { c(a.instance); } function l(a) { return ma().then(a => WebAssembly.instantiate(a, r)).then(a, (a) => { D(`failed to asynchronously prepare wasm: ${a}`); C(a); }); } var r = {
          env: a, wasi_unstable: a, global: { NaN, Infinity }, 'global.Math': Math, asm2wasm: ca,
        }; S++; b.monitorRunDependencies && b.monitorRunDependencies(S);
        if (b.instantiateWasm) try { return b.instantiateWasm(r, c); } catch (h) { return D(`Module.instantiateWasm callback failed with error: ${h}`), !1; }(function () { if (E || typeof WebAssembly.instantiateStreaming !== 'function' || W() || typeof fetch !== 'function') return l(d); fetch(X, { credentials: 'same-origin' }).then(a => WebAssembly.instantiateStreaming(a, r).then(d, (a) => { D(`wasm streaming compile failed: ${a}`); D('falling back to ArrayBuffer instantiation'); l(d); })); }()); return {};
      }
      b.asm = function (a, c) { c.memory = F; c.table = new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' }); c.__memory_base = 1024; c.__table_base = 0; return na(c); }; function oa() { C('OOM'); } const pa = b.asm({}, {
        b(a) { b.___errno_location && (M[b.___errno_location() >> 2] = a); return a; }, e() { return K.length; }, d(a) { oa(a); }, c: oa, a: 2720,
      }, buffer); b.asm = pa; b._calc_prime_c = function () { return b.asm.f.apply(null, arguments); };
      var I = b.stackAlloc = function () { return b.asm.g.apply(null, arguments); }; var fa = b.stackRestore = function () { return b.asm.h.apply(null, arguments); }; var ea = b.stackSave = function () { return b.asm.i.apply(null, arguments); }; b.asm = pa; b.cwrap = function (a, c, d, l) { d = d || []; const r = d.every(a => a === 'number'); return c !== 'string' && r && !l ? H(a) : function () { return da(a, c, d, arguments); }; }; let Y; b.then = function (a) { if (Y)a(b); else { const c = b.onRuntimeInitialized; b.onRuntimeInitialized = function () { c && c(); a(b); }; } return b; };
      U = function qa() { Y || Z(); Y || (U = qa); };
      function Z() { function a() { if (!Y && (Y = !0, !G)) { P(ha); P(ia); if (b.onRuntimeInitialized)b.onRuntimeInitialized(); if (b.postRun) for (typeof b.postRun === 'function' && (b.postRun = [b.postRun]); b.postRun.length;) { const a = b.postRun.shift(); R.unshift(a); }P(R); } } if (!(S > 0)) { if (b.preRun) for (typeof b.preRun === 'function' && (b.preRun = [b.preRun]); b.preRun.length;)ja(); P(Q); S > 0 || (b.setStatus ? (b.setStatus('Running...'), setTimeout(() => { setTimeout(() => { b.setStatus(''); }, 1); a(); }, 1)) : a()); } }b.run = Z;
      function C(a) { if (b.onAbort)b.onAbort(a); ba(a); D(a); G = !0; throw `abort(${a}). Build with -s ASSERTIONS=1 for more info.`; }b.abort = C; if (b.preInit) for (typeof b.preInit === 'function' && (b.preInit = [b.preInit]); b.preInit.length > 0;)b.preInit.pop()(); Z();


      return Module;
    }
  );
}());
if (typeof exports === 'object' && typeof module === 'object') module.exports = Module;
else if (typeof define === 'function' && define.amd) define([], () => Module);
else if (typeof exports === 'object') exports.Module = Module;
