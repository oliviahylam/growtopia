export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Could set up loading bar here
  }

  create() {
    this.scene.start('PreloadScene');
  }
}