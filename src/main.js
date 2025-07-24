// Main entry point for Growtopia
import BootScene from './scenes/BootScene.js';
import FarmScene from './scenes/FarmScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  pixelArt: true,
  backgroundColor: '#5DACD8', // Sky blue background
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, FarmScene],
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
});