import Plot from '../objects/Plot.js';
import WeatherSystem from '../objects/WeatherSystem.js';
import { SEEDS } from '../data/seeds.js';

export default class FarmScene extends Phaser.Scene {
  constructor() {
    super('Farm');
    this.plots = [];
    this.selectedSeedKey = 'carrot';
    this.coins = 20;
  }

  create() {
    // Weather system
    this.weatherSystem = new WeatherSystem(this);

    // Create farmland grid (5x4)
    const cols = 5;
    const rows = 4;
    const startX = this.cameras.main.centerX - (cols * 32) / 2;
    const startY = this.cameras.main.centerY - (rows * 32) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * 34; // spacing 2px
        const y = startY + row * 34;
        const plot = new Plot(this, x, y);
        this.plots.push(plot);
      }
    }

    // UI texts
    this.coinsText = this.add.text(10, 10, `💰 ${this.coins}`, { fontFamily: 'Press Start 2P', fontSize: '12px', fill: '#ffffff' });
    this.weatherText = this.add.text(10, 30, this.weatherSystem.currentWeather.label, { fontFamily: 'Press Start 2P', fontSize: '12px', fill: '#ffffff' });

    // Update callback for weather changes
    this.weatherSystem.onChange = (weather) => {
      this.weatherText.setText(weather.label);
    };

    // Seed selection UI (simple buttons)
    this.createSeedButtons();
  }

  createSeedButtons() {
    const keys = Object.keys(SEEDS);
    keys.forEach((key, index) => {
      const seed = SEEDS[key];
      const btn = this.add.text(650, 50 + index * 40, `${seed.name} ($${seed.cost})`, {
        fontFamily: 'Press Start 2P',
        fontSize: '10px',
        color: '#ffffff',
      })
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.selectedSeedKey = key;
          // Highlight selection
          this.seedButtons.forEach((b) => b.setColor('#ffffff'));
          btn.setColor('#FFD700');
        });

      if (!this.seedButtons) this.seedButtons = [];
      this.seedButtons.push(btn);

      if (index === 0) {
        btn.setColor('#FFD700');
      }
    });
  }

  update(time, delta) {
    this.plots.forEach((plot) => plot.update(time, delta));
  }

  tryPlantSeed(plot) {
    const seed = SEEDS[this.selectedSeedKey];
    if (this.coins < seed.cost) return; // Not enough coins

    const planted = plot.plantSeed(this.selectedSeedKey);
    if (planted) {
      this.coins -= seed.cost;
      this.updateCoinsUI();
    }
  }

  collectCoins(amount) {
    this.coins += amount;
    this.updateCoinsUI();
  }

  updateCoinsUI() {
    this.coinsText.setText(`💰 ${this.coins}`);
  }
}