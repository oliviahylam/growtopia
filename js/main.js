// Main entry point - Initialize Phaser and start the game
document.addEventListener('DOMContentLoaded', () => {
    // Phaser game configuration
    const config = {
        type: Phaser.AUTO,
        width: GameConfig.width,
        height: GameConfig.height,
        parent: 'game-container',
        backgroundColor: '#87CEEB',
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            min: {
                width: 400,
                height: 300
            },
            max: {
                width: 1200,
                height: 900
            }
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: GameScene,
        input: {
            mouse: {
                target: 'game-container'
            },
            touch: {
                target: 'game-container'
            }
        },
        render: {
            pixelArt: true,
            antialias: false,
            clearBeforeRender: true
        }
    };
    
    // Create and start the game
    const game = new Phaser.Game(config);
    
    // Store game reference globally
    window.phaserGame = game;
    
    // Handle window resize for responsive design
    window.addEventListener('resize', () => {
        game.scale.refresh();
    });
    
    // Handle visibility change (pause when tab is hidden)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Auto-save when tab becomes hidden
            window.gameState.save();
            if (window.gameScene) {
                window.gameScene.pause();
            }
        } else {
            if (window.gameScene) {
                window.gameScene.resume();
            }
        }
    });
    
    // Handle page unload (save game)
    window.addEventListener('beforeunload', (e) => {
        window.gameState.save();
    });
    
    // Error handling
    window.addEventListener('error', (e) => {
        console.error('Game error:', e.error);
        // Could implement error reporting or recovery here
    });
    
    // Development helpers (remove in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Dev tools
        window.debugGame = {
            addCoins: (amount) => {
                window.gameState.earnCoins(amount);
                window.uiManager.updateUI();
            },
            addSeeds: (amount) => {
                window.gameState.addSeeds(amount);
                window.uiManager.updateUI();
            },
            triggerWeather: (type) => {
                window.weatherSystem.triggerSpecialWeather(type, 5);
            },
            unlockAllPlots: () => {
                window.gameState.farm.unlockedPlots = window.gameState.farm.maxPlots;
                window.gameState.farm.plots.forEach(plot => plot.isUnlocked = true);
                window.gameScene.farmRenderer.updateAllPlots();
            },
            fastGrowth: () => {
                window.gameState.farm.plots.forEach(plot => {
                    if (plot.crop) {
                        plot.crop.growthProgress += 5;
                    }
                });
            },
            resetGame: () => {
                window.gameState.reset();
                window.gameScene.restart();
            }
        };
        
        console.log('🌾 Growtopia Debug Mode Active');
        console.log('Available debug commands:', Object.keys(window.debugGame));
    }
    
    // Game Analytics (placeholder for future implementation)
    const trackGameEvent = (eventName, properties = {}) => {
        // Could integrate with analytics service
        console.log(`Game Event: ${eventName}`, properties);
    };
    
    // Track game start
    trackGameEvent('game_started', {
        timestamp: Date.now(),
        version: '1.0.0'
    });
    
    // Performance monitoring
    let lastFrameTime = performance.now();
    const monitorPerformance = () => {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastFrameTime;
        lastFrameTime = currentTime;
        
        // Log if frame time is too high (potential performance issue)
        if (deltaTime > 100) { // 100ms = very low FPS
            console.warn('Performance warning: Frame time:', deltaTime + 'ms');
        }
        
        requestAnimationFrame(monitorPerformance);
    };
    
    // Start performance monitoring in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        monitorPerformance();
    }
    
    console.log('🌱 Growtopia farming simulation loaded!');
    console.log('Start farming and grow your empire! 🚜');
});