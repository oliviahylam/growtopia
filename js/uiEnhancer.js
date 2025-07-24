// UI Enhancer - Adds visual assets to UI elements
class UIEnhancer {
    constructor() {
        this.initialized = false;
    }
    
    initialize() {
        if (this.initialized) return;
        
        // Wait for asset renderer to be ready
        if (!window.assetRenderer) {
            setTimeout(() => this.initialize(), 100);
            return;
        }
        
        this.enhanceShopButtons();
        this.enhanceResourceDisplay();
        this.enhanceWeatherDisplay();
        this.addToolIndicators();
        this.addAnimalDisplay();
        
        this.initialized = true;
        console.log('UI Enhanced with visual assets');
    }
    
    enhanceShopButtons() {
        // Apple Seeds button
        const appleSeedsBtn = document.getElementById('buy-apple-seeds');
        if (appleSeedsBtn) {
            this.addIconToButton(appleSeedsBtn, 'apple_seed_icon', 16);
        }
        
        // Watering Can button
        const wateringCanBtn = document.getElementById('buy-watering-can');
        if (wateringCanBtn) {
            this.addIconToButton(wateringCanBtn, 'watering_can', 16);
        }
        
        // Sprinkler button
        const sprinklerBtn = document.getElementById('buy-sprinkler');
        if (sprinklerBtn) {
            this.addIconToButton(sprinklerBtn, 'sprinkler', 16);
        }
        
        // Greenhouse button
        const greenhouseBtn = document.getElementById('buy-greenhouse');
        if (greenhouseBtn) {
            this.addIconToButton(greenhouseBtn, 'greenhouse', 16);
        }
        
        // Chicken button
        const chickenBtn = document.getElementById('buy-chicken');
        if (chickenBtn) {
            this.addIconToButton(chickenBtn, 'chicken_idle', 16);
        }
    }
    
    addIconToButton(button, assetName, size = 16) {
        const asset = window.assetRenderer.getAsset(assetName);
        if (!asset) return;
        
        // Create icon element
        const icon = document.createElement('img');
        icon.src = asset;
        icon.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            margin-right: 8px;
            vertical-align: middle;
            image-rendering: pixelated;
        `;
        
        // Insert icon at the beginning of button
        button.insertBefore(icon, button.firstChild);
    }
    
    enhanceResourceDisplay() {
        // Add Leaf Coin icon
        const leafCoinsSpan = document.querySelector('#resources-panel .resource-item:first-child span:first-child');
        if (leafCoinsSpan) {
            this.addIconToElement(leafCoinsSpan, 'leaf_coin_icon', 12, 'after');
        }
        
        // Add Apple Seed icon
        const appleSeedsSpan = document.querySelector('#resources-panel .resource-item:nth-child(2) span:first-child');
        if (appleSeedsSpan) {
            this.addIconToElement(appleSeedsSpan, 'apple_seed_icon', 12, 'after');
        }
        
        // Add Experience Star icon
        const experienceSpan = document.querySelector('#resources-panel .resource-item:nth-child(4) span:first-child');
        if (experienceSpan) {
            this.addIconToElement(experienceSpan, 'experience_star', 12, 'after');
        }
    }
    
    addIconToElement(element, assetName, size = 12, position = 'before') {
        const asset = window.assetRenderer.getAsset(assetName);
        if (!asset) return;
        
        const icon = document.createElement('img');
        icon.src = asset;
        icon.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            margin: 0 4px;
            vertical-align: middle;
            image-rendering: pixelated;
        `;
        
        if (position === 'before') {
            element.insertBefore(icon, element.firstChild);
        } else {
            element.appendChild(icon);
        }
    }
    
    enhanceWeatherDisplay() {
        // Add weather-specific visual effects
        const weatherPanel = document.getElementById('weather-panel');
        if (!weatherPanel) return;
        
        // Create weather effect overlay
        const weatherOverlay = document.createElement('div');
        weatherOverlay.id = 'weather-overlay';
        weatherOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            border-radius: 6px;
            overflow: hidden;
        `;
        
        weatherPanel.style.position = 'relative';
        weatherPanel.appendChild(weatherOverlay);
        
        // Update weather overlay when weather changes
        this.updateWeatherOverlay();
    }
    
    updateWeatherOverlay() {
        const overlay = document.getElementById('weather-overlay');
        if (!overlay) return;
        
        const currentWeather = window.weatherSystem?.getCurrentWeather();
        if (!currentWeather) return;
        
        // Clear previous overlay
        overlay.innerHTML = '';
        
        let assetName = null;
        switch (currentWeather.type) {
            case 'RAINY':
                assetName = 'rain_overlay';
                break;
            case 'SNOW':
                assetName = 'snow_overlay';
                break;
            case 'SUNNY':
                assetName = 'sun_effect';
                break;
        }
        
        if (assetName) {
            const asset = window.assetRenderer.getAsset(assetName);
            if (asset) {
                overlay.style.backgroundImage = `url('${asset}')`;
                overlay.style.backgroundSize = 'cover';
                overlay.style.backgroundRepeat = 'repeat';
                overlay.style.opacity = '0.3';
                
                // Animate weather effects
                if (currentWeather.type === 'RAINY') {
                    overlay.style.animation = 'rain-fall 1s linear infinite';
                } else if (currentWeather.type === 'SNOW') {
                    overlay.style.animation = 'snow-fall 3s ease-in-out infinite';
                }
            }
        }
    }
    
    addToolIndicators() {
        // Create a tools status panel
        const toolsPanel = document.createElement('div');
        toolsPanel.id = 'tools-status';
        toolsPanel.className = 'ui-panel';
        toolsPanel.style.cssText = `
            top: 350px;
            right: 10px;
            width: 160px;
            display: none;
        `;
        
        toolsPanel.innerHTML = `
            <h3>🔧 Active Tools</h3>
            <div id="active-tools-list">
                <div class="tool-item">No tools active</div>
            </div>
        `;
        
        document.body.appendChild(toolsPanel);
    }
    
    updateToolsDisplay(ownedTools) {
        const toolsList = document.getElementById('active-tools-list');
        const toolsPanel = document.getElementById('tools-status');
        
        if (!toolsList || !toolsPanel) return;
        
        toolsList.innerHTML = '';
        
        if (ownedTools && Object.keys(ownedTools).length > 0) {
            toolsPanel.style.display = 'block';
            
            Object.entries(ownedTools).forEach(([toolType, count]) => {
                if (count > 0) {
                    const toolItem = document.createElement('div');
                    toolItem.className = 'tool-item';
                    toolItem.style.cssText = `
                        display: flex;
                        align-items: center;
                        margin: 4px 0;
                        font-size: 8px;
                    `;
                    
                    const toolConfig = GameConfig.shopItems[toolType];
                    if (toolConfig) {
                        this.addIconToElement(toolItem, this.getToolAssetName(toolType), 12, 'before');
                        toolItem.innerHTML += `${toolConfig.name}: ${count}`;
                    }
                    
                    toolsList.appendChild(toolItem);
                }
            });
        } else {
            toolsPanel.style.display = 'none';
        }
    }
    
    getToolAssetName(toolType) {
        const assetMap = {
            'WATERING_CAN': 'watering_can',
            'SPRINKLER': 'sprinkler',
            'GREENHOUSE': 'greenhouse',
            'WATER_FILTER': 'water_filter'
        };
        return assetMap[toolType] || 'watering_can';
    }
    
    addAnimalDisplay() {
        // Create animals status area
        const animalsContainer = document.createElement('div');
        animalsContainer.id = 'animals-container';
        animalsContainer.style.cssText = `
            position: absolute;
            bottom: 200px;
            left: 220px;
            z-index: 999;
        `;
        
        document.body.appendChild(animalsContainer);
    }
    
    updateAnimalsDisplay(animals) {
        const container = document.getElementById('animals-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (animals && animals.length > 0) {
            animals.forEach((animal, index) => {
                const animalElement = document.createElement('div');
                animalElement.style.cssText = `
                    position: absolute;
                    left: ${index * 40}px;
                    bottom: 0;
                `;
                
                const asset = window.assetRenderer.getAsset('chicken_idle');
                if (asset) {
                    const animalImg = document.createElement('img');
                    animalImg.src = asset;
                    animalImg.style.cssText = `
                        width: 32px;
                        height: 32px;
                        image-rendering: pixelated;
                        animation: chicken-walk 2s ease-in-out infinite;
                    `;
                    
                    animalElement.appendChild(animalImg);
                }
                
                container.appendChild(animalElement);
            });
        }
    }
    
    addCSSStyling() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rain-fall {
                0% { background-position: 0 0; }
                100% { background-position: 20px 20px; }
            }
            
            @keyframes snow-fall {
                0% { background-position: 0 0; }
                50% { background-position: 10px 10px; }
                100% { background-position: 0 20px; }
            }
            
            @keyframes chicken-walk {
                0%, 100% { transform: translateX(0) scaleX(1); }
                25% { transform: translateX(5px) scaleX(1); }
                50% { transform: translateX(10px) scaleX(-1); }
                75% { transform: translateX(5px) scaleX(-1); }
            }
            
            .tool-item {
                transition: all 0.3s ease;
            }
            
            .tool-item:hover {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                padding: 2px 4px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Method to update all visual elements
    updateAllVisuals() {
        this.updateWeatherOverlay();
        
        // Update tools display if game state exists
        if (window.gameState) {
            this.updateToolsDisplay(window.gameState.inventory?.tools);
            this.updateAnimalsDisplay(window.gameState.inventory?.animals);
        }
    }
}

// Initialize UI enhancer after a delay to ensure assets are loaded
window.addEventListener('DOMContentLoaded', () => {
    window.uiEnhancer = new UIEnhancer();
    
    // Initialize after assets are ready
    setTimeout(() => {
        window.uiEnhancer.initialize();
        window.uiEnhancer.addCSSStyling();
    }, 500);
});