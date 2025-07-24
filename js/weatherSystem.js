// Weather System
class WeatherSystem {
    constructor() {
        this.currentWeather = this.generateWeather();
        this.lastWeatherChange = 0;
        this.weatherChangeDuration = 15; // Change weather every 15 ticks
        this.seasons = ['SPRING', 'SUMMER', 'FALL', 'WINTER'];
        this.currentSeason = 0;
        this.seasonTick = 0;
        this.seasonDuration = 100; // 100 ticks per season
    }
    
    generateWeather() {
        const weatherTypes = ['SUNNY', 'RAINY', 'CLOUDY', 'STORMY'];
        const seasonWeatherProbabilities = {
            SPRING: { SUNNY: 0.4, RAINY: 0.35, CLOUDY: 0.2, STORMY: 0.05 },
            SUMMER: { SUNNY: 0.6, RAINY: 0.1, CLOUDY: 0.25, STORMY: 0.05 },
            FALL: { SUNNY: 0.3, RAINY: 0.3, CLOUDY: 0.3, STORMY: 0.1 },
            WINTER: { SUNNY: 0.2, RAINY: 0.2, CLOUDY: 0.5, STORMY: 0.1 }
        };
        
        const season = this.seasons[this.currentSeason];
        const probabilities = seasonWeatherProbabilities[season];
        
        const rand = Math.random();
        let cumulative = 0;
        
        for (const weatherType of weatherTypes) {
            cumulative += probabilities[weatherType];
            if (rand <= cumulative) {
                return this.createWeatherObject(weatherType, season);
            }
        }
        
        return this.createWeatherObject('SUNNY', season);
    }
    
    createWeatherObject(type, season) {
        const baseTemperatures = {
            SPRING: { min: 15, max: 25 },
            SUMMER: { min: 20, max: 35 },
            FALL: { min: 10, max: 20 },
            WINTER: { min: -5, max: 10 }
        };
        
        const weatherModifiers = {
            SUNNY: { tempModifier: 5, humidityBase: 45 },
            RAINY: { tempModifier: -3, humidityBase: 85 },
            CLOUDY: { tempModifier: 0, humidityBase: 65 },
            STORMY: { tempModifier: -5, humidityBase: 90 }
        };
        
        const seasonTemp = baseTemperatures[season];
        const modifier = weatherModifiers[type];
        
        const temperature = Math.round(
            (seasonTemp.min + seasonTemp.max) / 2 + 
            modifier.tempModifier + 
            (Math.random() - 0.5) * 10
        );
        
        const humidity = Math.round(
            modifier.humidityBase + (Math.random() - 0.5) * 20
        );
        
        return {
            type: type,
            season: season,
            temperature: Math.max(-10, Math.min(40, temperature)),
            humidity: Math.max(20, Math.min(100, humidity)),
            effects: GameConfig.weatherEffects[type],
            emoji: this.getWeatherEmoji(type),
            description: this.getWeatherDescription(type, season)
        };
    }
    
    getWeatherEmoji(type) {
        const emojis = {
            SUNNY: '☀️',
            RAINY: '🌧️',
            CLOUDY: '☁️',
            STORMY: '⛈️'
        };
        return emojis[type] || '☀️';
    }
    
    getWeatherDescription(type, season) {
        const descriptions = {
            SUNNY: ['Clear skies', 'Bright sunshine', 'Perfect weather'],
            RAINY: ['Light rain', 'Steady rainfall', 'Gentle showers'],
            CLOUDY: ['Overcast skies', 'Partly cloudy', 'Gray clouds'],
            STORMY: ['Thunder storms', 'Heavy rain', 'Wild weather']
        };
        
        const typeDescriptions = descriptions[type] || descriptions.SUNNY;
        return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
    }
    
    update(gameTick) {
        // Update season
        this.seasonTick++;
        if (this.seasonTick >= this.seasonDuration) {
            this.seasonTick = 0;
            this.currentSeason = (this.currentSeason + 1) % this.seasons.length;
        }
        
        // Update weather
        if (gameTick - this.lastWeatherChange >= this.weatherChangeDuration) {
            this.currentWeather = this.generateWeather();
            this.lastWeatherChange = gameTick;
            
            // Notify UI of weather change
            if (window.uiManager) {
                window.uiManager.updateWeatherDisplay();
            }
        }
    }
    
    getCurrentWeather() {
        return this.currentWeather;
    }
    
    getCurrentSeason() {
        return this.seasons[this.currentSeason];
    }
    
    getSeasonProgress() {
        return this.seasonTick / this.seasonDuration;
    }
    
    // Get forecast for next few weather changes
    getForecast(days = 3) {
        const forecast = [];
        let tempSeason = this.currentSeason;
        let tempSeasonTick = this.seasonTick;
        
        for (let i = 0; i < days; i++) {
            // Simulate season progression
            tempSeasonTick += this.weatherChangeDuration;
            if (tempSeasonTick >= this.seasonDuration) {
                tempSeasonTick = 0;
                tempSeason = (tempSeason + 1) % this.seasons.length;
            }
            
            // Generate weather for that season
            const originalSeason = this.currentSeason;
            const originalSeasonTick = this.seasonTick;
            
            this.currentSeason = tempSeason;
            this.seasonTick = tempSeasonTick;
            
            const weather = this.generateWeather();
            forecast.push(weather);
            
            // Restore original values
            this.currentSeason = originalSeason;
            this.seasonTick = originalSeasonTick;
        }
        
        return forecast;
    }
    
    // Special weather events
    triggerSpecialWeather(type, duration = 5) {
        const specialWeather = this.createWeatherObject(type, this.getCurrentSeason());
        this.currentWeather = specialWeather;
        this.lastWeatherChange = window.gameState?.gameTick || 0;
        this.weatherChangeDuration = duration;
        
        // Reset to normal duration after special event
        setTimeout(() => {
            this.weatherChangeDuration = 15;
        }, duration * GameConfig.gameTickSpeed);
    }
    
    // Weather effects on farming
    getGrowthBonus() {
        return this.currentWeather.effects.growthMultiplier;
    }
    
    getWaterEvaporation() {
        return this.currentWeather.effects.waterEvaporation;
    }
    
    // Seasonal bonuses
    getSeasonalEffects() {
        const seasonEffects = {
            SPRING: { seedGrowthBonus: 1.1, experienceBonus: 1.05 },
            SUMMER: { harvestBonus: 1.1, waterEvaporationPenalty: 1.2 },
            FALL: { sellPriceBonus: 1.15, weatherChangeFrequency: 0.8 },
            WINTER: { growthPenalty: 0.9, resourceConsumption: 0.8 }
        };
        
        return seasonEffects[this.getCurrentSeason()] || {};
    }
}

// Global weather system instance
window.weatherSystem = new WeatherSystem();