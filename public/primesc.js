var Module = typeof Module !== 'undefined' ? Module : {}; let moduleOverrides = {}; let key; for (key in Module) { if (Module.hasOwnProperty(key)) { moduleOverrides[key] = Module[key]; } } let arguments_ = []; let thisProgram = './this.program'; let quit_ = function (status, toThrow) { throw toThrow; }; let ENVIRONMENT_IS_WEB = false; let ENVIRONMENT_IS_WORKER = false; let ENVIRONMENT_IS_NODE = false; let ENVIRONMENT_HAS_NODE = false; let ENVIRONMENT_IS_SHELL = false; ENVIRONMENT_IS_WEB = typeof window === 'object'; ENVIRONMENT_IS_WORKER = typeof importScripts === 'function'; ENVIRONMENT_HAS_NODE = typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string'; ENVIRONMENT_IS_NODE = ENVIRONMENT_HAS_NODE && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER; ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER; let scriptDirectory = ''; function locateFile(path) { if (Module.locateFile) { return Module.locateFile(path, scriptDirectory); } return scriptDirectory + path; } let read_; let readAsync; let readBinary; let setWindowTitle; if (ENVIRONMENT_IS_NODE) { scriptDirectory = `${__dirname}/`; let nodeFS; let nodePath; read_ = function shell_read(filename, binary) { let ret; if (!nodeFS)nodeFS = require('fs'); if (!nodePath)nodePath = require('path'); filename = nodePath.normalize(filename); ret = nodeFS.readFileSync(filename); return binary ? ret : ret.toString(); }; readBinary = function readBinary(filename) { let ret = read_(filename, true); if (!ret.buffer) { ret = new Uint8Array(ret); }assert(ret.buffer); return ret; }; if (process.argv.length > 1) { thisProgram = process.argv[1].replace(/\\/g, '/'); }arguments_ = process.argv.slice(2); if (typeof module !== 'undefined') { module.exports = Module; }process.on('uncaughtException', (ex) => { if (!(ex instanceof ExitStatus)) { throw ex; } }); process.on('unhandledRejection', abort); quit_ = function (status) { process.exit(status); }; Module.inspect = function () { return '[Emscripten Module object]'; }; } else if (ENVIRONMENT_IS_SHELL) { if (typeof read !== 'undefined') { read_ = function shell_read(f) { return read(f); }; }readBinary = function readBinary(f) { let data; if (typeof readbuffer === 'function') { return new Uint8Array(readbuffer(f)); }data = read(f, 'binary'); assert(typeof data === 'object'); return data; }; if (typeof scriptArgs !== 'undefined') { arguments_ = scriptArgs; } else if (typeof arguments !== 'undefined') { arguments_ = arguments; } if (typeof quit === 'function') { quit_ = function (status) { quit(status); }; } if (typeof print !== 'undefined') { if (typeof console === 'undefined')console = {}; console.log = print; console.warn = console.error = typeof printErr !== 'undefined' ? printErr : print; } } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) { if (ENVIRONMENT_IS_WORKER) { scriptDirectory = self.location.href; } else if (document.currentScript) { scriptDirectory = document.currentScript.src; } if (scriptDirectory.indexOf('blob:') !== 0) { scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf('/') + 1); } else { scriptDirectory = ''; }read_ = function shell_read(url) { const xhr = new XMLHttpRequest(); xhr.open('GET', url, false); xhr.send(null); return xhr.responseText; }; if (ENVIRONMENT_IS_WORKER) { readBinary = function readBinary(url) { const xhr = new XMLHttpRequest(); xhr.open('GET', url, false); xhr.responseType = 'arraybuffer'; xhr.send(null); return new Uint8Array(xhr.response); }; }readAsync = function readAsync(url, onload, onerror) { const xhr = new XMLHttpRequest(); xhr.open('GET', url, true); xhr.responseType = 'arraybuffer'; xhr.onload = function xhr_onload() { if (xhr.status == 200 || xhr.status == 0 && xhr.response) { onload(xhr.response); return; }onerror(); }; xhr.onerror = onerror; xhr.send(null); }; setWindowTitle = function (title) { document.title = title; }; } else {} const out = Module.print || console.log.bind(console); const err = Module.printErr || console.warn.bind(console); for (key in moduleOverrides) { if (moduleOverrides.hasOwnProperty(key)) { Module[key] = moduleOverrides[key]; } }moduleOverrides = null; if (Module.arguments)arguments_ = Module.arguments; if (Module.thisProgram)thisProgram = Module.thisProgram; if (Module.quit)quit_ = Module.quit; const asm2wasmImports = { 'f64-rem': function (x, y) { return x % y; }, debugger() {} }; const functionPointers = new Array(0); let wasmBinary; if (Module.wasmBinary)wasmBinary = Module.wasmBinary; let noExitRuntime; if (Module.noExitRuntime)noExitRuntime = Module.noExitRuntime; if (typeof WebAssembly !== 'object') { err('no native wasm support detected'); } let wasmMemory; let wasmTable; let ABORT = false; let EXITSTATUS = 0; function assert(condition, text) { if (!condition) { abort(`Assertion failed: ${text}`); } } function getCFunc(ident) { const func = Module[`_${ident}`]; assert(func, `Cannot call unknown function ${ident}, make sure it is exported`); return func; } function ccall(ident, returnType, argTypes, args, opts) { const toC = { string(str) { let ret = 0; if (str !== null && str !== undefined && str !== 0) { const len = (str.length << 2) + 1; ret = stackAlloc(len); stringToUTF8(str, ret, len); } return ret; }, array(arr) { const ret = stackAlloc(arr.length); writeArrayToMemory(arr, ret); return ret; } }; function convertReturnValue(ret) { if (returnType === 'string') return UTF8ToString(ret); if (returnType === 'boolean') return Boolean(ret); return ret; } const func = getCFunc(ident); const cArgs = []; let stack = 0; if (args) { for (let i = 0; i < args.length; i++) { const converter = toC[argTypes[i]]; if (converter) { if (stack === 0)stack = stackSave(); cArgs[i] = converter(args[i]); } else { cArgs[i] = args[i]; } } } let ret = func.apply(null, cArgs); ret = convertReturnValue(ret); if (stack !== 0)stackRestore(stack); return ret; } function cwrap(ident, returnType, argTypes, opts) { argTypes = argTypes || []; const numericArgs = argTypes.every(type => type === 'number'); const numericRet = returnType !== 'string'; if (numericRet && numericArgs && !opts) { return getCFunc(ident); } return function () { return ccall(ident, returnType, argTypes, arguments, opts); }; } const UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined; function UTF8ArrayToString(u8Array, idx, maxBytesToRead) { const endIdx = idx + maxBytesToRead; let endPtr = idx; while (u8Array[endPtr] && !(endPtr >= endIdx))++endPtr; if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) { return UTF8Decoder.decode(u8Array.subarray(idx, endPtr)); } else { var str = ''; while (idx < endPtr) { let u0 = u8Array[idx++]; if (!(u0 & 128)) { str += String.fromCharCode(u0); continue; } const u1 = u8Array[idx++] & 63; if ((u0 & 224) == 192) { str += String.fromCharCode((u0 & 31) << 6 | u1); continue; } const u2 = u8Array[idx++] & 63; if ((u0 & 240) == 224) { u0 = (u0 & 15) << 12 | u1 << 6 | u2; } else { u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u8Array[idx++] & 63; } if (u0 < 65536) { str += String.fromCharCode(u0); } else { const ch = u0 - 65536; str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023); } } } return str; } function UTF8ToString(ptr, maxBytesToRead) { return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ''; } function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) { if (!(maxBytesToWrite > 0)) return 0; const startIdx = outIdx; const endIdx = outIdx + maxBytesToWrite - 1; for (let i = 0; i < str.length; ++i) { let u = str.charCodeAt(i); if (u >= 55296 && u <= 57343) { const u1 = str.charCodeAt(++i); u = 65536 + ((u & 1023) << 10) | u1 & 1023; } if (u <= 127) { if (outIdx >= endIdx) break; outU8Array[outIdx++] = u; } else if (u <= 2047) { if (outIdx + 1 >= endIdx) break; outU8Array[outIdx++] = 192 | u >> 6; outU8Array[outIdx++] = 128 | u & 63; } else if (u <= 65535) { if (outIdx + 2 >= endIdx) break; outU8Array[outIdx++] = 224 | u >> 12; outU8Array[outIdx++] = 128 | u >> 6 & 63; outU8Array[outIdx++] = 128 | u & 63; } else { if (outIdx + 3 >= endIdx) break; outU8Array[outIdx++] = 240 | u >> 18; outU8Array[outIdx++] = 128 | u >> 12 & 63; outU8Array[outIdx++] = 128 | u >> 6 & 63; outU8Array[outIdx++] = 128 | u & 63; } }outU8Array[outIdx] = 0; return outIdx - startIdx; } function stringToUTF8(str, outPtr, maxBytesToWrite) { return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite); } const UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined; function writeArrayToMemory(array, buffer) { HEAP8.set(array, buffer); } const WASM_PAGE_SIZE = 65536; let buffer; let HEAP8; let HEAPU8; let HEAP16; let HEAPU16; let HEAP32; let HEAPU32; let HEAPF32; let HEAPF64; function updateGlobalBufferAndViews(buf) { buffer = buf; Module.HEAP8 = HEAP8 = new Int8Array(buf); Module.HEAP16 = HEAP16 = new Int16Array(buf); Module.HEAP32 = HEAP32 = new Int32Array(buf); Module.HEAPU8 = HEAPU8 = new Uint8Array(buf); Module.HEAPU16 = HEAPU16 = new Uint16Array(buf); Module.HEAPU32 = HEAPU32 = new Uint32Array(buf); Module.HEAPF32 = HEAPF32 = new Float32Array(buf); Module.HEAPF64 = HEAPF64 = new Float64Array(buf); } const DYNAMIC_BASE = 5245632; const DYNAMICTOP_PTR = 2720; let INITIAL_TOTAL_MEMORY = Module.TOTAL_MEMORY || 16777216; if (Module.wasmMemory) { wasmMemory = Module.wasmMemory; } else { wasmMemory = new WebAssembly.Memory({ initial: INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE, maximum: INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE }); } if (wasmMemory) { buffer = wasmMemory.buffer; }INITIAL_TOTAL_MEMORY = buffer.byteLength; updateGlobalBufferAndViews(buffer); HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE; function callRuntimeCallbacks(callbacks) { while (callbacks.length > 0) { const callback = callbacks.shift(); if (typeof callback === 'function') { callback(); continue; } const { func } = callback; if (typeof func === 'number') { if (callback.arg === undefined) { Module.dynCall_v(func); } else { Module.dynCall_vi(func, callback.arg); } } else { func(callback.arg === undefined ? null : callback.arg); } } } const __ATPRERUN__ = []; const __ATINIT__ = []; const __ATMAIN__ = []; const __ATPOSTRUN__ = []; let runtimeInitialized = false; function preRun() { if (Module.preRun) { if (typeof Module.preRun === 'function')Module.preRun = [Module.preRun]; while (Module.preRun.length) { addOnPreRun(Module.preRun.shift()); } }callRuntimeCallbacks(__ATPRERUN__); } function initRuntime() { runtimeInitialized = true; callRuntimeCallbacks(__ATINIT__); } function preMain() { callRuntimeCallbacks(__ATMAIN__); } function postRun() { if (Module.postRun) { if (typeof Module.postRun === 'function')Module.postRun = [Module.postRun]; while (Module.postRun.length) { addOnPostRun(Module.postRun.shift()); } }callRuntimeCallbacks(__ATPOSTRUN__); } function addOnPreRun(cb) { __ATPRERUN__.unshift(cb); } function addOnPreMain(cb) { __ATMAIN__.unshift(cb); } function addOnPostRun(cb) { __ATPOSTRUN__.unshift(cb); } let runDependencies = 0; let runDependencyWatcher = null; let dependenciesFulfilled = null; function addRunDependency(id) { runDependencies++; if (Module.monitorRunDependencies) { Module.monitorRunDependencies(runDependencies); } } function removeRunDependency(id) { runDependencies--; if (Module.monitorRunDependencies) { Module.monitorRunDependencies(runDependencies); } if (runDependencies == 0) { if (runDependencyWatcher !== null) { clearInterval(runDependencyWatcher); runDependencyWatcher = null; } if (dependenciesFulfilled) { const callback = dependenciesFulfilled; dependenciesFulfilled = null; callback(); } } }Module.preloadedImages = {}; Module.preloadedAudios = {}; const dataURIPrefix = 'data:application/octet-stream;base64,'; function isDataURI(filename) { return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0; } let wasmBinaryFile = 'primesc.wasm'; if (!isDataURI(wasmBinaryFile)) { wasmBinaryFile = locateFile(wasmBinaryFile); } function getBinary() { try { if (wasmBinary) { return new Uint8Array(wasmBinary); } if (readBinary) { return readBinary(wasmBinaryFile); } throw 'both async and sync fetching of the wasm failed'; } catch (err) { abort(err); } } function getBinaryPromise() { if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === 'function') { return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then((response) => { if (!response.ok) { throw `failed to load wasm binary file at '${wasmBinaryFile}'`; } return response.arrayBuffer(); }).catch(() => getBinary()); } return new Promise(((resolve, reject) => { resolve(getBinary()); })); } function createWasm(env) {
  const info = {
    env, wasi_unstable: env, global: { NaN, Infinity }, 'global.Math': Math, asm2wasm: asm2wasmImports,
  }; function receiveInstance(instance, module) { const { exports } = instance; Module.asm = exports; removeRunDependency('wasm-instantiate'); }addRunDependency('wasm-instantiate'); function receiveInstantiatedSource(output) { receiveInstance(output.instance); } function instantiateArrayBuffer(receiver) { return getBinaryPromise().then(binary => WebAssembly.instantiate(binary, info)).then(receiver, (reason) => { err(`failed to asynchronously prepare wasm: ${reason}`); abort(reason); }); } function instantiateAsync() { if (!wasmBinary && typeof WebAssembly.instantiateStreaming === 'function' && !isDataURI(wasmBinaryFile) && typeof fetch === 'function') { fetch(wasmBinaryFile, { credentials: 'same-origin' }).then((response) => { const result = WebAssembly.instantiateStreaming(response, info); return result.then(receiveInstantiatedSource, (reason) => { err(`wasm streaming compile failed: ${reason}`); err('falling back to ArrayBuffer instantiation'); instantiateArrayBuffer(receiveInstantiatedSource); }); }); } else { return instantiateArrayBuffer(receiveInstantiatedSource); } } if (Module.instantiateWasm) { try { const exports = Module.instantiateWasm(info, receiveInstance); return exports; } catch (e) { err(`Module.instantiateWasm callback failed with error: ${e}`); return false; } }instantiateAsync(); return {};
}Module.asm = function (global, env, providedBuffer) { env.memory = wasmMemory; env.table = wasmTable = new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' }); env.__memory_base = 1024; env.__table_base = 0; const exports = createWasm(env); return exports; }; function _emscripten_get_heap_size() { return HEAP8.length; } function ___setErrNo(value) { if (Module.___errno_location)HEAP32[Module.___errno_location() >> 2] = value; return value; } function abortOnCannotGrowMemory(requestedSize) { abort('OOM'); } function _emscripten_resize_heap(requestedSize) { abortOnCannotGrowMemory(requestedSize); } const asmGlobalArg = {}; const asmLibraryArg = {
  b: ___setErrNo, e: _emscripten_get_heap_size, d: _emscripten_resize_heap, c: abortOnCannotGrowMemory, a: DYNAMICTOP_PTR,
}; const asm = Module.asm(asmGlobalArg, asmLibraryArg, buffer); Module.asm = asm; const _calc_prime_c = Module._calc_prime_c = function () { return Module.asm.f.apply(null, arguments); }; var stackAlloc = Module.stackAlloc = function () { return Module.asm.g.apply(null, arguments); }; var stackRestore = Module.stackRestore = function () { return Module.asm.h.apply(null, arguments); }; var stackSave = Module.stackSave = function () { return Module.asm.i.apply(null, arguments); }; Module.asm = asm; Module.cwrap = cwrap; let calledRun; function ExitStatus(status) { this.name = 'ExitStatus'; this.message = `Program terminated with exit(${status})`; this.status = status; }dependenciesFulfilled = function runCaller() { if (!calledRun)run(); if (!calledRun)dependenciesFulfilled = runCaller; }; function run(args) { args = args || arguments_; if (runDependencies > 0) { return; }preRun(); if (runDependencies > 0) return; function doRun() { if (calledRun) return; calledRun = true; if (ABORT) return; initRuntime(); preMain(); if (Module.onRuntimeInitialized)Module.onRuntimeInitialized(); postRun(); } if (Module.setStatus) { Module.setStatus('Running...'); setTimeout(() => { setTimeout(() => { Module.setStatus(''); }, 1); doRun(); }, 1); } else { doRun(); } }Module.run = run; function abort(what) { if (Module.onAbort) { Module.onAbort(what); }what += ''; out(what); err(what); ABORT = true; EXITSTATUS = 1; throw `abort(${what}). Build with -s ASSERTIONS=1 for more info.`; }Module.abort = abort; if (Module.preInit) { if (typeof Module.preInit === 'function')Module.preInit = [Module.preInit]; while (Module.preInit.length > 0) { Module.preInit.pop()(); } }noExitRuntime = true; run(); (function () { Module.ready = new Promise((resolve, reject) => { addOnPreMain(() => { const api = { calc_prime_c: Module.cwrap('calc_prime_c', 'number', ['number']) }; resolve(api); }); const origAbort = Module.abort; Module.abort = function (what) { reject(Error(what)); origAbort.call(this, what); }; }); }());
