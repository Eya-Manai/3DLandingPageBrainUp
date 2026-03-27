import { Chair } from "./Chair.js";
import { Tree } from "./arbreTree.js";
import { Lamp } from "./lamp.js";
import { FlowerBed } from "./flowers.js";

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
    this.addLamps();
    this.addFlowers();
  }

  addTrees() {
    for (let i = -30; i < 30; i += 15) {
      this.objects.push(new Tree(this.scene, -27, i + 1));
      this.objects.push(new Tree(this.scene, 27, i + 1));
    }
  }

  addLamps() {
    for (let i = -30; i < 30; i += 10) {
      new Lamp(this.scene, -5, i);
      new Lamp(this.scene, 5, i);
    }
  }

  addFlowers() {
    const positions = [
      [-6.5, 14],
      [6.5, 14],
      [-6.5, 8],
      [6.5, 8],
      [-6.5, 2],
      [6.5, 2],
      [-6.5, -4],
      [6.5, -4],

      [-20, -2],
      [20, -2],
      [-14, 12],
      [14, 12],
    ];

    positions.forEach(([x, z]) => {
      const count = 8 + Math.floor(Math.random() * 8);
      this.objects.push(new FlowerBed(this.scene, x, z, count));
    });
  }
}
