// Main Game Scene - Phaser scene that orchestrates all systems
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.farmRenderer = null;
        this.particleRenderer = null;
        this.backgroundGraphics = null;
        this.gameTicker = null;
    }
    
    preload() {
        // Set background color
        this.cameras.main.setBackgroundColor('#87CEEB'); // Sky blue
        
        // Enable right-click context menu prevention
        this.input.mouse.disableContextMenu();
    }
    
    create() {
        // Initialize systems
        this.setupBackground();
        this.setupFarmRenderer();
        this.setupParticleSystem();
        this.setupGameTicker();
        this.setupInput();
        
        // Store reference globally for UI access
        window.gameScene = this;
        
        // Initialize UI manager
        window.uiManager.init();
        
        console.log('Growtopia initialized!');
    }
    
    setupBackground() {
        // Create sky gradient
        this.backgroundGraphics = this.add.graphics();
        this.drawBackground();
        
        // Add some clouds for atmosphere
        this.createClouds();
    }
    
    drawBackground() {
        const { width, height } = this.sys.game.config;
        
        // Sky gradient
        this.backgroundGraphics.clear();
        
        // Create gradient effect manually
        for (let y = 0; y < height; y++) {
            const alpha = 1 - (y / height) * 0.3;
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                { r: 135, g: 206, b: 235 }, // Light sky blue
                { r: 176, g: 224, b: 230 }, // Powder blue
                height,
                y
            );
            
            this.backgroundGraphics.fillStyle(
                Phaser.Display.Color.GetColor(color.r, color.g, color.b),
                alpha
            );
            this.backgroundGraphics.fillRect(0, y, width, 1);
        }
    }
    
    createClouds() {
        // Simple cloud sprites using graphics
        for (let i = 0; i < 5; i++) {
            const cloud = this.add.graphics();
            cloud.fillStyle(0xFFFFFF, 0.8);
            
            // Draw cloud shape
            cloud.fillCircle(0, 0, 20);
            cloud.fillCircle(15, -5, 25);
            cloud.fillCircle(30, 0, 20);
            cloud.fillCircle(20, 10, 15);
            
            cloud.x = Math.random() * this.sys.game.config.width;
            cloud.y = Math.random() * 150 + 50;
            cloud.setDepth(-1);
            
            // Slow moving clouds
            this.tweens.add({
                targets: cloud,
                x: cloud.x + this.sys.game.config.width + 100,
                duration: 60000 + Math.random() * 30000,
                repeat: -1,
                onRepeat: () => {
                    cloud.x = -100;
                }
            });
        }
    }
    
    setupFarmRenderer() {
        this.farmRenderer = new window.FarmPlotRenderer(this);
    }
    
    setupParticleSystem() {
        // Create particle renderer for effects
        this.particleGraphics = this.add.graphics();
        this.particleGraphics.setDepth(100); // Above everything else
    }
    
    setupGameTicker() {
        // Game tick timer
        this.gameTicker = this.time.addEvent({
            delay: GameConfig.gameTickSpeed,
            callback: this.gameTick,
            callbackScope: this,
            loop: true
        });
    }
    
    setupInput() {
        // Global input handlers
        this.input.keyboard.on('keydown', (event) => {
            // Additional scene-specific input handling if needed
        });
        
        // Mouse/touch handling for mobile support
        this.input.on('pointerdown', (pointer) => {
            // Global pointer events if needed
        });
    }
    
    gameTick() {
        // Update all game systems
        window.gameState.update();
        window.weatherSystem.update(window.gameState.gameTick);
        window.cropSystem.updateParticles();
        
        // Update UI
        window.uiManager.updateWeatherDisplay();
        
        // Check for achievements or special events
        this.checkGameEvents();
        
        // Update farm renderer
        if (this.farmRenderer) {
            this.farmRenderer.updateAllPlots();
        }
    }
    
    checkGameEvents() {
        // Level up notifications
        const progression = window.gameState.progression;
        
        // Special weather events (rare)
        if (Math.random() < 0.001) { // 0.1% chance per tick
            this.triggerSpecialEvent();
        }
        
        // Seasonal transitions
        if (window.weatherSystem.seasonTick === 1) {
            const season = window.weatherSystem.getCurrentSeason();
            window.uiManager.showNotification(`${season} has arrived!`, 'info');
        }
    }
    
    triggerSpecialEvent() {
        const events = [
            {
                name: 'Golden Rain',
                message: 'Golden rain boosts growth!',
                effect: () => window.weatherSystem.triggerSpecialWeather('RAINY', 10)
            },
            {
                name: 'Perfect Sun',
                message: 'Perfect sunshine day!',
                effect: () => window.weatherSystem.triggerSpecialWeather('SUNNY', 8)
            },
            {
                name: 'Coin Shower',
                message: 'Lucky day! Found some coins!',
                effect: () => {
                    window.gameState.earnCoins(20 + Math.random() * 30);
                    window.uiManager.updateUI();
                }
            }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        window.uiManager.showNotification(event.message, 'warning');
        event.effect();
    }
    
    update() {
        // Called every frame
        if (this.farmRenderer) {
            this.farmRenderer.update();
        }
        
        this.updateParticles();
        this.updateBackgroundEffects();
    }
    
    updateParticles() {
        const particles = window.cropSystem.getParticles();
        
        this.particleGraphics.clear();
        
        particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            
            // Set color and alpha
            this.particleGraphics.fillStyle(particle.color, alpha);
            
            // Draw particle based on type
            switch (particle.type) {
                case 'harvest':
                    this.particleGraphics.fillRect(particle.x - 10, particle.y - 5, 20, 10);
                    break;
                case 'disease':
                    this.particleGraphics.fillCircle(particle.x, particle.y, 8);
                    break;
                case 'levelup':
                    this.particleGraphics.fillStar(particle.x, particle.y, 5, 8, 12);
                    break;
            }
            
            // Draw text
            if (particle.text) {
                this.add.text(particle.x, particle.y, particle.text, {
                    fontSize: '12px',
                    fontFamily: 'Press Start 2P',
                    fill: `#${particle.color.toString(16).padStart(6, '0')}`,
                    stroke: '#000000',
                    strokeThickness: 2
                }).setOrigin(0.5).setAlpha(alpha).setDepth(200);
            }
        });
    }
    
    updateBackgroundEffects() {
        // Weather-based background effects
        const weather = window.weatherSystem.getCurrentWeather();
        
        if (weather.type === 'RAINY' && Math.random() < 0.3) {
            this.createRainDrop();
        }
        
        if (weather.type === 'STORMY' && Math.random() < 0.1) {
            this.createLightning();
        }
    }
    
    createRainDrop() {
        const drop = this.add.graphics();
        drop.fillStyle(0x4169E1, 0.6);
        drop.fillRect(0, 0, 2, 8);
        
        drop.x = Math.random() * this.sys.game.config.width;
        drop.y = -10;
        drop.setDepth(10);
        
        this.tweens.add({
            targets: drop,
            y: this.sys.game.config.height + 10,
            duration: 1000 + Math.random() * 500,
            ease: 'Linear',
            onComplete: () => drop.destroy()
        });
    }
    
    createLightning() {
        const flash = this.add.graphics();
        flash.fillStyle(0xFFFFFF, 0.3);
        flash.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);
        flash.setDepth(500);
        
        setTimeout(() => flash.destroy(), 100);
    }
    
    // Scene management
    pause() {
        window.gameState.isPaused = true;
        this.scene.pause();
    }
    
    resume() {
        window.gameState.isPaused = false;
        this.scene.resume();
    }
    
    restart() {
        window.gameState.reset();
        this.scene.restart();
    }
    
    // Cleanup
    shutdown() {
        if (this.farmRenderer) {
            this.farmRenderer.destroy();
        }
        
        if (this.gameTicker) {
            this.gameTicker.destroy();
        }
        
        // Clear global references
        window.gameScene = null;
    }
}