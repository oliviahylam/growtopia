class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.coins = 100;
    this.plantDefinitions = {
      carrot: { name: 'Carrot', cost: 10, growTime: 15000, sellPrice: 20 },
      corn: { name: 'Corn', cost: 20, growTime: 30000, sellPrice: 45 },
    };
    this.upgrades = {
      wateringCan: { level: 0, baseCost: 50 },
      tractor: { level: 0, baseCost: 200 },
    };
    this.plotGridSize = { rows: 5, cols: 8 };
  }

  getUpgradeCost(key) {
    const up = this.upgrades[key];
    return up.baseCost * (up.level + 1);
  }

  purchaseUpgrade(key) {
    const cost = this.getUpgradeCost(key);
    if (this.coins >= cost) {
      this.coins -= cost;
      this.upgrades[key].level += 1;
      return true;
    }
    return false;
  }
}

// Export singleton instance
export default new GameState();