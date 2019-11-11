<template>
  <div class="calc-result columns">
    <div class="lang-logo">
      <img :src="logo" alt="">
    </div>
    <div class="results-wrapper">
      <p>{{ language }}: {{ prime }}</p>
      <p>Time: {{ time }} msec</p>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';
import primeModules from '@/store/modules/primeModules';

@Component
export default class CalcResult extends Vue {
  @Prop({ default: '' })
  language!: string;

  public time = 0;

  public prime = 0;

  public async created() {
    const task = async () => {
      this.prime = 0;
      const start = performance.now();
      const timer = setInterval(() => { this.time = performance.now() - start; }, 1);

      await primeModules.calcWith(this.language);

      clearInterval(timer);
      this.prime = this.resultPrime || 0;
      this.time = this.resultTime || 0;
    };
    this.$store.state.calcTasks.push(task);
  }

  get mod() {
    return primeModules.findModule(this.language);
  }

  get logo() {
    return this.mod.logo;
  }

  get resultPrime() {
    return this.mod.result?.prime;
  }

  get resultTime() {
    return this.mod.result?.time;
  }
}
</script>

<style lang="scss" scoped>
.calc-result {
  margin-top: 0px;
}

.lang-logo {
  max-width: 100px;
  max-height: 100px;

  img {
    display: block;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
  }
}

.results-wrapper {
  font-size: 1.5em;
  margin-top: 15px;
  margin-left: 15px;
}
</style>
