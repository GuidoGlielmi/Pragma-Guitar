export class AudioEcosystem extends AudioContext {
  // the audio context is, among other things, a NODES factory.
  // each possible NODE represents a media processor of some kind

  private audio?: AudioScheduledSourceNode;
  private analyser: AnalyserNode;
  private gain?: GainNode;

  private micStream?: MediaStream; // .stop() renders the stream unusable
  private micSource?: MediaStreamAudioSourceNode; // a node is the main required element of an AudioContext

  constructor() {
    super();
    this.analyser = this.createAnalyser();
    this.analyser.fftSize = 2048;
    this.suspend();
  }

  get areStreamsEmpty() {
    return !!this.micStream;
  }

  getAnalyserFloatTimeDomainData(array: Float32Array) {
    return this.analyser.getFloatTimeDomainData(array);
  }

  async resume() {
    this.stopAudio();
    return super.resume();
  }

  async suspend() {
    // a connected node resumes playback when resuming the AudioContext
    this.stopMic();
    this.audio?.disconnect();
    return super.suspend();
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

  async getInputDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(d => d.kind === 'audioinput');
  }

  async loadAudioFile(filePath: string) {
    const response = await fetch(filePath);
    const buffer = await response.arrayBuffer();
    return this.decodeAudioData(buffer);
  }

  getDeviceId(device: MediaStream) {
    return device.getAudioTracks()[0].getSettings().deviceId;
  }

  startAudioNode(
    newAudioNode?: AudioScheduledSourceNode,
    lastNode: AudioNode = newAudioNode as AudioNode,
  ) {
    this.stopMic();
    // creating another node without stopping the other can cause it to resume when the context does
    this.stopAudio();
    this.audio = newAudioNode;
    lastNode?.connect(this.destination);
    newAudioNode?.start();
  }

  async startMic() {
    // stream enabled -> this.micStream?.getAudioTracks()[0].readyState === 'live';
    this.stopAudio();
    this.micSource = this.createMediaStreamSource(this.micStream!);
    this.micSource.connect(this.analyser);
  }

  stopMic() {
    // the way the browser knows the mic is being used is if there is an active track on the micStream (not stopped)
    this.micStream?.getAudioTracks().forEach(at => at.stop());
    this.micSource?.disconnect();
    this.micSource = undefined;
  }

  stopAudio() {
    this.#fadeOutGainNode();
    this.audio?.stop(this.#fadeStopTime);
    this.audio = undefined;
    // when an AudioNode get stopped and no references are left it will disconnect itself and it is thus not needed to explicitly call disconnect() after stop().
  }

  async setOscillatorFrecuency(frecuency: number) {
    if (frecuency) {
      const osc = this.buildOscillator(frecuency);
      const gainNode = this.#connectFadeInGainNode(osc); // changing a gain node value while live create a pop
      this.startAudioNode(osc, gainNode);
      this.gain = gainNode;
    } else {
      this.stopAudio();
      if (!this.micSource) this.startMic();
    }
  }

  buildOscillator(oscFrecuency: number) {
    const oscillatorNode = this.createOscillator();
    oscillatorNode.frequency.value = oscFrecuency;
    return oscillatorNode;
  }

  #connectFadeInGainNode(targetNode: AudioNode) {
    const gainNode = this.createGain();
    gainNode.gain.setValueAtTime(0, this.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, this.#fadeStopTime);
    targetNode.connect(gainNode); // the connected node is the last part of the chain that should be connected to the destination
    return gainNode;
  }

  #fadeOutGainNode(gainNode = this.gain) {
    gainNode?.gain.setValueAtTime(gainNode?.gain.value, this.currentTime);
    gainNode?.gain?.linearRampToValueAtTime(0.0001, this.#fadeStopTime);
  }

  get #fadeStopTime() {
    return this.currentTime + 0.1;
  }

  playBuffer(buffer: AudioBuffer) {
    const audioNode = this.#createBufferSourceNode(buffer);
    this.audio = audioNode;
    audioNode.connect(this.destination);
    audioNode.start();
  }

  #createBufferSourceNode(buffer: AudioBuffer) {
    const audioNode = this.createBufferSource();
    audioNode.buffer = buffer;
    return audioNode;
  }
}
