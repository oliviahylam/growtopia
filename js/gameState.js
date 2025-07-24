// Central Game State Manager
class GameState {
    constructor() {
        this.reset();
    }
    
    reset() {
        // Player resources
        this.resources = {
            leafCoins: GameConfig.currency.startingAmount,
            seeds: 1, // Start with 1 apple seed
            harvest: 0,
            fertilizer: 0,
            sprinklers: 0
        };
        
        // Farm state
        this.farm = {
            plots: [],
            maxPlots: GameConfig.gridCols * GameConfig.gridRows,
            unlockedPlots: 12, // Start with 12 plots
            hasAutoWater: false
        };
        
        // Game progression
        this.progression = {
            level: 1,
            experience: 0,
            totalHarvested: 0,
            totalEarned: 0,
            achievements: []
        };
        
        // Current selections
        this.selectedCropType = 'APPLE';
        this.selectedPlot = null;
        
        // Demo state
        this.demoCompleted = false;
        
        // Game timing
        this.gameTick = 0;
        this.isPaused = false;
        
        this.initializePlots();
    }
    
    initializePlots() {
        this.farm.plots = [];
        for (let i = 0; i < this.farm.maxPlots; i++) {
            this.farm.plots.push({
                id: i,
                isUnlocked: i < this.farm.unlockedPlots,
                crop: null,
                waterLevel: 0.5,
                fertilized: false,
                hasSprinkler: false,
                lastWatered: 0,
                x: (i % GameConfig.gridCols) * GameConfig.plotSize,
                y: Math.floor(i / GameConfig.gridCols) * GameConfig.plotSize
            });
        }
    }
    
    // Resource management
    canAfford(cost) {
        return this.resources.leafCoins >= cost;
    }
    
    spendCoins(amount) {
        if (this.canAfford(amount)) {
            this.resources.leafCoins -= amount;
            return true;
        }
        return false;
    }
    
    earnCoins(amount) {
        this.resources.leafCoins += amount;
        this.progression.totalEarned += amount;
    }
    
    addSeeds(amount) {
        this.resources.seeds += amount;
    }
    
    useSeeds(amount = 1) {
        if (this.resources.seeds >= amount) {
            this.resources.seeds -= amount;
            return true;
        }
        return false;
    }
    
    addHarvest(amount) {
        this.resources.harvest += amount;
        this.progression.totalHarvested += amount;
        this.checkLevelUp();
        
        // Check for demo completion (after 3 harvests)
        if (this.progression.totalHarvested >= 3 && !this.demoCompleted) {
            this.showDemoCompletion();
        }
    }
    
    showDemoCompletion() {
        this.demoCompleted = true;
        setTimeout(() => {
            const message = `🎉 Demo Complete! 🎉\n\nYou've mastered the basics of Growtopia!\n\n✅ Planted seeds\n✅ Cared for plants\n✅ Harvested fruits\n✅ Used the shop\n\nMore plants, animals, and land coming soon!\n\nWould you like to continue growing?`;
            
            if (confirm(message)) {
                // Continue playing
                console.log('Player chose to continue growing!');
            } else {
                // Restart demo
                if (confirm('Restart the demo from the beginning?')) {
                    this.reset();
                    window.location.reload();
                }
            }
        }, 1000);
    }
    
    // Plot management
    getPlot(index) {
        return this.farm.plots[index];
    }
    
    getPlotAt(x, y) {
        const plotX = Math.floor(x / GameConfig.plotSize);
        const plotY = Math.floor(y / GameConfig.plotSize);
        const index = plotY * GameConfig.gridCols + plotX;
        
        if (index >= 0 && index < this.farm.plots.length) {
            return this.farm.plots[index];
        }
        return null;
    }
    
    plantCrop(plotIndex, cropType = 'APPLE') {
        const plot = this.getPlot(plotIndex);
        if (!plot || !plot.isUnlocked || plot.crop) return false;
        
        const cropConfig = GameConfig.plantTypes[cropType];
        if (!cropConfig || !this.useSeeds(1)) return false;
        
        plot.crop = {
            type: cropType,
            stage: GameConfig.growthStages.SEED,
            growthProgress: 0,
            plantedAt: this.gameTick,
            health: 1.0
        };
        
        return true;
    }
    
    harvestCrop(plotIndex) {
        const plot = this.getPlot(plotIndex);
        if (!plot || !plot.crop || plot.crop.stage !== GameConfig.growthStages.FRUITING) {
            return false;
        }
        
        const cropConfig = GameConfig.plantTypes[plot.crop.type];
        const baseYield = cropConfig.baseYield;
        const healthMultiplier = plot.crop.health;
        const fertilizerMultiplier = plot.fertilized ? 1.5 : 1; // Simple fertilizer effect
        
        const yield = Math.floor(baseYield * healthMultiplier * fertilizerMultiplier);
        const earnings = yield * cropConfig.sellPrice;
        
        this.addHarvest(yield);
        this.earnCoins(earnings);
        
        // Reset plot
        plot.crop = null;
        plot.fertilized = false;
        
        return { yield, earnings };
    }
    
    waterPlot(plotIndex) {
        const plot = this.getPlot(plotIndex);
        if (!plot || !plot.isUnlocked) return false;
        
        plot.waterLevel = Math.min(1.0, plot.waterLevel + 0.3);
        plot.lastWatered = this.gameTick;
        return true;
    }
    
    fertilizePlot(plotIndex) {
        const plot = this.getPlot(plotIndex);
        if (!plot || !plot.isUnlocked || this.resources.fertilizer <= 0) return false;
        
        plot.fertilized = true;
        this.resources.fertilizer--;
        return true;
    }
    
    expandFarm() {
        const cost = GameConfig.shopItems.EXPANSION.cost;
        if (!this.spendCoins(cost)) return false;
        
        this.farm.unlockedPlots = Math.min(
            this.farm.maxPlots,
            this.farm.unlockedPlots + GameConfig.shopItems.EXPANSION.newPlots
        );
        
        // Unlock new plots
        for (let i = 0; i < this.farm.plots.length; i++) {
            if (i < this.farm.unlockedPlots) {
                this.farm.plots[i].isUnlocked = true;
            }
        }
        
        return true;
    }
    
    // Progression system
    checkLevelUp() {
        const requiredExp = this.progression.level * 50;
        if (this.progression.experience >= requiredExp) {
            this.progression.level++;
            this.progression.experience = 0;
            // Level up bonus
            this.earnCoins(this.progression.level * 20);
            return true;
        }
        return false;
    }
    
    gainExperience(amount) {
        this.progression.experience += amount;
        this.checkLevelUp();
    }
    
    // Game tick update
    update() {
        if (this.isPaused) return;
        
        this.gameTick++;
        
        // Update all crops
        this.farm.plots.forEach(plot => {
            if (plot.crop && plot.isUnlocked) {
                this.updateCrop(plot);
            }
            
            // Auto-water with sprinklers
            if (plot.hasSprinkler && plot.isUnlocked) {
                plot.waterLevel = Math.min(1.0, plot.waterLevel + 0.1);
            }
        });
    }
    
    updateCrop(plot) {
        const crop = plot.crop;
        const cropConfig = GameConfig.plantTypes[crop.type];
        
        if (crop.stage >= GameConfig.growthStages.FRUITING) return;
        
        // Calculate growth rate based on conditions
        let growthRate = 1.0;
        
        // Water affects growth
        if (plot.waterLevel < cropConfig.waterNeed) {
            growthRate *= 0.5; // Slow growth without enough water
            crop.health -= 0.02; // Health decreases without water
        }
        
        // Weather effects (from weather system)
        if (window.weatherSystem) {
            const weather = window.weatherSystem.getCurrentWeather();
            if (weather && weather.effects) {
                growthRate *= weather.effects.growthMultiplier;
                plot.waterLevel -= weather.effects.waterEvaporation;
            }
        }
        
        // Fertilizer bonus
        if (plot.fertilized) {
            growthRate *= 1.2;
        }
        
        // Update growth
        crop.growthProgress += growthRate;
        
        // Clamp health
        crop.health = Math.max(0.1, Math.min(1.0, crop.health));
        
        // Clamp water level
        plot.waterLevel = Math.max(0, Math.min(1.0, plot.waterLevel));
        
        // Check for stage advancement using new growth stages
        const stageThreshold = cropConfig.growthTime / 4; // 4 stages after seed
        if (crop.growthProgress >= cropConfig.growthTime) {
            crop.stage = GameConfig.growthStages.FRUITING;
        } else if (crop.growthProgress >= stageThreshold * 3) {
            crop.stage = GameConfig.growthStages.BIG_TREE;
        } else if (crop.growthProgress >= stageThreshold * 2) {
            crop.stage = GameConfig.growthStages.SMALL_TREE;
        } else if (crop.growthProgress >= stageThreshold) {
            crop.stage = GameConfig.growthStages.SPROUT;
        }
        
        // Check for sickness due to poor care
        if (crop.health < 0.3 && Math.random() < 0.05) {
            crop.stage = GameConfig.growthStages.SICK;
        }
        
        // Death from extreme neglect
        if (crop.health < 0.1) {
            crop.stage = GameConfig.growthStages.DEAD;
        }
    }
    
    // Save/Load (localStorage)
    save() {
        const saveData = {
            resources: this.resources,
            farm: this.farm,
            progression: this.progression,
            selectedCropType: this.selectedCropType,
            gameTick: this.gameTick
        };
        localStorage.setItem('growtopia_save', JSON.stringify(saveData));
    }
    
    load() {
        const saveData = localStorage.getItem('growtopia_save');
        if (saveData) {
            const data = JSON.parse(saveData);
            this.resources = { ...this.resources, ...data.resources };
            this.farm = { ...this.farm, ...data.farm };
            this.progression = { ...this.progression, ...data.progression };
            this.selectedCropType = data.selectedCropType || 'APPLE';
            this.gameTick = data.gameTick || 0;
            return true;
        }
        return false;
    }
}

// Global game state instance
window.gameState = new GameState();