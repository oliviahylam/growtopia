import Plant from './Plant.js';

export default class Plot extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.scene = scene;
    this.setSize(32, 32);

    // Add soil sprite
    this.soil = scene.add.sprite(0, 0, 'plot');
    this.add(this.soil);

    // Water overlay
    this.waterOverlay = scene.add.sprite(0, 0, 'water_overlay');
    this.waterOverlay.setVisible(false);
    this.add(this.waterOverlay);

    // State
    this.plant = null;
    this.watered = false;

    // Enable interaction
    this.setInteractive(new Phaser.Geom.Rectangle(-16, -16, 32, 32), Phaser.Geom.Rectangle.Contains);
    this.on('pointerdown', this.onPointerDown, this);

    scene.add.existing(this);
  }

  onPointerDown(pointer) {
    // Priority: Harvest if grown, else plant if empty, else water
    if (this.plant && this.plant.grown) {
      const earnings = this.plant.harvest();
      this.scene.collectCoins(earnings);
      this.plant = null;
      this.watered = false;
      this.waterOverlay.setVisible(false);
      return;
    }

    if (!this.plant) {
      this.scene.tryPlantSeed(this);
      return;
    }

    if (!this.watered) {
      this.watered = true;
      this.waterOverlay.setVisible(true);
      // Maybe speed up growth by reducing remaining time by 20%
      const remaining = this.plant.seedData.growTime - (this.scene.time.now - this.plant.plantedAt);
      const reduction = remaining * 0.2;
      this.plant.plantedAt -= reduction; // effectively fast-forward growth
    }
  }

  update(time, delta) {
    if (this.plant) {
      this.plant.update(time, delta);
    }
  }

  plantSeed(seedKey) {
    if (this.plant) return false;
    this.plant = new Plant(this.scene, this, seedKey);
    return true;
  }
}