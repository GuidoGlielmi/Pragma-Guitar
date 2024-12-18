export class AudioEcosystem extends AudioContext {
  // the audio context is, among other things, a NODES factory.
  // each possible NODE represents a media processor of some kind

  private audio?: AudioScheduledSourceNode;
  private analyser: AnalyserNode;
  private gain = this.createGain();

  private micStream?: MediaStream; // .stop() renders the stream unusable
  private micSource?: MediaStreamAudioSourceNode; // a node is the main required element of an AudioContext

  static buflen = 2048;
  static buf = new Float32Array(AudioEcosystem.buflen);

  constructor() {
    super();
    this.analyser = this.createAnalyser();
    this.analyser.fftSize = 2048;
    this.suspend();
  }

  async suspend() {
    this.stopAudio(true);
    await super.suspend();
  }

  get areStreamsEmpty() {
    return !!this.micStream;
  }

  getAnalyserFloatTimeDomainData(array: Float32Array) {
    this.analyser.getFloatTimeDomainData(array);
  }

  getAnalyserFrequencyBitCount() {
    return this.analyser.frequencyBinCount;
  }

  // -------------------------

  get #micStopped() {
    return !this.micStream || this.micStream.getAudioTracks()[0].readyState === 'ended';
  }

  async getMicInputStream(deviceId?: string) {
    // different mics can record at the same time by using .addTrack() on the stream obtained through .getUserMedia
    this.micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId,
        echoCancellation: true,
        autoGainControl: false,
        noiseSuppression: true,
      },
    });
    return this.micStream;
  }

  async startMic() {
    // functions shouldn't turn off anything but themselves!
    if (this.#micStopped) await this.getMicInputStream();
    this.micSource = this.createMediaStreamSource(this.micStream!);
    this.micSource.connect(this.analyser);
  }

  stopMic() {
    // the way the browser knows the mic is being used is if there is an active track on the micStream (not stopped)
    this.micStream?.getAudioTracks().forEach(at => at.stop());
    this.micSource?.disconnect();
    this.micSource = undefined;
  }

  pauseMic() {
    this.micSource?.disconnect();
    this.micSource = undefined;
  }

  // -------------------------

  async getInputDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(d => d.kind === 'audioinput');
  }

  getDeviceId(device: MediaStream) {
    return device.getAudioTracks()[0].getSettings().deviceId;
  }

  // -------------------------

  startAudio(newAudioNode: AudioScheduledSourceNode) {
    this.audio = newAudioNode;
    newAudioNode?.start();
  }

  stopAudio(force = false) {
    this.audio?.stop(this.#stopTime);
    if (force) this.audio?.disconnect(); // necessary to avoid resuming the audio on AudioContext.resume()
    this.audio = undefined;
  }

  // -------------------------

  get #fadeStopTime() {
    return this.currentTime + 0.1;
  }

  get #stopTime() {
    return this.#fadeStopTime + 0.05;
  }

  // -------------------------

  #buildOscillator(oscFrecuency: number) {
    const oscillatorNode = this.createOscillator();
    oscillatorNode.frequency.value = oscFrecuency;
    return oscillatorNode;
  }

  #increaseOscVolume(oscNode: AudioScheduledSourceNode) {
    this.gain.gain.setValueAtTime(0, this.currentTime);
    this.gain.gain.linearRampToValueAtTime(1, this.#fadeStopTime);
    oscNode.connect(this.gain);
    this.gain.connect(this.destination);
  }

  #decreaseOscVolume() {
    this.gain.gain.setValueAtTime(this.gain.gain.value, this.currentTime);
    this.gain.gain.linearRampToValueAtTime(0.00001, this.#fadeStopTime);
  }

  setOscillatorFrecuency(frecuency: number) {
    if (frecuency) {
      const osc = this.#buildOscillator(frecuency);
      this.#increaseOscVolume(osc);
      this.startAudio(osc);
    } else {
      this.#decreaseOscVolume();
      this.stopAudio();
    }
  }

  // -------------------------

  async loadAudioFile(filePath: string) {
    const response = await fetch(filePath);
    const buffer = await response.arrayBuffer();
    return this.decodeAudioData(buffer);
  }

  #createBufferSourceNode(buffer: AudioBuffer) {
    const audioNode = this.createBufferSource();
    audioNode.buffer = buffer;
    return audioNode;
  }

  #stopBuffer() {
    const gainNode = this.#createFadeOutGain();
    this.audio?.connect(gainNode);
    this.audio?.disconnect(this.destination);
    gainNode.connect(this.destination);
    this.stopAudio();
  }

  playBuffer(buffer: AudioBuffer, overlapping: boolean = true) {
    if (!overlapping) this.#stopBuffer();
    this.audio?.stop();

    const audioNode = this.#createBufferSourceNode(buffer);
    this.audio = audioNode;
    audioNode.connect(this.destination);
    audioNode.start();
  }

  // ------------------------

  #createFadeOutGain() {
    const gainNode = this.createGain();
    gainNode.gain.setValueAtTime(gainNode.gain.value, this.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.00001, this.#fadeStopTime);
    return gainNode;
  }
}
