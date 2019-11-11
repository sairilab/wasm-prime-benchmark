/* eslint-disable global-require */

import {
  Module, VuexModule, Mutation, Action, getModule, MutationAction,
} from 'vuex-module-decorators';

import store from '@/store/index';

interface Result {
  time: number;
  prime: number;
}

interface PrimeModule {
  language: string;
  logo: string;
  worker?: Worker;
  result?: Result;
}

const availableModules: PrimeModule[] = [
  {
    language: 'Go',
    logo: require('@/assets/gopher2.png'),
  },
  {
    language: 'C',
    logo: require('@/assets/c-logo.png'),
  },
  {
    language: 'Rust',
    logo: require('@/assets/rustlogo.png'),
  },
  {
    language: 'TypeScript',
    logo: require('@/assets/ts-logo.png'),
  },
];

@Module({ dynamic: true, store, name: 'primeModules' })
class PrimeModules extends VuexModule {
  private primeModules: PrimeModule[] = availableModules;

  get availableLanguages() {
    return this.primeModules.map(m => m.language);
  }

  get findModule() {
    return (language: string) => {
      const mod = this.primeModules.find(m => m.language === language);
      return mod as PrimeModule;
    };
  }

  @Mutation
  private updateModule(mod: PrimeModule) {
    this.primeModules = [
      mod,
      ...this.primeModules.filter(m => m.language !== mod.language),
    ];
  }

  @Action({ commit: 'updateModule' })
  public async calcWith(language: string): Promise<PrimeModule> {
    return new Promise((resolve) => {
      const mod = this.findModule(language);
      const worker = mod.worker as Worker;

      worker.onmessage = (e) => {
        const { result: prime, time } = e.data;
        mod.result = {
          prime,
          time,
        };
        resolve(mod);
      };

      worker.postMessage({ target: store.state.target });
    });
  }

  // @Action({})
  // public async calcAll() {
  //   return Promise.all(this.availableLanguages.map(l => this.calcWith(l)));
  // }

  private static chackInit(worker: Worker) {
    return new Promise((resolve) => {
      // eslint-disable-next-line no-param-reassign
      worker.onmessage = (e) => {
        if (e.data === 'initialized') {
          resolve();
        }
      };
    });
  }

  @Action({ commit: 'updateModule' })
  private async initTypeScript(): Promise<PrimeModule> {
    const mod = this.findModule('TypeScript');
    const worker = new Worker('@/workers/jsprime.worker', { type: 'module' });
    mod.worker = worker;

    await PrimeModules.chackInit(worker);

    return mod;
  }

  @Action({ commit: 'updateModule' })
  private async initRust(): Promise<PrimeModule> {
    const mod = this.findModule('Rust');
    const worker = new Worker('@/workers/rustwasm.worker', { type: 'module' });
    mod.worker = worker;

    await PrimeModules.chackInit(worker);

    return mod;
  }

  @Action({ commit: 'updateModule' })
  private async initClang(): Promise<PrimeModule> {
    const mod = this.findModule('C');
    const worker = new Worker('@/workers/cwasm.worker', { type: 'module' });
    mod.worker = worker;

    await PrimeModules.chackInit(worker);

    return mod;
  }

  @Action({ commit: 'updateModule' })
  private async initGo(): Promise<PrimeModule> {
    const mod = this.findModule('Go');
    const worker = new Worker('@/workers/gowasm.worker', { type: 'module' });
    mod.worker = worker;

    await PrimeModules.chackInit(worker);

    return mod;
  }

  @Action({ rawError: true })
  public async initModules() {
    await Promise.all([
      this.initTypeScript(),
      this.initRust(),
      this.initClang(),
      this.initGo(),
    ]);
  }
}

export default getModule(PrimeModules);
