import {AudioEcosystem} from './AudioEcosystem';
import {Observable} from './Observable';
import {getPitch} from './pitch';

export class MicObservable {
  /** used composition to avoid external clients controlling `.notify()` */
  private observable = new Observable<GetPitchReturnType>();
  private updateInterval: number | undefined;
  private audioEcosystem: AudioEcosystem;

  constructor(audioEcosystem: AudioEcosystem) {
    this.audioEcosystem = audioEcosystem;
  }

  isRunning() {
    return this.updateInterval !== undefined;
  }

  subscribe(func: TObserver<GetPitchReturnType>) {
    this.observable.subscribe(func);
  }

  unsubscribe(func: TObserver<GetPitchReturnType>) {
    this.observable.unsubscribe(func);
  }

  private updatePitch() {
    const frecuency = getPitch(this.audioEcosystem);
    this.observable.notify(frecuency);
  }

  /** Starts mic listening */
  start() {
    if (!this.isRunning()) {
      this.updatePitch();
      this.updateInterval = setInterval(this.updatePitch.bind(this), 50);
    }
  }

  stop() {
    clearInterval(this.updateInterval);
    this.observable.unsubscribeAll();
    this.updateInterval = undefined;
  }
}
