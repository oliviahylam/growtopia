import GameState from '../game/GameState.js';
import Plot from '../game/Plot.js';
import WeatherSystem from '../game/WeatherSystem.js';

export default class FarmScene extends Phaser.Scene {
  constructor() {
    super('FarmScene');
    this.plots = [];
  }

  create() {
    this.weatherSystem = new WeatherSystem(this);

    this.createUI();
    this.createFarm();

    // Weather listener
    this.weatherSystem.onChange((w) => {
      this.showMessage(`Weather: ${w}`);
      this.updateUI();
    });
  }

  createFarm() {
    const { rows, cols } = GameState.plotGridSize;
    const startX = 40;
    const startY = 80;
    const spacing = 34;

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const x = startX + c * spacing;
        const y = startY + r * spacing;
        const plot = new Plot(this, x, y);
        this.plots.push(plot);
      }
    }
  }

  createUI() {
    this.coinText = this.add.text(10, 10, '', { fontSize: '12px', color: '#ffffff' });
    this.weatherText = this.add.text(120, 10, '', { fontSize: '12px', color: '#ffffff' });

    // Upgrade buttons
    this.upgradeButtons = {};
    let y = 300;
    Object.keys(GameState.upgrades).forEach((key) => {
      const btn = this.add.sprite(540, y, 'button_bg').setDisplaySize(80, 20).setInteractive();
      const txt = this.add.text(540, y, `${key}`, { fontSize: '10px', color: '#ffffff' }).setOrigin(0.5);
      btn.on('pointerdown', () => {
        const success = GameState.purchaseUpgrade(key);
        if (success) {
          this.showMessage(`${key} upgraded!`);
          this.updateUI();
        } else {
          this.showMessage('Not enough coins');
        }
      });
      this.upgradeButtons[key] = { btn, txt };
      y += 30;
    });

    this.messageText = this.add.text(320, 460, '', { fontSize: '12px', color: '#ffffff' }).setOrigin(0.5);

    this.updateUI();
  }

  update(time, delta) {
    this.plots.forEach((plot) => plot.update(time, delta));
  }

  updateUI() {
    this.coinText.setText(`Coins: ${GameState.coins}`);
    this.weatherText.setText(`Weather: ${this.weatherSystem.currentWeather}`);

    Object.entries(GameState.upgrades).forEach(([key, up]) => {
      const cost = GameState.getUpgradeCost(key);
      this.upgradeButtons[key].txt.setText(`${key} (Lv ${up.level})\n$${cost}`);
    });
  }

  showMessage(msg, duration = 2000) {
    this.messageText.setText(msg);
    if (this.messageTimer) this.messageTimer.remove();
    this.messageTimer = this.time.delayedCall(duration, () => this.messageText.setText(''));
  }
}