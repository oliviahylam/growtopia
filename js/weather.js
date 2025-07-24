// Weather System for Growtopia
class WeatherSystem {
    constructor() {
        this.apiKey = null; // Will need to be set by user
        this.currentWeather = {
            condition: "sunny",
            temperature: "cozy",
            status: "ideal"
        };
        this.lastUpdate = 0;
        this.updateInterval = 10 * 60 * 1000; // Update every 10 minutes
        this.city = "Taipei"; // Default city
        
        // Auto-load saved settings
        this.loadSavedSettings();
    }

    setApiKey(key) {
        this.apiKey = key;
    }

    setCity(city) {
        this.city = city;
    }

    async fetchWeatherData() {
        if (!this.apiKey) {
            console.warn("Weather API key not set, using default weather");
            return this.getDefaultWeather();
        }

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.apiKey}&units=metric`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }
            
            const data = await response.json();
            return this.processWeatherData(data);
        } catch (error) {
            console.error("Failed to fetch weather:", error);
            return this.getDefaultWeather();
        }
    }

    processWeatherData(data) {
        const weatherMain = data.weather[0].main.toLowerCase();
        const temp = data.main.temp;

        // Convert API weather to game conditions
        const weatherCondition = this.mapWeatherCondition(weatherMain);
        const tempCondition = this.mapTemperatureCondition(temp);
        const weatherStatus = this.calculateWeatherStatus(weatherCondition, tempCondition);

        return {
            condition: weatherCondition,
            temperature: tempCondition,
            status: weatherStatus,
            rawData: {
                main: data.weather[0].main,
                description: data.weather[0].description,
                temp: temp,
                humidity: data.main.humidity
            }
        };
    }

    mapWeatherCondition(weatherMain) {
        const mapping = {
            'clear': 'sunny',
            'clouds': 'cloudy',
            'rain': 'rainy',
            'drizzle': 'rainy',
            'thunderstorm': 'storm',
            'snow': 'snowy',
            'mist': 'cloudy',
            'fog': 'cloudy',
            'haze': 'cloudy'
        };
        return mapping[weatherMain] || 'cloudy';
    }

    mapTemperatureCondition(temp) {
        if (temp > 30) return 'hot';
        if (temp < 10) return 'cold';
        return 'cozy';
    }

    calculateWeatherStatus(condition, temperature) {
        // Ideal conditions for plants
        if (condition === 'sunny' && temperature === 'cozy') return 'ideal';
        if (condition === 'cloudy' && temperature === 'cozy') return 'ideal';
        
        // Wet conditions (good for plants but no need to water)
        if (condition === 'rainy') return 'wet';
        
        // Harsh conditions (bad for plants)
        if (condition === 'storm') return 'harsh';
        if (condition === 'snowy') return 'harsh';
        if (temperature === 'hot' && condition === 'sunny') return 'harsh';
        if (temperature === 'cold') return 'harsh';
        
        // Default to ideal for mild conditions
        return 'ideal';
    }

    getDefaultWeather() {
        // Simulate some variety in default weather
        const conditions = ['sunny', 'cloudy', 'rainy'];
        const temperatures = ['cozy', 'cozy', 'hot', 'cold']; // More cozy weather
        
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const temperature = temperatures[Math.floor(Math.random() * temperatures.length)];
        const status = this.calculateWeatherStatus(condition, temperature);

        return { condition, temperature, status };
    }

    async updateWeather() {
        const now = Date.now();
        if (now - this.lastUpdate < this.updateInterval && this.lastUpdate > 0) {
            return this.currentWeather;
        }

        this.currentWeather = await this.fetchWeatherData();
        this.lastUpdate = now;
        
        // Update UI
        this.updateWeatherDisplay();
        
        return this.currentWeather;
    }

    updateWeatherDisplay() {
        const weatherStatus = document.getElementById('weather-status');
        if (weatherStatus) {
            const { condition, temperature, status } = this.currentWeather;
            const emoji = this.getWeatherEmoji(condition);
            weatherStatus.textContent = `${emoji} ${condition} (${temperature}) - ${status}`;
            
            // Change color based on status
            const weatherDisplay = weatherStatus.closest('.weather-display');
            if (weatherDisplay) {
                weatherDisplay.style.background = this.getStatusColor(status);
            }
        }
    }

    getWeatherEmoji(condition) {
        const emojis = {
            'sunny': '☀️',
            'cloudy': '☁️',
            'rainy': '🌧️',
            'storm': '⛈️',
            'snowy': '❄️'
        };
        return emojis[condition] || '🌤️';
    }

    getStatusColor(status) {
        const colors = {
            'ideal': '#27ae60',
            'wet': '#3498db',
            'harsh': '#e74c3c'
        };
        return colors[status] || '#2980b9';
    }

    isRaining() {
        return this.currentWeather.condition === 'rainy';
    }

    getCurrentWeather() {
        return this.currentWeather;
    }

    loadSavedSettings() {
        try {
            const savedKey = localStorage.getItem('growtopia_weather_key');
            const savedCity = localStorage.getItem('growtopia_weather_city');
            
            if (savedKey) {
                this.apiKey = savedKey;
                console.log('✅ Weather API key loaded from settings');
            }
            
            if (savedCity) {
                this.city = savedCity;
                console.log(`✅ Weather city set to: ${savedCity}`);
            }
        } catch (error) {
            console.warn('Failed to load weather settings:', error);
        }
    }
}

// Export for use in other modules
window.WeatherSystem = WeatherSystem; 