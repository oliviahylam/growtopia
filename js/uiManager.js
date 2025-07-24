// UI Manager - Handles all user interface updates and interactions
class UIManager {
    constructor() {
        this.elements = {
            leafCoins: document.getElementById('leaf-coins'),
            appleSeeds: document.getElementById('apple-seeds'),
            fruitsHarvested: document.getElementById('fruits-harvested'),
            experience: document.getElementById('experience'),
            level: document.getElementById('level'),
            weatherInfo: document.getElementById('weather-info'),
            temperature: document.getElementById('temperature'),
            humidity: document.getElementById('humidity'),
            buyAppleSeeds: document.getElementById('buy-apple-seeds'),
            buyWateringCan: document.getElementById('buy-watering-can'),
            buySprinkler: document.getElementById('buy-sprinkler'),
            buyGreenhouse: document.getElementById('buy-greenhouse'),
            buyChicken: document.getElementById('buy-chicken')
        };
        
        this.setupEventListeners();
        this.updateUI();
        this.updateWeatherDisplay();
        
        // Tooltip system
        this.tooltip = this.createTooltip();
        
        // Auto-update UI periodically
        setInterval(() => this.updateUI(), 100);
    }
    
    setupEventListeners() {
        // Shop buttons
        this.elements.buyAppleSeeds.addEventListener('click', () => this.buyAppleSeeds());
        this.elements.buyWateringCan.addEventListener('click', () => this.buyWateringCan());
        this.elements.buySprinkler.addEventListener('click', () => this.buySprinkler());
        this.elements.buyGreenhouse.addEventListener('click', () => this.buyGreenhouse());
        this.elements.buyChicken.addEventListener('click', () => this.buyChicken());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    handleKeyPress(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.waterAllPlots();
                break;
            case 'KeyS':
                if (e.ctrlKey) {
                    e.preventDefault();
                    window.gameState.save();
                    this.showNotification('Game Saved!', 'success');
                }
                break;
            case 'KeyL':
                if (e.ctrlKey) {
                    e.preventDefault();
                    if (window.gameState.load()) {
                        this.showNotification('Game Loaded!', 'success');
                        // Update visuals if game scene exists
                        if (window.gameScene && window.gameScene.farmRenderer) {
                            window.gameScene.farmRenderer.updateAllPlots();
                        }
                    }
                }
                break;
            case 'KeyH':
                this.harvestAllReady();
                break;
        }
    }
    
    waterAllPlots() {
        let watered = 0;
        for (let i = 0; i < window.gameState.farm.plots.length; i++) {
            if (window.gameState.waterPlot(i)) {
                watered++;
            }
        }
        
        if (watered > 0) {
            this.showNotification(`Watered ${watered} plots!`, 'info');
            // Update visuals
            if (window.gameScene && window.gameScene.farmRenderer) {
                window.gameScene.farmRenderer.updateAllPlots();
            }
        }
    }
    
    harvestAllReady() {
        let harvested = 0;
        let totalYield = 0;
        
        for (let i = 0; i < window.gameState.farm.plots.length; i++) {
            const plot = window.gameState.getPlot(i);
            if (plot && plot.crop && plot.crop.stage === GameConfig.cropStages.READY) {
                const result = window.gameState.harvestCrop(i);
                if (result) {
                    harvested++;
                    totalYield += result.yield;
                }
            }
        }
        
        if (harvested > 0) {
            this.showNotification(`Harvested ${harvested} plots! (+${totalYield} crops)`, 'success');
            // Update visuals
            if (window.gameScene && window.gameScene.farmRenderer) {
                window.gameScene.farmRenderer.updateAllPlots();
            }
        }
    }
    
    buyAppleSeeds() {
        const cost = GameConfig.shopItems.APPLE_SEED.cost;
        
        if (window.gameState.spendCoins(cost)) {
            window.gameState.addSeeds(1);
            this.showNotification(`Bought apple seed for ${cost} leaf coins!`, 'success');
            this.updateUI();
        } else {
            this.showNotification('Not enough leaf coins!', 'error');
        }
    }
    
    buyWateringCan() {
        const cost = GameConfig.shopItems.WATERING_CAN.cost;
        
        if (window.gameState.spendCoins(cost)) {
            window.gameState.resources.wateringCans = (window.gameState.resources.wateringCans || 0) + 1;
            this.showNotification('Bought watering can!', 'success');
            this.updateUI();
        } else {
            this.showNotification('Not enough leaf coins!', 'error');
        }
    }
    
    buySprinkler() {
        const cost = GameConfig.shopItems.SPRINKLER.cost;
        
        if (window.gameState.spendCoins(cost)) {
            window.gameState.resources.sprinklers = (window.gameState.resources.sprinklers || 0) + 1;
            this.showNotification('Bought sprinkler! Click a plot to install.', 'success');
            this.updateUI();
        } else {
            this.showNotification('Not enough leaf coins!', 'error');
        }
    }
    
    buyGreenhouse() {
        const cost = GameConfig.shopItems.GREENHOUSE.cost;
        
        if (window.gameState.spendCoins(cost)) {
            window.gameState.resources.greenhouses = (window.gameState.resources.greenhouses || 0) + 1;
            this.showNotification('Bought greenhouse! Click a plot to install.', 'success');
            this.updateUI();
        } else {
            this.showNotification('Not enough leaf coins!', 'error');
        }
    }
    
    buyChicken() {
        const cost = GameConfig.shopItems.CHICKEN.cost;
        
        if (window.gameState.spendCoins(cost)) {
            window.gameState.resources.chickens = (window.gameState.resources.chickens || 0) + 1;
            this.showNotification('Bought chicken helper!', 'success');
            this.updateUI();
        } else {
            this.showNotification('Not enough leaf coins!', 'error');
        }
    }
    
    updateUI() {
        const resources = window.gameState.resources;
        
        // Update resource displays
        if (this.elements.leafCoins) this.elements.leafCoins.textContent = resources.leafCoins || resources.coins || 0;
        if (this.elements.appleSeeds) this.elements.appleSeeds.textContent = resources.seeds || 0;
        if (this.elements.fruitsHarvested) this.elements.fruitsHarvested.textContent = resources.harvest || 0;
        if (this.elements.experience) this.elements.experience.textContent = window.gameState.progression.experience || 0;
        if (this.elements.level) this.elements.level.textContent = window.gameState.progression.level || 1;
        
        // Update button states
        this.updateButtonStates();
        
        // Update progress indicators
        this.updateProgressIndicators();
    }
    
    updateButtonStates() {
        // Enable/disable shop buttons based on resources
        if (this.elements.buyAppleSeeds) {
            this.elements.buyAppleSeeds.disabled = !window.gameState.canAfford(GameConfig.shopItems.APPLE_SEED.cost);
        }
        if (this.elements.buyWateringCan) {
            this.elements.buyWateringCan.disabled = !window.gameState.canAfford(GameConfig.shopItems.WATERING_CAN.cost);
        }
        if (this.elements.buySprinkler) {
            this.elements.buySprinkler.disabled = !window.gameState.canAfford(GameConfig.shopItems.SPRINKLER.cost);
        }
        if (this.elements.buyGreenhouse) {
            this.elements.buyGreenhouse.disabled = !window.gameState.canAfford(GameConfig.shopItems.GREENHOUSE.cost);
        }
        if (this.elements.buyChicken) {
            this.elements.buyChicken.disabled = !window.gameState.canAfford(GameConfig.shopItems.CHICKEN.cost);
        }
    }
    
    updateProgressIndicators() {
        // Update level progress if we want to show it
        const progression = window.gameState.progression;
        const requiredExp = progression.level * 50;
        const expProgress = progression.experience / requiredExp;
        
        // Could add a progress bar to the UI for this
    }
    
    updateWeatherDisplay() {
        const weather = window.weatherSystem.getCurrentWeather();
        const season = window.weatherSystem.getCurrentSeason();
        
        this.elements.weatherInfo.textContent = `${weather.emoji} ${weather.description}`;
        this.elements.temperature.textContent = `${weather.temperature}°C`;
        this.elements.humidity.textContent = `${weather.humidity}%`;
        
        // Add season indicator
        const seasonEmojis = {
            SPRING: '🌸',
            SUMMER: '☀️',
            FALL: '🍂',
            WINTER: '❄️'
        };
        
        // Update weather panel with season info
        const weatherPanel = document.getElementById('weather-panel');
        let seasonElement = weatherPanel.querySelector('.season-info');
        if (!seasonElement) {
            seasonElement = document.createElement('div');
            seasonElement.className = 'season-info';
            seasonElement.style.fontSize = '8px';
            seasonElement.style.marginTop = '5px';
            weatherPanel.appendChild(seasonElement);
        }
        seasonElement.textContent = `${seasonEmojis[season]} ${season}`;
    }
    
    createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 8px;
            border-radius: 4px;
            font-family: 'Press Start 2P', cursive;
            font-size: 8px;
            pointer-events: none;
            z-index: 10000;
            display: none;
            border: 1px solid #555;
        `;
        document.body.appendChild(tooltip);
        return tooltip;
    }
    
    showTooltip(x, y, content) {
        this.tooltip.innerHTML = content;
        this.tooltip.style.left = x + 10 + 'px';
        this.tooltip.style.top = y - 10 + 'px';
        this.tooltip.style.display = 'block';
    }
    
    hideTooltip() {
        this.tooltip.style.display = 'none';
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            font-family: 'Press Start 2P', cursive;
            font-size: 10px;
            z-index: 10001;
            border: 2px solid rgba(255,255,255,0.3);
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
        
        setTimeout(() => {
            notification.style.transition = 'all 0.3s ease';
            notification.style.opacity = '1';
            notification.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
    
    getNotificationColor(type) {
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#3498db',
            warning: '#f39c12'
        };
        return colors[type] || colors.info;
    }
    
    // Crop selection UI (could be expanded)
    showCropSelector(x, y) {
        // For now, just cycle through crop types with number keys
        // Could implement a visual selector here
        this.showNotification('Use 1-3 keys to select crop type', 'info');
    }
    
    // Statistics panel (expandable feature)
    updateStatistics() {
        const stats = {
            totalPlanted: 0,
            totalHarvested: window.gameState.progression.totalHarvested,
            totalEarned: window.gameState.progression.totalEarned,
            level: window.gameState.progression.level,
            plotsUnlocked: window.gameState.farm.unlockedPlots,
            currentWeather: window.weatherSystem.getCurrentWeather().type
        };
        
        // Count current planted crops
        window.gameState.farm.plots.forEach(plot => {
            if (plot.crop) stats.totalPlanted++;
        });
        
        return stats;
    }
    
    // Quality of life features
    setupAutoSave() {
        // Auto-save every 30 seconds
        setInterval(() => {
            window.gameState.save();
        }, 30000);
    }
    
    // Add controls help
    showControlsHelp() {
        const helpText = `
            <div style="text-align: left;">
                <strong>Controls:</strong><br/>
                • Click plot: Plant/Water<br/>
                • Right-click: Harvest<br/>
                • Space: Water all plots<br/>
                • H: Harvest all ready<br/>
                • 1/2/3: Select crop type<br/>
                • Ctrl+S: Save game<br/>
                • Ctrl+L: Load game
            </div>
        `;
        this.showLongNotification(helpText, 5000);
    }
    
    showLongNotification(htmlContent, duration = 3000) {
        const notification = document.createElement('div');
        notification.innerHTML = htmlContent;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(44, 62, 80, 0.95);
            color: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Press Start 2P', cursive;
            font-size: 9px;
            z-index: 10001;
            border: 2px solid #34495e;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    }
    
    // Initialize auto-save and help
    init() {
        this.setupAutoSave();
        
        // Show initial help after a delay
        setTimeout(() => {
            this.showControlsHelp();
        }, 2000);
    }
}

// Global UI manager instance
window.uiManager = new UIManager();