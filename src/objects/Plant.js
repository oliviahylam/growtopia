import { SEEDS } from '../data/seeds.js';

export default class Plant {
  constructor(scene, plot, typeKey) {
    this.scene = scene;
    this.plot = plot;
    this.typeKey = typeKey;
    this.seedData = SEEDS[typeKey];

    // Visual representation (sprite) placed in plot
    this.sprite = scene.add.sprite(plot.x, plot.y, 'plant_stage_0');
    this.sprite.setDepth(1);

    this.plantedAt = scene.time.now;
    this.growthStage = 0; // 0,1,2
    this.grown = false;
  }

  update(time, delta) {
    if (this.grown) return;

    const elapsed = time - this.plantedAt;
    // Adjust grow time by current weather multiplier
    const effectiveGrowTime = this.seedData.growTime / this.scene.weatherSystem.getMultiplier();
    const stageDuration = effectiveGrowTime / 3;

    const newStage = Math.min(2, Math.floor(elapsed / stageDuration));
    if (newStage !== this.growthStage) {
      this.growthStage = newStage;
      this.sprite.setTexture(`plant_stage_${this.growthStage}`);
    }

    if (elapsed >= effectiveGrowTime) {
      this.grown = true;
    }
  }

  harvest() {
    if (!this.grown) return 0;
    this.sprite.destroy();
    return this.seedData.sellPrice;
  }
}