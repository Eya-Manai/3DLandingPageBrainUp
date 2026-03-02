import { Chair } from "./Chair.js";
import { Tree } from "./arbreTree.js";

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.objects = [];
    this.build();
  }

  build() {
    this.addTrees();
    this.objects.push(new Chair(this.scene, -14, 0));
    this.objects.push(new Chair(this.scene, 14, 0));
    this.objects.push(new Chair(this.scene, -14, 8));
    this.objects.push(new Chair(this.scene, 14, 8));
  }

  addTrees() {
    for (let i = -30; i < 30; i += 15) {
      this.objects.push(new Tree(this.scene, -27, i + 1));
      this.objects.push(new Tree(this.scene, 27, i + 1));
    }
  }
}
