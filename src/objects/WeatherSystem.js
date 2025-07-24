export default class WeatherSystem {
  constructor(scene) {
    this.scene = scene;
    this.weatherTypes = [
      { key: 'sunny', label: 'Sunny ☀', multiplier: 1.0 },
      { key: 'rainy', label: 'Rainy ☔', multiplier: 1.2 },
      { key: 'cloudy', label: 'Cloudy ☁', multiplier: 0.9 },
    ];
    this.currentWeather = this.randomWeather();

    // Change weather every in-game day (e.g., 60 seconds)
    scene.time.addEvent({
      delay: 60 * 1000,
      callback: () => {
        this.currentWeather = this.randomWeather();
        if (this.onChange) this.onChange(this.currentWeather);
      },
      loop: true,
    });
  }

  randomWeather() {
    return Phaser.Utils.Array.GetRandom(this.weatherTypes);
  }

  getMultiplier() {
    return this.currentWeather.multiplier;
  }
}