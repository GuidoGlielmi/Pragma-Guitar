import {PitchDetector} from 'pitchy';
import {Observable} from './Observable';
import {getPitch} from './pitch';

const buflen = 2048;

const pitchDetector = PitchDetector.forFloat32Array(buflen);

const buf = new Float32Array(buflen);

class MicObservable {
  private observable = new Observable<number>();
  private updateInterval: number | undefined;

  isRunning() {
    return this.updateInterval !== undefined;
  }

  updatePitch() {
    const frecuency = getPitch(pitchDetector, buf);
    if (frecuency !== null) this.observable.notify(frecuency);
  }

  start(func: TObserver<number>) {
    this.observable.subscribe(func);
    if (!this.isRunning()) {
      this.updatePitch();
      this.updateInterval = setInterval(this.updatePitch.bind(this), 50);
    }
  }

  stop(func: TObserver<number>) {
    clearInterval(this.updateInterval);
    this.observable.unsubscribe(func);
    this.updateInterval = undefined;
  }
}

export const micObservable = new MicObservable();
