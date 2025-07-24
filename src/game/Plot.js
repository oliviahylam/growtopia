import Plant from './Plant.js';
import GameState from './GameState.js';

export default class Plot extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'plot_empty');
    this.setInteractive();
    scene.add.existing(this);

    this.plant = null;
    this.on('pointerdown', this.handleClick, this);
  }

  handleClick() {
    if (!this.plant) {
      this.openPlantMenu();
    } else if (this.plant.isGrown(this.scene.time.now)) {
      // Harvest
      GameState.coins += this.plant.definition.sellPrice;
      this.plant = null;
      this.setTexture('plot_empty');
      this.scene.updateUI();
    } else {
      // Water
      const level = GameState.upgrades.wateringCan.level + 1;
      this.plant.water(level);
      this.scene.showMessage('Watered!');
    }
  }

  openPlantMenu() {
    const menu = this.scene.add.container(this.x, this.y - 40);
    let offsetX = 0;

    Object.entries(GameState.plantDefinitions).forEach(([key, def]) => {
      const btn = this.scene.add.sprite(offsetX, 0, 'button_bg').setDisplaySize(32, 16).setInteractive();
      const txt = this.scene.add.text(offsetX, 0, key, { fontSize: '8px', color: '#ffffff' }).setOrigin(0.5);
      btn.on('pointerdown', () => {
        if (GameState.coins >= def.cost) {
          GameState.coins -= def.cost;
          this.plant = new Plant(def, this.scene.time.now);
          this.setTexture('plot_planted');
          this.scene.updateUI();
          menu.destroy();
        } else {
          this.scene.showMessage('Not enough coins');
        }
      });
      menu.add([btn, txt]);
      offsetX += 40;
    });

    // Close menu after 3 seconds or on outside click
    this.scene.time.delayedCall(3000, () => menu.destroy());
  }

  update() {
    if (this.plant && this.plant.isGrown(this.scene.time.now)) {
      this.setTexture('plot_grown');
    }
  }
}