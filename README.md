# 🌾 Growtopia - Farming Simulation Game

A pixel-style browser-based farming simulation game built with **Phaser.js**. Experience the complete farming cycle: Plant → Grow → Harvest → Earn → Upgrade → Automate → Expand!

## 🎮 Game Features

### Core Gameplay Loop
- **Plant**: Click empty plots to plant selected crops
- **Grow**: Watch crops develop through 5 growth stages
- **Harvest**: Right-click mature crops to collect yield
- **Earn**: Sell harvests for coins to expand your farm
- **Upgrade**: Buy tools and improvements
- **Automate**: Install sprinklers for auto-watering
- **Expand**: Unlock new plots to grow your empire

### 🌱 Crop System
- **3 Crop Types**: Wheat (fast), Tomato (medium), Corn (slow, high value)
- **Growth Stages**: Seed → Sprout → Growing → Mature → Ready
- **Health System**: Crops need water and care to stay healthy
- **Quality Grades**: Perfect crops yield more coins
- **Crop Rotation**: Rotating crop types provides bonuses

### 🌦️ Dynamic Weather System
- **4 Weather Types**: Sunny, Rainy, Cloudy, Stormy
- **4 Seasons**: Spring, Summer, Fall, Winter (100 ticks each)
- **Weather Effects**: Different weather affects growth and water evaporation
- **Seasonal Bonuses**: Each season provides unique benefits
- **Special Events**: Rare weather events with bonus effects

### 🏪 Shop & Economy
- **Seeds**: Purchase different crop seeds
- **Fertilizer**: Boost crop yield and growth
- **Sprinklers**: Automatic watering system
- **Farm Expansion**: Unlock additional plots

### 🎯 Progression System
- **Experience**: Gain XP from harvesting crops
- **Levels**: Level up for coin bonuses
- **Achievements**: Track your farming milestones
- **Statistics**: Monitor total harvested, earned, and more

## 🎮 Controls

| Action | Controls |
|--------|----------|
| Plant/Water | Left-click on plot |
| Harvest | Right-click on ready crops |
| Water All | Spacebar |
| Harvest All Ready | H key |
| Select Crop Type | 1 (Wheat), 2 (Tomato), 3 (Corn) |
| Save Game | Ctrl + S |
| Load Game | Ctrl + L |

## 🚀 Getting Started

1. **Open `index.html`** in your web browser
2. **Start with 12 unlocked plots** and basic resources
3. **Click empty plots** to plant your first crops (Wheat recommended)
4. **Wait for crops to grow** while monitoring water levels
5. **Right-click ready crops** to harvest and earn coins
6. **Buy seeds and expand** your farm with earnings
7. **Experiment with different crops** and strategies

## 🏗️ Technical Architecture

### Modular Design
```
📁 js/
├── gameConfig.js     # Game constants and settings
├── gameState.js      # Central state management
├── weatherSystem.js  # Dynamic weather & seasons
├── cropSystem.js     # Crop growth & management
├── farmPlot.js       # Plot rendering & interactions
├── uiManager.js      # Interface updates & controls
├── gameScene.js      # Main Phaser scene
└── main.js          # Game initialization
```

### Key Systems
- **Game State Manager**: Centralized resource and plot management
- **Weather System**: Realistic weather patterns affecting gameplay
- **Crop System**: Complex growth mechanics with health and quality
- **UI Manager**: Responsive interface with notifications
- **Farm Renderer**: Pixel-perfect visual representation
- **Save System**: Automatic and manual game persistence

## 🎨 Visual Features

- **Pixel Art Style**: Crisp, retro-inspired graphics
- **Smooth Animations**: Crop swaying, growth progress, particles
- **Weather Effects**: Rain drops, lightning flashes, cloud movement
- **Visual Feedback**: Harvest sparkles, water effects, growth bars
- **Responsive Design**: Scales to different screen sizes

## 🔧 Development Features

### Debug Commands (localhost only)
```javascript
debugGame.addCoins(amount)      // Add coins
debugGame.addSeeds(amount)      // Add seeds
debugGame.triggerWeather(type)  // Force weather
debugGame.unlockAllPlots()      // Unlock all plots
debugGame.fastGrowth()          // Speed up growth
debugGame.resetGame()           // Reset progress
```

### Performance Monitoring
- Automatic frame time tracking
- Performance warnings for optimization
- Memory usage monitoring

## 🎯 Game Strategy Tips

1. **Start with Wheat**: Fast-growing and reliable income
2. **Monitor Water Levels**: Crops suffer without proper watering
3. **Use Fertilizer Wisely**: Save for high-value crops
4. **Crop Rotation**: Alternate crop types for bonuses
5. **Weather Awareness**: Plant before rain for growth boosts
6. **Expand Gradually**: Balance expansion with resource management
7. **Quality Focus**: Healthy crops yield more coins

## 🔮 Future Expansion Ideas

- **Additional Crops**: Fruits, vegetables, flowers
- **Advanced Tools**: Tractors, harvesters, greenhouse
- **Market System**: Dynamic pricing and trading
- **Multiplayer**: Cooperative farming and competition
- **Achievements**: Comprehensive goal system
- **Sound Effects**: Audio feedback and music
- **Mobile App**: Native mobile version

## 📊 Game Balance

- **Starting Resources**: 100 coins, 10 seeds
- **Growth Times**: Wheat (5 ticks), Tomato (8 ticks), Corn (12 ticks)
- **Tick Speed**: 1 second per game tick
- **Weather Changes**: Every 15 ticks
- **Season Duration**: 100 ticks each

## 🐛 Known Issues

- None currently reported

## 🤝 Contributing

This is a Phase 1 MVP focused on core mechanics. The codebase is designed for easy expansion and modification.

---

**Built with ❤️ using Phaser.js**

*Happy Farming! 🚜*