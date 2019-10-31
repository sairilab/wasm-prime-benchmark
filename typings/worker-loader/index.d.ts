declare module 'worker!*' {
  class WebPackWorker extends Worker {
    constructor();
  }

  export default WebPackWorker;
}