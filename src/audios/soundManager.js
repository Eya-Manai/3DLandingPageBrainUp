import { SoundEngine } from "./audioEngine";

export class SoundManager {
  constructor(camera, sky) {
    this.soundEngine = new SoundEngine(camera);
    this.sky = sky;

    this.soundEngine.load("birds", "assets/audios/birds.mp3", {
      loop: true,
      volume: 0.5,
      autoplay: true,
    });
  }
  unlockAndPlay() {
    const listener = this.soundEngine.listener;
    listener.context.resume().then(() => {
      this.soundEngine.play("wind");
      this.soundEngine.play("birds");
    });
  }
}
