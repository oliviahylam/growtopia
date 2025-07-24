// Crop System - Manages crop types, growth, and interactions
class CropSystem {
    constructor() {
        this.cropTypes = GameConfig.cropTypes;
        this.animations = new Map();
        this.particles = [];
    }
    
    // Get crop visual representation based on stage
    getCropVisual(crop) {
        if (!crop) return null;
        
        const cropConfig = this.cropTypes[crop.type];
        const stage = crop.stage;
        
        // Visual representations for each growth stage
        const visuals = {
            WHEAT: {
                [GameConfig.cropStages.SEED]: { emoji: '🟫', color: 0x8B4513, size: 0.3 },
                [GameConfig.cropStages.SPROUT]: { emoji: '🌱', color: 0x90EE90, size: 0.5 },
                [GameConfig.cropStages.GROWING]: { emoji: '🌿', color: 0x32CD32, size: 0.7 },
                [GameConfig.cropStages.MATURE]: { emoji: '🌾', color: 0xDAA520, size: 0.9 },
                [GameConfig.cropStages.READY]: { emoji: '🌾', color: 0xFFD700, size: 1.0 }
            },
            TOMATO: {
                [GameConfig.cropStages.SEED]: { emoji: '🟫', color: 0x8B4513, size: 0.3 },
                [GameConfig.cropStages.SPROUT]: { emoji: '🌱', color: 0x90EE90, size: 0.5 },
                [GameConfig.cropStages.GROWING]: { emoji: '🍃', color: 0x32CD32, size: 0.7 },
                [GameConfig.cropStages.MATURE]: { emoji: '🟩', color: 0x228B22, size: 0.9 },
                [GameConfig.cropStages.READY]: { emoji: '🍅', color: 0xFF6347, size: 1.0 }
            },
            CORN: {
                [GameConfig.cropStages.SEED]: { emoji: '🟫', color: 0x8B4513, size: 0.3 },
                [GameConfig.cropStages.SPROUT]: { emoji: '🌱', color: 0x90EE90, size: 0.5 },
                [GameConfig.cropStages.GROWING]: { emoji: '🌿', color: 0x32CD32, size: 0.7 },
                [GameConfig.cropStages.MATURE]: { emoji: '🌽', color: 0x9ACD32, size: 0.9 },
                [GameConfig.cropStages.READY]: { emoji: '🌽', color: 0xFFD700, size: 1.0 }
            }
        };
        
        const cropVisuals = visuals[crop.type];
        if (!cropVisuals) return null;
        
        return cropVisuals[stage] || cropVisuals[GameConfig.cropStages.SEED];
    }
    
    // Calculate crop health color modifier
    getHealthColor(health) {
        if (health >= 0.8) return 0xFFFFFF; // Healthy - white
        if (health >= 0.6) return 0xFFFF99; // Good - light yellow
        if (health >= 0.4) return 0xFFCC66; // Fair - orange
        if (health >= 0.2) return 0xFF9966; // Poor - red-orange
        return 0xFF6666; // Critical - red
    }
    
    // Get growth progress percentage
    getGrowthProgress(crop) {
        if (!crop) return 0;
        const cropConfig = this.cropTypes[crop.type];
        return Math.min(1, crop.growthProgress / cropConfig.growthTime);
    }
    
    // Calculate potential yield based on conditions
    calculateYield(plot) {
        if (!plot.crop || plot.crop.stage !== GameConfig.cropStages.READY) {
            return 0;
        }
        
        const cropConfig = this.cropTypes[plot.crop.type];
        let yield = cropConfig.baseYield;
        
        // Health multiplier
        yield *= plot.crop.health;
        
        // Fertilizer bonus
        if (plot.fertilized) {
            yield *= GameConfig.shopItems.FERTILIZER.effect;
        }
        
        // Seasonal bonus
        const seasonalEffects = window.weatherSystem?.getSeasonalEffects() || {};
        if (seasonalEffects.harvestBonus) {
            yield *= seasonalEffects.harvestBonus;
        }
        
        return Math.floor(yield);
    }
    
    // Calculate potential earnings
    calculateEarnings(plot) {
        const yield = this.calculateYield(plot);
        if (yield === 0) return 0;
        
        const cropConfig = this.cropTypes[plot.crop.type];
        let earnings = yield * cropConfig.sellPrice;
        
        // Seasonal price bonus
        const seasonalEffects = window.weatherSystem?.getSeasonalEffects() || {};
        if (seasonalEffects.sellPriceBonus) {
            earnings *= seasonalEffects.sellPriceBonus;
        }
        
        return Math.floor(earnings);
    }
    
    // Get crop information for tooltip
    getCropInfo(crop) {
        if (!crop) return null;
        
        const cropConfig = this.cropTypes[crop.type];
        const progress = this.getGrowthProgress(crop);
        
        return {
            name: cropConfig.name,
            stage: this.getStageNameString(crop.stage),
            progress: Math.round(progress * 100),
            health: Math.round(crop.health * 100),
            emoji: cropConfig.emoji,
            timeRemaining: Math.max(0, cropConfig.growthTime - crop.growthProgress)
        };
    }
    
    getStageNameString(stage) {
        const stageNames = {
            [GameConfig.cropStages.SEED]: 'Planted',
            [GameConfig.cropStages.SPROUT]: 'Sprouting',
            [GameConfig.cropStages.GROWING]: 'Growing',
            [GameConfig.cropStages.MATURE]: 'Maturing',
            [GameConfig.cropStages.READY]: 'Ready!'
        };
        return stageNames[stage] || 'Unknown';
    }
    
    // Disease and pest system
    checkForDiseases(plot) {
        if (!plot.crop) return false;
        
        // Disease probability based on conditions
        let diseaseChance = 0.001; // Base 0.1% chance per tick
        
        // Poor conditions increase disease chance
        if (plot.waterLevel < 0.2 || plot.waterLevel > 0.9) {
            diseaseChance *= 3;
        }
        
        if (plot.crop.health < 0.5) {
            diseaseChance *= 2;
        }
        
        // Weather affects disease
        const weather = window.weatherSystem?.getCurrentWeather();
        if (weather) {
            if (weather.type === 'STORMY') diseaseChance *= 2;
            if (weather.humidity > 80) diseaseChance *= 1.5;
        }
        
        if (Math.random() < diseaseChance) {
            this.applyDisease(plot);
            return true;
        }
        
        return false;
    }
    
    applyDisease(plot) {
        if (!plot.crop) return;
        
        // Reduce health
        plot.crop.health -= 0.2 + Math.random() * 0.3;
        plot.crop.health = Math.max(0.1, plot.crop.health);
        
        // Create visual effect
        this.createDiseaseParticle(plot);
    }
    
    // Particle effects for visual feedback
    createHarvestParticle(plot, yield) {
        const particle = {
            x: plot.x + GameConfig.plotSize / 2,
            y: plot.y + GameConfig.plotSize / 2,
            text: `+${yield}`,
            color: 0x00FF00,
            life: 60, // frames
            maxLife: 60,
            velocityY: -2,
            type: 'harvest'
        };
        this.particles.push(particle);
    }
    
    createDiseaseParticle(plot) {
        const particle = {
            x: plot.x + GameConfig.plotSize / 2,
            y: plot.y + GameConfig.plotSize / 2,
            text: 'Disease!',
            color: 0xFF0000,
            life: 90,
            maxLife: 90,
            velocityY: -1,
            type: 'disease'
        };
        this.particles.push(particle);
    }
    
    createLevelUpParticle(plot) {
        const particle = {
            x: plot.x + GameConfig.plotSize / 2,
            y: plot.y + GameConfig.plotSize / 2,
            text: 'Stage Up!',
            color: 0xFFD700,
            life: 120,
            maxLife: 120,
            velocityY: -1.5,
            type: 'levelup'
        };
        this.particles.push(particle);
    }
    
    // Update particles
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.life--;
            particle.y += particle.velocityY;
            particle.velocityY *= 0.98; // Slow down over time
            
            return particle.life > 0;
        });
    }
    
    getParticles() {
        return this.particles;
    }
    
    // Crop rotation benefits
    getCropRotationBonus(plot, newCropType) {
        if (!plot.lastCropType) return 1.0;
        
        // Different crop families benefit from rotation
        const cropFamilies = {
            WHEAT: 'grain',
            CORN: 'grain', 
            TOMATO: 'fruit'
        };
        
        const lastFamily = cropFamilies[plot.lastCropType];
        const newFamily = cropFamilies[newCropType];
        
        if (lastFamily !== newFamily) {
            return 1.2; // 20% bonus for crop rotation
        }
        
        return 1.0;
    }
    
    // Companion planting (adjacent crop bonuses)
    getCompanionBonus(plotIndex) {
        const plot = window.gameState.getPlot(plotIndex);
        if (!plot || !plot.crop) return 1.0;
        
        // Check adjacent plots
        const adjacentIndices = this.getAdjacentPlots(plotIndex);
        let bonus = 1.0;
        
        for (const adjIndex of adjacentIndices) {
            const adjPlot = window.gameState.getPlot(adjIndex);
            if (adjPlot && adjPlot.crop) {
                // Tomatoes benefit from being near other plants
                if (plot.crop.type === 'TOMATO') {
                    bonus += 0.05; // 5% per adjacent plant
                }
                
                // Wheat benefits from corn nearby
                if (plot.crop.type === 'WHEAT' && adjPlot.crop.type === 'CORN') {
                    bonus += 0.1;
                }
            }
        }
        
        return Math.min(1.5, bonus); // Cap at 50% bonus
    }
    
    getAdjacentPlots(index) {
        const adjacent = [];
        const row = Math.floor(index / GameConfig.gridCols);
        const col = index % GameConfig.gridCols;
        
        // Check all 8 directions
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue; // Skip self
                
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < GameConfig.gridRows && 
                    newCol >= 0 && newCol < GameConfig.gridCols) {
                    adjacent.push(newRow * GameConfig.gridCols + newCol);
                }
            }
        }
        
        return adjacent;
    }
    
    // Quality grades for crops
    getCropQuality(crop) {
        if (!crop || crop.stage !== GameConfig.cropStages.READY) {
            return 'Poor';
        }
        
        const health = crop.health;
        
        if (health >= 0.9) return 'Perfect';
        if (health >= 0.8) return 'Excellent';
        if (health >= 0.7) return 'Good';
        if (health >= 0.5) return 'Fair';
        return 'Poor';
    }
    
    getQualityMultiplier(quality) {
        const multipliers = {
            'Perfect': 2.0,
            'Excellent': 1.5,
            'Good': 1.2,
            'Fair': 1.0,
            'Poor': 0.8
        };
        return multipliers[quality] || 1.0;
    }
}

// Global crop system instance
window.cropSystem = new CropSystem();