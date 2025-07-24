export default class WeatherSystem {
  constructor(scene) {
    this.scene = scene;
    this.currentWeather = 'Sunny';
    this.subscribers = [];

    // Change weather every in-game hour (here, every 60 seconds)
    this.scene.time.addEvent({ delay: 60000, loop: true, callback: this.changeWeather, callbackScope: this });
  }

  changeWeather() {
    const weathers = ['Sunny', 'Rainy', 'Cloudy'];
    this.currentWeather = Phaser.Utils.Array.GetRandom(weathers);
    this.subscribers.forEach((cb) => cb(this.currentWeather));
  }

  onChange(callback) {
    this.subscribers.push(callback);
  }

  getGrowthModifier() {
    switch (this.currentWeather) {
      case 'Rainy':
        return 0.8; // 20% faster
      case 'Cloudy':
        return 1.2; // 20% slower
      default:
        return 1;
    }
  }
}