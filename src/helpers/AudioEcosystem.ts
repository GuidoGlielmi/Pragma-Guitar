export class AudioEcosystem extends AudioContext {
  // the audio context is, among other things, a NODES factory.
  // each possible NODE represents a media processor of some kind
  audioNode?: AudioScheduledSourceNode;
  analyserNode: AnalyserNode;
  gainNode?: GainNode;

  micStream?: MediaStream;
  micNode?: MediaStreamAudioSourceNode; // a node is the main required element of an AudioContext

  constructor() {
    super();
    this.analyserNode = this.createAnalyser();
    this.analyserNode.fftSize = 2048;
    this.suspend();
  }

  async getPermittedDeviceId() {
    return (await navigator.mediaDevices.getUserMedia({audio: true}))
      .getAudioTracks()[0]
      .getSettings().deviceId;
  }

  async resume() {
    this.stopAudio();
    super.resume();
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

  async getMicInputStream(deviceId?: string) {
    return navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId,
        echoCancellation: true,
        autoGainControl: false,
        noiseSuppression: false,
        // latency: 0,
      },
    });
  }

  async setMicInputStreamHandler(deviceId?: string) {
    this.stopAudio();
    this.micStream = await this.getMicInputStream(deviceId);
    this.#startMic();
    return this.micStream.getAudioTracks()[0].getSettings().deviceId;
  }

  startAudioNode(
    newAudioNode?: AudioScheduledSourceNode,
    lastNode: AudioNode = newAudioNode as AudioNode,
  ) {
    this.#pauseMic();
    // creating another node without stopping the other can cause it to resume when the context does
    this.stopAudio();
    this.audioNode = newAudioNode;
    lastNode?.connect(this.destination);
    newAudioNode?.start();
  }

  #startMic() {
    if (!this.micStream) return;
    this.micStream.getAudioTracks()?.forEach(at => (at.enabled = true));
    this.micNode = this.createMediaStreamSource(this.micStream);
    this.micNode.connect(this.analyserNode);
  }

  #pauseMic() {
    this.micStream?.getAudioTracks()?.forEach(at => (at.enabled = false));
    this.micNode?.disconnect();
    this.micNode = undefined;
  }

  stopAudio() {
    this.#fadeOutGainNode();
    this.audioNode?.stop(this.#fadeStopTime);
    this.audioNode = undefined;
    // when an AudioNode get stopped and no references are left it will disconnect itself and it is thus not needed to explicitly call disconnect() after stop().
  }

  async setOscillatorFrecuency(frecuency: number) {
    if (frecuency) {
      const osc = this.buildOscillator(frecuency);
      const gainNode = this.#connectFadeInGainNode(osc); // changing a gain node value while live create a pop
      this.startAudioNode(osc, gainNode);
      this.gainNode = gainNode;
    } else {
      this.stopAudio();
      if (!this.micNode) this.#startMic();
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

  #fadeOutGainNode(gainNode = this.gainNode) {
    gainNode?.gain.setValueAtTime(gainNode?.gain.value, this.currentTime);
    gainNode?.gain?.linearRampToValueAtTime(0.0001, this.#fadeStopTime);
  }

  get #fadeStopTime() {
    return this.currentTime + 0.1;
  }

  playBuffer(buffer: AudioBuffer) {
    const audioNode = this.#createBufferSourceNode(buffer);
    audioNode.connect(this.destination);
    audioNode.start();
  }

  #createBufferSourceNode(buffer: AudioBuffer) {
    const audioNode = this.createBufferSource();
    audioNode.buffer = buffer;
    return audioNode;
  }
}