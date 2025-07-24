# 🌱 Growtopia - Pixel Farming Game

A pixel-style farming game built with Phaser.js that integrates real weather data to affect plant growth.

## 🚀 Getting Started

1. **Open the game**: Simply open `index.html` in your web browser
2. **Optional - Real Weather**: Open `setup-weather.html` to configure real weather data

## 🌤️ Weather API Setup (Optional)

### Easy Setup Method:
1. **Open `setup-weather.html`** in your browser
2. **Follow the guided setup** to get your free API key
3. **Configure your city** and test the connection
4. **Launch the game** - it will automatically use real weather!

### Manual Setup Method:
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Open browser developer console and run:
   ```javascript
   game.scene.scenes[0].weatherSystem.setApiKey('YOUR_API_KEY_HERE');
   game.scene.scenes[0].weatherSystem.setCity('Your City');
   ```

**Note**: The game works perfectly without an API key using simulated weather!

## 🎮 How to Play

### Core Loop
1. **Plant Seeds** 🌱 - Click "Plant Seed" button and select an empty tile
2. **Water Daily** 💧 - Click plants or use "Water All" button  
3. **Watch Growth** 📈 - Plants grow 1 stage every 3 minutes (5 stages total)
4. **Harvest** 🍎 - Click ready plants (glowing) or use "Harvest Ready"

### Controls
- **Click tiles** to select and interact
- **Space** - Water selected plant
- **H** - Harvest selected plant
- **Right-click** - Context menu (planned feature)

### Plant Care System
Each plant tracks daily care history:
- **Watering**: Required daily (unless raining)
- **Weather**: Affects growth (ideal/wet/harsh conditions)
- **Growth**: Happens every 3 minutes if conditions are met

### Weather Effects
- **☀️ Sunny + Cozy**: Ideal conditions
- **☁️ Cloudy + Cozy**: Ideal conditions  
- **🌧️ Rainy**: Wet (no watering needed)
- **⛈️ Storm**: Harsh (blocks growth)
- **❄️ Snow**: Harsh (blocks growth)
- **🔥 Hot + Sunny**: Harsh (blocks growth)
- **🥶 Cold**: Harsh (blocks growth)

### Harvest Grading
Your care quality determines rewards:

| Grade | Requirements | Rewards |
|-------|-------------|---------|
| **A+** | 100% watered, 80%+ ideal weather | 3 fruits, 30 coins, 50 XP |
| **A** | 80%+ watered, 60%+ ideal weather | 2 fruits, 20 coins, 30 XP |
| **B** | 60%+ watered, 40%+ ideal weather | 1 fruit, 10 coins, 15 XP |
| **F** | Below requirements | 0 fruits, 5 coins, 5 XP |

## 🎯 Game Features

### ✅ Implemented
- **Plant Management**: Full lifecycle from seed to harvest
- **Weather System**: Real API integration + simulated weather
- **Growth Mechanics**: Time-based progression (3 min/stage)
- **Watering System**: Daily care tracking
- **Harvest Grading**: Performance-based rewards
- **Visual Feedback**: Pixel art graphics, animations, indicators
- **Data Persistence**: Auto-save progress
- **Interactive UI**: Click, keyboard shortcuts, info panels

### 🔮 Future Enhancements
- Multiple plant types (tomatoes, carrots, etc.)
- Seasons and seasonal plants
- Tools and upgrades
- Plant diseases and remedies
- Multiplayer features
- Achievement system

## 🛠️ Technical Details

### Architecture
- **Weather System** (`js/weather.js`): OpenWeatherMap API integration
- **Plant Manager** (`js/plants.js`): Plant lifecycle and data management  
- **Game Engine** (`js/game.js`): Phaser.js rendering and interaction
- **Data Storage**: LocalStorage for persistence

### Plant Data Structure
```javascript
{
  id: "plant_01",
  type: "apple", 
  stage: 1-5,
  status: "growing" | "ready",
  wateredToday: boolean,
  checklist: [
    { date: "2024-01-01", watered: true, weather: "ideal" },
    // ... daily care history
  ],
  lastUpdated: timestamp,
  x: gridX,
  y: gridY
}
```

### Weather Mapping
```javascript
// API → Game Conditions
weatherCondition = "sunny" | "rainy" | "cloudy" | "storm" | "snowy"
tempCondition = "hot" | "cozy" | "cold"  
weatherStatus = "ideal" | "wet" | "harsh"
```

## 🎨 Pixel Art Style

The game uses programmatically generated pixel art:
- **Grid-based layout** (8x6 tiles, 64px each)
- **Color-coded plant stages** (green → red progression)
- **Visual indicators** (water droplets, glow effects)
- **Retro color palette** (earthy browns, vibrant greens)

## 📱 Browser Compatibility

- **Modern browsers** with ES6+ support
- **Local storage** required for save functionality
- **Canvas/WebGL** for Phaser.js rendering

## 🐛 Troubleshooting

**Weather not updating?**
- Check console for API errors
- Verify API key is set correctly
- Game works with simulated weather if API fails

**Plants not growing?**
- Ensure plants are watered (unless raining)
- Check weather isn't "harsh"
- Wait 3 minutes between growth stages

**Performance issues?**
- Try refreshing the page
- Clear browser cache/localStorage
- Check browser developer console for errors

## 🤝 Contributing

This is a learning project! Feel free to:
- Report bugs or suggest features
- Improve pixel art and animations
- Add new plant types
- Enhance weather effects

## 📄 License

MIT License - Feel free to use and modify!

---

**Happy Farming! 🌾** 