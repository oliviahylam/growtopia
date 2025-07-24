// Game Configuration - Updated for Growtopia MVP
const GameConfig = {
    // Canvas settings
    width: 800,
    height: 600,
    
    // Grid settings
    plotSize: 64,
    gridCols: 8,
    gridRows: 6,
    
    // Timing
    gameTickSpeed: 2000, // 2 seconds per tick for slower, more contemplative gameplay
    
    // Plant growth stages
    growthStages: {
        EMPTY: 0,
        SEED: 1,
        SPROUT: 2,
        SMALL_TREE: 3,
        BIG_TREE: 4,
        FRUITING: 5,
        SICK: 6,
        DEAD: 7
    },
    
    // Plant types (starting with apple for MVP)
    plantTypes: {
        APPLE: {
            name: 'Apple Tree',
            growthTime: 20, // ticks to reach fruiting stage
            baseYield: 3,
            seedCost: 15,
            sellPrice: 12,
            waterNeed: 0.25,
            emoji: '🍎',
            stages: ['🌰', '🌱', '🌿', '🌳', '🍎']
        }
    },
    
    // Weather types (can be from API or simulated)
    weatherTypes: {
        SUNNY: { 
            name: 'Sunny', 
            emoji: '☀️',
            growthMultiplier: 1.2, 
            waterEvaporation: 0.2,
            description: 'Clear skies boost growth'
        },
        RAINY: { 
            name: 'Rainy', 
            emoji: '🌧️',
            growthMultiplier: 1.0, 
            waterEvaporation: 0.0,
            autoWater: true,
            description: 'Rain auto-waters plants'
        },
        CLOUDY: { 
            name: 'Cloudy', 
            emoji: '☁️',
            growthMultiplier: 0.9, 
            waterEvaporation: 0.1,
            description: 'Overcast skies slow growth'
        },
        SNOW: { 
            name: 'Snow', 
            emoji: '❄️',
            growthMultiplier: 0.3, 
            waterEvaporation: 0.05,
            description: 'Cold weather halts growth'
        },
        DROUGHT: { 
            name: 'Drought', 
            emoji: '🔥',
            growthMultiplier: 0.8, 
            waterEvaporation: 0.35,
            description: 'Extreme heat drains water'
        }
    },
    
    // Environmental conditions
    environment: {
        maxWaterLevel: 1.0,
        maxSoilQuality: 1.0,
        maxPollution: 1.0,
        pestProbability: 0.02, // 2% chance per tick
        pollutionIncrease: 0.01, // per tick without care
        soilDegradation: 0.005 // per tick
    },
    
    // Shop items
    shopItems: {
        // Seeds tab
        APPLE_SEED: { 
            type: 'seed',
            name: 'Apple Seed',
            cost: 15, 
            plantType: 'APPLE',
            description: 'Grows into a fruit-bearing apple tree',
            emoji: '🌰'
        },
        
        // Tools tab
        WATERING_CAN: {
            type: 'tool',
            name: 'Watering Can',
            cost: 50,
            description: 'Manual watering tool',
            emoji: '🪣'
        },
        SPRINKLER: { 
            type: 'tool',
            name: 'Sprinkler',
            cost: 150, 
            description: 'Auto-waters nearby plants every 3 ticks',
            emoji: '💧'
        },
        GREENHOUSE: { 
            type: 'tool',
            name: 'Greenhouse',
            cost: 300, 
            description: 'Protects from frost and snow',
            emoji: '🏠'
        },
        WATER_FILTER: {
            type: 'tool',
            name: 'Water Filter',
            cost: 200,
            description: 'Reduces pollution over time',
            emoji: '🔧'
        },
        
        // Animals tab
        CHICKEN: {
            type: 'animal',
            name: 'Chicken',
            cost: 250,
            description: 'Clears pests automatically every 3 ticks',
            emoji: '🐓'
        }
    },
    
    // Tutorial steps
    tutorial: {
        steps: [
            {
                id: 'welcome',
                title: 'Welcome to Growtopia!',
                text: 'Plant your first seed and grow a tree by taking care of its needs.',
                action: 'continue'
            },
            {
                id: 'plant',
                title: 'Plant Your Seed',
                text: 'Click to plant your seed. Today\'s weather affects your plant\'s growth!',
                action: 'plant_seed',
                highlight: 'plot'
            },
            {
                id: 'water',
                title: 'Water Your Plant',
                text: 'Water your seed to help it grow. Reach Stage 5 to harvest fruits!',
                action: 'water_plant',
                highlight: 'plant'
            },
            {
                id: 'observe',
                title: 'Watch It Grow',
                text: 'Your plant will grow through 5 stages. Monitor its health and conditions.',
                action: 'wait',
                highlight: 'conditions'
            },
            {
                id: 'harvest',
                title: 'Harvest Your Fruit',
                text: 'When your tree reaches Stage 5, click to harvest fruits and earn Leaf Coins!',
                action: 'harvest',
                highlight: 'plant'
            },
            {
                id: 'shop',
                title: 'Visit the Shop',
                text: 'Use your Leaf Coins to buy more seeds, tools, and animal helpers.',
                action: 'open_shop',
                highlight: 'shop_button'
            }
        ]
    },
    
    // Currency and progression
    currency: {
        name: 'Leaf Coins',
        emoji: '🍃',
        startingAmount: 50
    },
    
    experience: {
        harvestXP: 10,
        careXP: 2,
        levelMultiplier: 100
    },
    
    // Animal behaviors
    animals: {
        CHICKEN: {
            name: 'Chicken',
            actionInterval: 3, // ticks between actions
            pestClearRadius: 2, // plots around chicken
            animations: ['idle', 'walk', 'peck']
        }
    },
    
    // Notifications
    notifications: {
        NEEDS_WATER: { text: 'Plant needs water!', icon: '💧', priority: 2 },
        PESTS_DETECTED: { text: 'Pests detected!', icon: '🐛', priority: 3 },
        READY_HARVEST: { text: 'Ready to harvest!', icon: '🍎', priority: 1 },
        PLANT_SICK: { text: 'Plant is sick!', icon: '🤒', priority: 4 },
        FRUITS_DROPPED: { text: 'Fruits dropped!', icon: '💔', priority: 3 }
    },
    
    // Visual feedback colors
    colors: {
        soil: 0x8B4513,
        grass: 0x228B22,
        water: 0x4169E1,
        healthy: 0x32CD32,
        sick: 0xFFFF00,
        dead: 0x8B4513,
        pollution: 0x696969,
        selected: 0xFFD700
    },
    
    // Weather API configuration (OpenWeatherMap)
    weather: {
        apiKey: 'YOUR_API_KEY_HERE', // Replace with actual API key
        apiUrl: 'https://api.openweathermap.org/data/2.5/weather',
        defaultCity: 'London',
        updateInterval: 300000, // 5 minutes
        useRealWeather: false // Set to true when API key is available
    },
    
    // Eco system scoring
    ecoScore: {
        maxScore: 100,
        factors: {
            plantHealth: 0.4,
            pollution: -0.3,
            soilQuality: 0.2,
            biodiversity: 0.1
        }
    }
};