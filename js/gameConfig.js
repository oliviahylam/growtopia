// Game Configuration
const GameConfig = {
    // Canvas settings
    width: 800,
    height: 600,
    
    // Grid settings
    plotSize: 64,
    gridCols: 8,
    gridRows: 6,
    
    // Timing
    gameTickSpeed: 1000, // 1 second per tick
    
    // Crop growth stages
    cropStages: {
        SEED: 0,
        SPROUT: 1,
        GROWING: 2,
        MATURE: 3,
        READY: 4
    },
    
    // Crop types
    cropTypes: {
        WHEAT: {
            name: 'Wheat',
            growthTime: 5, // ticks to mature
            baseYield: 3,
            seedCost: 5,
            sellPrice: 8,
            waterNeed: 0.2,
            emoji: '🌾'
        },
        TOMATO: {
            name: 'Tomato',
            growthTime: 8,
            baseYield: 2,
            seedCost: 10,
            sellPrice: 15,
            waterNeed: 0.3,
            emoji: '🍅'
        },
        CORN: {
            name: 'Corn',
            growthTime: 12,
            baseYield: 4,
            seedCost: 15,
            sellPrice: 25,
            waterNeed: 0.25,
            emoji: '🌽'
        }
    },
    
    // Weather effects
    weatherEffects: {
        SUNNY: { growthMultiplier: 1.0, waterEvaporation: 0.15 },
        RAINY: { growthMultiplier: 1.2, waterEvaporation: 0.05 },
        CLOUDY: { growthMultiplier: 0.9, waterEvaporation: 0.1 },
        STORMY: { growthMultiplier: 0.7, waterEvaporation: 0.05 }
    },
    
    // Shop items
    shopItems: {
        SEEDS: { cost: 10, quantity: 5 },
        FERTILIZER: { cost: 25, effect: 1.5 },
        SPRINKLER: { cost: 100, autoWater: true },
        EXPANSION: { cost: 200, newPlots: 8 }
    },
    
    // Colors for different states
    colors: {
        soil: 0x8B4513,
        grass: 0x228B22,
        water: 0x4169E1,
        fertilized: 0x654321,
        selected: 0xFFD700
    }
};