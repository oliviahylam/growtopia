// Isometric Apple Orchard Scene
const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  backgroundColor: '#e9f4e9',
  scene: {
    preload,
    create
  }
};

const game = new Phaser.Game(config);

const tileWidth = 64;
const tileHeight = 32;

const gridRows = 6;
const gridCols = 6;

const growthTextures = [
  'apple_stage_01', // sprout
  'apple_stage_02', // small plant
  'apple_stage_03', // bush
  'apple_stage_04', // semi tree
  'apple_stage_05'  // full fruit tree
];

// Simulated farm layout – values are growth stages 0 to 4
const farmGrid = [
  [4, 4, 3, 3, 2, 1],
  [3, 4, 4, 3, 2, 0],
  [2, 3, 4, 4, 1, 0],
  [1, 2, 3, 4, 1, 0],
  [0, 1, 2, 3, 2, 1],
  [0, 0, 1, 2, 3, 2]
];

// Convert 2D grid coordinates into isometric screen position
function isoToScreen(x, y, tileWidth, tileHeight) {
  return {
    x: (x - y) * tileWidth / 2 + 512,   // center X
    y: (x + y) * tileHeight / 2 + 100   // center Y with slight downward shift
  };
}

// Preload tree images
function preload() {
  this.load.setPath('assets/apple/');
  for (let i = 0; i < 5; i++) {
    this.load.image(`apple_stage_0${i + 1}`, `apple_stage_0${i + 1}.png`);
  }
}

// Draw the grid
function create() {
  for (let y = 0; y < gridRows; y++) {
    for (let x = 0; x < gridCols; x++) {
      const stage = farmGrid[y][x];
      const pos = isoToScreen(x, y, tileWidth, tileHeight);
      const textureKey = growthTextures[stage];

      const tree = this.add.image(pos.x, pos.y, textureKey);
      tree.setOrigin(0.5, 1);         // anchor to bottom center
      tree.setDepth(pos.y);           // ensure proper layering
    }
  }
} 