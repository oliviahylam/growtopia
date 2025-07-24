export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Generate textures for plots and plants using Phaser graphics to avoid external images
    this.generateTextures();
  }

  create() {
    this.scene.start('Farm');
  }

  generateTextures() {
    // Plot (soil) texture
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0x8B4513, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('plot', 32, 32);
    graphics.clear();

    // Water overlay texture
    graphics.fillStyle(0x1E90FF, 0.5);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('water_overlay', 32, 32);
    graphics.clear();

    // Plant textures at 3 stages (small, medium, full)
    const plantColors = [0x228B22, 0x2E8B57, 0x32CD32];
    plantColors.forEach((color, index) => {
      graphics.fillStyle(color, 1);
      const size = 8 + index * 8; // 8, 16, 24
      const offset = (32 - size) / 2;
      graphics.fillRect(offset, offset, size, size);
      graphics.generateTexture(`plant_stage_${index}`, 32, 32);
      graphics.clear();
    });
  }
}