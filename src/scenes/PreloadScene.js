export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // Create simple pixel textures programmatically
    const size = 32;

    const createSquare = (key, color) => {
      const gfx = this.make.graphics({ x: 0, y: 0, add: false });
      gfx.fillStyle(color, 1);
      gfx.fillRect(0, 0, size, size);
      gfx.generateTexture(key, size, size);
      gfx.destroy();
    };

    createSquare('plot_empty', 0x8b4513); // brown
    createSquare('plot_planted', 0x228b22); // green
    createSquare('plot_grown', 0x006400); // dark green
    createSquare('button_bg', 0x333333);
  }

  create() {
    this.scene.start('FarmScene');
  }
}