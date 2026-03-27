import * as THREE from "three";

export class SoundEngine {
  constructor(camera) {
    this.listener = new THREE.AudioListener();
    camera.add(this.listener);
    this.sounds = {};
    this.loader = new THREE.AudioLoader();
  }
  load(name, path, { loop = true, volume = 0.5, autoplay = false } = {}) {
    const sound = new THREE.Audio(this.listener);
    this.loader.load(path, (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(loop);
      sound.setVolume(volume);
      if (autoplay) sound.play();
    });
    this.sounds[name] = sound;
  }

  play(name) {
    const sound = this.sounds[name];
    if (sound && !sound.isPlaying) sound.play();
  }
  stop(name) {
    const sound = this.sounds[name];
    if (sound && sound.isPlaying) sound.stop();
  }

  setVolume(name, volume) {
    const sound = this.sounds[name];
    if (sound) sound.setVolume(volume);
  }
}
