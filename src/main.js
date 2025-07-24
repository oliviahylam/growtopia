import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import FarmScene from './scenes/FarmScene.js';

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  pixelArt: true,
  parent: 'game-container',
  backgroundColor: '#87ceeb',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: [BootScene, PreloadScene, FarmScene],
};

window.addEventListener('load', () => {
  // eslint-disable-next-line no-new
  new Phaser.Game(config);
});