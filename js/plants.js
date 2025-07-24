// Plant Management System for Growtopia
class PlantManager {
    constructor(weatherSystem) {
        this.plants = new Map();
        this.weatherSystem = weatherSystem;
        this.plantTypes = {
            'apple': {
                name: 'Apple Tree',
                emoji: '🍎',
                stages: ['🌱', '🌿', '🌳', '🌳', '🍎'],
                growthTime: 3 * 60 * 1000 // 3 minutes per stage
            }
        };
        this.nextPlantId = 1;
        
        // Load saved data
        this.loadFromStorage();
        
        // Start growth timer
        this.startGrowthTimer();
    }

    createPlant(x, y, type = 'apple') {
        const plantId = `plant_${this.nextPlantId++}`;
        const now = Date.now();
        
        const plant = {
            id: plantId,
            type: type,
            stage: 1,
            status: 'growing',
            wateredToday: false,
            checklist: [],
            lastUpdated: now,
            plantedAt: now,
            x: x,
            y: y,
            lastWatered: 0,
            lastStageUpdate: now
        };

        this.plants.set(plantId, plant);
        this.saveToStorage();
        
        return plant;
    }

    waterPlant(plantId) {
        const plant = this.plants.get(plantId);
        if (!plant) return false;

        // Check if it's raining (no need to water)
        if (this.weatherSystem.isRaining()) {
            return { success: false, reason: "It's raining! No need to water." };
        }

        // Check if already watered today
        const now = Date.now();
        const todayStart = new Date().setHours(0, 0, 0, 0);
        
        if (plant.lastWatered > todayStart) {
            return { success: false, reason: "Already watered today!" };
        }

        plant.wateredToday = true;
        plant.lastWatered = now;
        
        // Add to today's checklist entry
        this.updateTodayChecklist(plant, { watered: true });
        
        this.saveToStorage();
        return { success: true, reason: "Plant watered successfully!" };
    }

    waterAllPlants() {
        let watered = 0;
        let skipped = 0;
        let reasons = [];

        for (const plant of this.plants.values()) {
            if (plant.status === 'ready') continue;
            
            const result = this.waterPlant(plant.id);
            if (result.success) {
                watered++;
            } else {
                skipped++;
                if (!reasons.includes(result.reason)) {
                    reasons.push(result.reason);
                }
            }
        }

        return { watered, skipped, reasons };
    }

    updateTodayChecklist(plant, updates) {
        const today = new Date().toDateString();
        let todayEntry = plant.checklist.find(entry => 
            new Date(entry.date).toDateString() === today
        );

        if (!todayEntry) {
            todayEntry = {
                date: new Date().toISOString(),
                watered: false,
                weather: this.weatherSystem.getCurrentWeather().status
            };
            plant.checklist.push(todayEntry);
        }

        Object.assign(todayEntry, updates);
    }

    checkGrowth() {
        const now = Date.now();
        let growthOccurred = false;

        for (const plant of this.plants.values()) {
            if (plant.status !== 'growing') continue;

            // Check if enough time has passed for growth
            const timeSinceLastStage = now - plant.lastStageUpdate;
            const growthTime = this.plantTypes[plant.type].growthTime;

            if (timeSinceLastStage >= growthTime) {
                // Update today's checklist with current weather
                this.updateTodayChecklist(plant, {
                    weather: this.weatherSystem.getCurrentWeather().status
                });

                // Check if plant should grow
                if (this.shouldPlantGrow(plant)) {
                    plant.stage = Math.min(plant.stage + 1, 5);
                    plant.lastStageUpdate = now;
                    
                    if (plant.stage >= 5) {
                        plant.status = 'ready';
                    }
                    
                    growthOccurred = true;
                }
                
                // Reset daily watering status
                const todayStart = new Date().setHours(0, 0, 0, 0);
                if (plant.lastWatered < todayStart) {
                    plant.wateredToday = false;
                }
            }
        }

        if (growthOccurred) {
            this.saveToStorage();
        }
    }

    shouldPlantGrow(plant) {
        // Check if plant was watered today (unless it's raining)
        const isRaining = this.weatherSystem.isRaining();
        const weather = this.weatherSystem.getCurrentWeather();
        
        // If weather is harsh, plant doesn't grow regardless
        if (weather.status === 'harsh') {
            return false;
        }

        // If it's raining or plant was watered, it can grow
        return isRaining || plant.wateredToday || weather.status === 'wet';
    }

    harvestPlant(plantId) {
        const plant = this.plants.get(plantId);
        if (!plant || plant.status !== 'ready') {
            return null;
        }

        const grade = this.getHarvestGrade(plant.checklist);
        const rewards = this.calculateRewards(grade);
        
        // Remove the plant
        this.plants.delete(plantId);
        this.saveToStorage();

        return {
            plant: plant,
            grade: grade,
            rewards: rewards
        };
    }

    harvestAllReady() {
        const readyPlants = Array.from(this.plants.values())
            .filter(plant => plant.status === 'ready');
        
        let totalRewards = { fruits: 0, coins: 0, xp: 0 };
        let harvested = [];

        for (const plant of readyPlants) {
            const result = this.harvestPlant(plant.id);
            if (result) {
                harvested.push(result);
                totalRewards.fruits += result.rewards.fruits;
                totalRewards.coins += result.rewards.coins;
                totalRewards.xp += result.rewards.xp;
            }
        }

        return { harvested, totalRewards };
    }

    getHarvestGrade(checklist) {
        if (checklist.length === 0) return 'F';

        const total = checklist.length;
        const watered = checklist.filter(entry => entry.watered).length;
        const ideal = checklist.filter(entry => entry.weather === 'ideal').length;
        
        const wRate = watered / total;
        const iRate = ideal / total;
        
        if (wRate === 1 && iRate >= 0.8) return 'A+';
        if (wRate >= 0.8 && iRate >= 0.6) return 'A';
        if (wRate >= 0.6 && iRate >= 0.4) return 'B';
        return 'F';
    }

    calculateRewards(grade) {
        const rewards = {
            'A+': { fruits: 3, coins: 30, xp: 50 },
            'A': { fruits: 2, coins: 20, xp: 30 },
            'B': { fruits: 1, coins: 10, xp: 15 },
            'F': { fruits: 0, coins: 5, xp: 5 }
        };
        return rewards[grade] || rewards['F'];
    }

    getPlantInfo(plantId) {
        const plant = this.plants.get(plantId);
        if (!plant) return null;

        const plantType = this.plantTypes[plant.type];
        const stageEmoji = plantType.stages[plant.stage - 1];
        
        return {
            ...plant,
            emoji: stageEmoji,
            typeName: plantType.name,
            isReady: plant.status === 'ready',
            nextGrowthIn: this.getTimeUntilNextGrowth(plant)
        };
    }

    getTimeUntilNextGrowth(plant) {
        if (plant.status !== 'growing') return null;
        
        const growthTime = this.plantTypes[plant.type].growthTime;
        const timeSinceLastStage = Date.now() - plant.lastStageUpdate;
        const timeRemaining = growthTime - timeSinceLastStage;
        
        return Math.max(0, timeRemaining);
    }

    getAllPlants() {
        return Array.from(this.plants.values()).map(plant => this.getPlantInfo(plant.id));
    }

    startGrowthTimer() {
        // Check growth every 30 seconds
        setInterval(() => {
            this.checkGrowth();
        }, 30 * 1000);
    }

    saveToStorage() {
        try {
            const data = {
                plants: Array.from(this.plants.entries()),
                nextPlantId: this.nextPlantId
            };
            localStorage.setItem('growtopia_plants', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save plants to storage:', error);
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('growtopia_plants');
            if (saved) {
                const data = JSON.parse(saved);
                this.plants = new Map(data.plants);
                this.nextPlantId = data.nextPlantId || 1;
                
                // Update any plants that may have grown while away
                this.checkGrowth();
            }
        } catch (error) {
            console.error('Failed to load plants from storage:', error);
        }
    }

    deletePlant(plantId) {
        this.plants.delete(plantId);
        this.saveToStorage();
    }

    getStats() {
        const plants = Array.from(this.plants.values());
        return {
            total: plants.length,
            growing: plants.filter(p => p.status === 'growing').length,
            ready: plants.filter(p => p.status === 'ready').length,
            stages: {
                1: plants.filter(p => p.stage === 1).length,
                2: plants.filter(p => p.stage === 2).length,
                3: plants.filter(p => p.stage === 3).length,
                4: plants.filter(p => p.stage === 4).length,
                5: plants.filter(p => p.stage === 5).length
            }
        };
    }
}

// Export for use in other modules
window.PlantManager = PlantManager; 