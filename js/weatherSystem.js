// Weather System - Real-world weather integration with fallback simulation
class WeatherSystem {
    constructor() {
        this.currentWeather = null;
        this.lastApiUpdate = 0;
        this.apiUpdateInterval = GameConfig.weather.updateInterval;
        this.useRealWeather = GameConfig.weather.useRealWeather;
        this.currentCity = GameConfig.weather.defaultCity;
        
        this.initializeWeather();
    }
    
    async initializeWeather() {
        if (this.useRealWeather) {
            await this.fetchRealWeather();
        } else {
            this.generateSimulatedWeather();
        }
        
        this.startWeatherUpdates();
    }
    
    async fetchRealWeather() {
        try {
            const response = await fetch(
                `${GameConfig.weather.apiUrl}?q=${this.currentCity}&appid=${GameConfig.weather.apiKey}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }
            
            const data = await response.json();
            this.currentWeather = this.parseApiWeather(data);
            this.lastApiUpdate = Date.now();
            
            console.log('Real weather fetched:', this.currentWeather);
            
        } catch (error) {
            console.warn('Failed to fetch real weather, using simulation:', error);
            this.useRealWeather = false;
            this.generateSimulatedWeather();
        }
    }
    
    parseApiWeather(apiData) {
        const condition = apiData.weather[0].main.toLowerCase();
        const temperature = apiData.main.temp;
        const humidity = apiData.main.humidity;
        const windSpeed = apiData.wind?.speed || 0;
        
        // Map API conditions to game weather types
        let weatherType = 'SUNNY';
        
        if (condition.includes('rain') || condition.includes('drizzle')) {
            weatherType = 'RAINY';
        } else if (condition.includes('snow')) {
            weatherType = 'SNOW';
        } else if (condition.includes('cloud')) {
            weatherType = 'CLOUDY';
        } else if (temperature > 35 || humidity < 20) {
            weatherType = 'DROUGHT';
        }
        
        const weatherConfig = GameConfig.weatherTypes[weatherType];
        
        return {
            type: weatherType,
            name: weatherConfig.name,
            emoji: weatherConfig.emoji,
            description: weatherConfig.description,
            temperature: Math.round(temperature),
            humidity: humidity,
            windSpeed: Math.round(windSpeed),
            effects: {
                growthMultiplier: weatherConfig.growthMultiplier,
                waterEvaporation: weatherConfig.waterEvaporation,
                autoWater: weatherConfig.autoWater || false
            },
            source: 'api',
            city: this.currentCity,
            timestamp: Date.now()
        };
    }
    
    generateSimulatedWeather() {
        const weatherTypes = Object.keys(GameConfig.weatherTypes);
        const selectedType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        const weatherConfig = GameConfig.weatherTypes[selectedType];
        
        // Generate realistic temperature and humidity
        const baseTemp = this.getSeasonalBaseTemperature();
        const tempVariation = (Math.random() - 0.5) * 20;
        const temperature = Math.round(baseTemp + tempVariation);
        
        const baseHumidity = this.getWeatherHumidity(selectedType);
        const humidityVariation = (Math.random() - 0.5) * 30;
        const humidity = Math.max(10, Math.min(100, Math.round(baseHumidity + humidityVariation)));
        
        this.currentWeather = {
            type: selectedType,
            name: weatherConfig.name,
            emoji: weatherConfig.emoji,
            description: weatherConfig.description,
            temperature: temperature,
            humidity: humidity,
            windSpeed: Math.round(Math.random() * 20),
            effects: {
                growthMultiplier: weatherConfig.growthMultiplier,
                waterEvaporation: weatherConfig.waterEvaporation,
                autoWater: weatherConfig.autoWater || false
            },
            source: 'simulated',
            timestamp: Date.now()
        };
    }
    
    getSeasonalBaseTemperature() {
        const seasons = {
            spring: 18,
            summer: 28,
            autumn: 15,
            winter: 5
        };
        
        // Simple seasonal calculation based on date
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return seasons.spring;
        if (month >= 5 && month <= 7) return seasons.summer;
        if (month >= 8 && month <= 10) return seasons.autumn;
        return seasons.winter;
    }
    
    getWeatherHumidity(weatherType) {
        const humidityMap = {
            SUNNY: 45,
            RAINY: 85,
            CLOUDY: 65,
            SNOW: 75,
            DROUGHT: 25
        };
        return humidityMap[weatherType] || 50;
    }
    
    startWeatherUpdates() {
        // Update weather periodically
        setInterval(() => {
            this.updateWeather();
        }, this.apiUpdateInterval);
        
        // Also update every few game ticks for simulation
        if (!this.useRealWeather) {
            setInterval(() => {
                if (Math.random() < 0.1) { // 10% chance to change weather
                    this.generateSimulatedWeather();
                    this.notifyWeatherChange();
                }
            }, GameConfig.gameTickSpeed * 15); // Every 15 game ticks
        }
    }
    
    async updateWeather() {
        const now = Date.now();
        
        if (this.useRealWeather && (now - this.lastApiUpdate) >= this.apiUpdateInterval) {
            await this.fetchRealWeather();
            this.notifyWeatherChange();
        }
    }
    
    notifyWeatherChange() {
        if (window.uiManager) {
            window.uiManager.updateWeatherDisplay();
            window.uiManager.showNotification(
                `Weather changed to ${this.currentWeather.emoji} ${this.currentWeather.name}`,
                'info'
            );
        }
        
        // Apply weather effects to all plants
        if (window.gameState) {
            this.applyWeatherEffects();
        }
    }
    
    applyWeatherEffects() {
        window.gameState.farm.plots.forEach(plot => {
            if (plot.plant && plot.isUnlocked) {
                // Auto-water from rain
                if (this.currentWeather.effects.autoWater) {
                    plot.waterLevel = Math.min(1.0, plot.waterLevel + 0.3);
                }
                
                // Environmental stress from extreme weather
                if (this.currentWeather.type === 'DROUGHT' && plot.waterLevel < 0.2) {
                    plot.pollution = Math.min(1.0, plot.pollution + 0.1);
                }
                
                // Snow damage without greenhouse
                if (this.currentWeather.type === 'SNOW' && !plot.hasGreenhouse) {
                    if (plot.plant.stage > GameConfig.growthStages.SEED) {
                        plot.plant.health -= 0.05;
                    }
                }
            }
        });
    }
    
    getCurrentWeather() {
        return this.currentWeather;
    }
    
    getWeatherEffects() {
        return this.currentWeather?.effects || {
            growthMultiplier: 1.0,
            waterEvaporation: 0.1,
            autoWater: false
        };
    }
    
    // Method to change city for real weather
    async changeCity(cityName) {
        if (!this.useRealWeather) return false;
        
        this.currentCity = cityName;
        await this.fetchRealWeather();
        this.notifyWeatherChange();
        return true;
    }
    
    // Toggle between real and simulated weather
    toggleWeatherSource() {
        this.useRealWeather = !this.useRealWeather;
        
        if (this.useRealWeather) {
            this.fetchRealWeather();
        } else {
            this.generateSimulatedWeather();
        }
        
        this.notifyWeatherChange();
        return this.useRealWeather;
    }
    
    // Get weather forecast (simulated for now)
    getForecast(days = 3) {
        const forecast = [];
        
        for (let i = 1; i <= days; i++) {
            // Simple forecast simulation
            const weatherTypes = Object.keys(GameConfig.weatherTypes);
            const randomType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
            const config = GameConfig.weatherTypes[randomType];
            
            forecast.push({
                day: i,
                type: randomType,
                name: config.name,
                emoji: config.emoji,
                description: config.description,
                temperature: this.getSeasonalBaseTemperature() + (Math.random() - 0.5) * 15,
                probability: 60 + Math.random() * 30 // 60-90% confidence
            });
        }
        
        return forecast;
    }
    
    // Special weather events
    triggerSpecialWeather(weatherType, duration = 5) {
        const config = GameConfig.weatherTypes[weatherType];
        if (!config) return;
        
        this.currentWeather = {
            type: weatherType,
            name: config.name,
            emoji: config.emoji,
            description: `Special ${config.description}`,
            temperature: this.currentWeather?.temperature || 20,
            humidity: this.currentWeather?.humidity || 50,
            windSpeed: this.currentWeather?.windSpeed || 5,
            effects: {
                growthMultiplier: config.growthMultiplier * 1.5, // Boost special weather
                waterEvaporation: config.waterEvaporation,
                autoWater: config.autoWater || false
            },
            source: 'special',
            duration: duration,
            timestamp: Date.now()
        };
        
        this.notifyWeatherChange();
        
        // Revert after duration
        setTimeout(() => {
            if (this.useRealWeather) {
                this.fetchRealWeather();
            } else {
                this.generateSimulatedWeather();
            }
            this.notifyWeatherChange();
        }, duration * GameConfig.gameTickSpeed);
    }
    
    // Environmental impact calculation
    getEnvironmentalImpact() {
        const weather = this.currentWeather;
        if (!weather) return { air: 50, water: 50, soil: 50 };
        
        let airQuality = 70;
        let waterQuality = 70;
        let soilQuality = 70;
        
        // Weather affects environmental quality
        switch (weather.type) {
            case 'RAINY':
                waterQuality += 20;
                soilQuality += 10;
                airQuality += 15;
                break;
            case 'DROUGHT':
                waterQuality -= 25;
                soilQuality -= 15;
                airQuality -= 10;
                break;
            case 'SNOW':
                waterQuality += 10;
                airQuality += 20;
                break;
            case 'SUNNY':
                soilQuality += 5;
                break;
        }
        
        return {
            air: Math.max(0, Math.min(100, airQuality)),
            water: Math.max(0, Math.min(100, waterQuality)),
            soil: Math.max(0, Math.min(100, soilQuality))
        };
    }
    
    // Weather statistics for eco scoring
    getWeatherStats() {
        return {
            currentCondition: this.currentWeather?.type || 'UNKNOWN',
            temperature: this.currentWeather?.temperature || 20,
            humidity: this.currentWeather?.humidity || 50,
            source: this.currentWeather?.source || 'none',
            lastUpdate: this.currentWeather?.timestamp || 0,
            city: this.currentCity
        };
    }
}

// Global weather system instance
window.weatherSystem = new WeatherSystem();