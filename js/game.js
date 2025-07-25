// Main Game File for Growtopia
class GrowtopiaGame extends Phaser.Scene {
    constructor() {
        super({ key: 'GrowtopiaGame' });
        this.gridSize = 64;
        this.gridWidth = 8;
        this.gridHeight = 6;
        this.plantSprites = new Map();
        this.selectedTile = null;
        this.playerStats = {
            coins: 0,
            xp: 0,
            fruits: 0
        };
    }

    preload() {
        // Create pixel art sprites programmatically
        this.createPixelSprites();
    }

    create() {
        // Initialize systems
        this.weatherSystem = new WeatherSystem();
        this.weatherSystem.setApiKey('82b76cced925fdddfbe8866df6f66045');
        this.plantManager = new PlantManager(this.weatherSystem);
        
        // Load player stats
        this.loadPlayerStats();
        
        // Create game world
        this.createWorld();
        this.createUI();
        
        // Set up input
        this.setupInput();
        
        // Start weather updates
        this.weatherSystem.updateWeather();
        
        // Set up timers
        this.setupTimers();
        
        // Render existing plants
        this.renderAllPlants();
        
        // Update UI
        this.updateStatsDisplay();
    }

    createPixelSprites() {
        // Create soil tile
        this.add.graphics()
            .fillStyle(0x8B4513)
            .fillRect(0, 0, this.gridSize, this.gridSize)
            .generateTexture('soil', this.gridSize, this.gridSize);

        // Create tilled soil
        this.add.graphics()
            .fillStyle(0x654321)
            .fillRect(0, 0, this.gridSize, this.gridSize)
            .fillStyle(0x8B4513)
            .fillRect(4, 4, this.gridSize - 8, this.gridSize - 8)
            .generateTexture('tilled_soil', this.gridSize, this.gridSize);

        // Create selection highlight
        this.add.graphics()
            .lineStyle(3, 0xFFFFFF, 0.8)
            .strokeRect(0, 0, this.gridSize, this.gridSize)
            .generateTexture('selection', this.gridSize, this.gridSize);

        // Create plant sprites
        this.createPlantSprites();
    }

    createPlantSprites() {
        const plantStages = ['🌱', '🌿', '🌳', '🌳', '🍎'];
        
        plantStages.forEach((emoji, index) => {
            // Create a simple colored square for each stage for now
            // In a real game, you'd load actual pixel art sprites
            const colors = [0x90EE90, 0x32CD32, 0x228B22, 0x006400, 0xFF0000];
            const size = Math.min(40 + index * 4, 56);
            
            this.add.graphics()
                .fillStyle(colors[index])
                .fillRoundedRect(
                    (this.gridSize - size) / 2,
                    (this.gridSize - size) / 2,
                    size, size, 4
                )
                .generateTexture(`plant_stage_${index + 1}`, this.gridSize, this.gridSize);
        });
    }

    createWorld() {
        // Create grid background
        this.createGrid();
        
        // Create farm tiles
        this.farmTiles = [];
        for (let x = 0; x < this.gridWidth; x++) {
            this.farmTiles[x] = [];
            for (let y = 0; y < this.gridHeight; y++) {
                const tile = this.add.sprite(
                    x * this.gridSize + this.gridSize / 2,
                    y * this.gridSize + this.gridSize / 2,
                    'soil'
                );
                tile.setInteractive();
                tile.gridX = x;
                tile.gridY = y;
                this.farmTiles[x][y] = tile;
                
                // Add click handler
                tile.on('pointerdown', () => this.onTileClick(x, y));
                tile.on('pointerover', () => this.onTileHover(x, y));
            }
        }
    }

    createGrid() {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x444444, 0.5);
        
        // Vertical lines
        for (let x = 0; x <= this.gridWidth; x++) {
            graphics.moveTo(x * this.gridSize, 0);
            graphics.lineTo(x * this.gridSize, this.gridHeight * this.gridSize);
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.gridHeight; y++) {
            graphics.moveTo(0, y * this.gridSize);
            graphics.lineTo(this.gridWidth * this.gridSize, y * this.gridSize);
        }
        
        graphics.strokePath();
    }

    createUI() {
        // Create info panel for selected plants
        this.infoPanel = this.add.container(this.gridWidth * this.gridSize + 20, 20);
        this.infoPanelBg = this.add.rectangle(0, 0, 200, 300, 0x2c3e50, 0.9);
        this.infoPanelText = this.add.text(-90, -140, 'Select a tile', {
            fontSize: '12px',
            fill: '#ffffff',
            wordWrap: { width: 180 }
        });
        
        this.infoPanel.add([this.infoPanelBg, this.infoPanelText]);
        
        // Set up DOM button handlers
        this.setupDOMButtons();
    }

    setupDOMButtons() {
        // Plant seed button
        document.getElementById('plant-seed').addEventListener('click', () => {
            if (this.selectedTile) {
                this.plantSeed(this.selectedTile.x, this.selectedTile.y);
            } else {
                this.showMessage('Select a tile first!');
            }
        });

        // Water all button
        document.getElementById('water-all').addEventListener('click', () => {
            const result = this.plantManager.waterAllPlants();
            this.showMessage(`Watered ${result.watered} plants. Skipped ${result.skipped}.`);
            this.renderAllPlants();
        });

        // Harvest ready button
        document.getElementById('harvest-ready').addEventListener('click', () => {
            const result = this.plantManager.harvestAllReady();
            if (result.harvested.length > 0) {
                this.addRewards(result.totalRewards);
                this.showMessage(`Harvested ${result.harvested.length} plants! Grade summary: ${result.harvested.map(h => h.grade).join(', ')}`);
                this.renderAllPlants();
            } else {
                this.showMessage('No plants ready for harvest!');
            }
        });
    }

    setupInput() {
        // Right-click for plant actions
        this.input.on('pointerdown', (pointer, currentlyOver) => {
            if (pointer.rightButtonDown() && this.selectedTile) {
                this.showPlantContextMenu(this.selectedTile.x, this.selectedTile.y);
            }
        });

        // Keyboard shortcuts
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.selectedTile) {
                this.waterSelectedPlant();
            }
        });

        this.input.keyboard.on('keydown-H', () => {
            if (this.selectedTile) {
                this.harvestSelectedPlant();
            }
        });
    }

    setupTimers() {
        // Update weather every 10 minutes
        this.time.addEvent({
            delay: 10 * 60 * 1000,
            callback: () => this.weatherSystem.updateWeather(),
            loop: true
        });

        // Update plant display every 30 seconds
        this.time.addEvent({
            delay: 30 * 1000,
            callback: () => this.renderAllPlants(),
            loop: true
        });

        // Auto-save every 5 minutes
        this.time.addEvent({
            delay: 5 * 60 * 1000,
            callback: () => this.savePlayerStats(),
            loop: true
        });
    }

    onTileClick(x, y) {
        this.selectTile(x, y);
        
        // Check if there's a plant here
        const plantsHere = this.plantManager.getAllPlants().filter(
            plant => plant.x === x && plant.y === y
        );
        
        if (plantsHere.length > 0) {
            const plant = plantsHere[0];
            if (plant.isReady) {
                this.harvestPlant(plant.id);
            } else {
                this.waterPlant(plant.id);
            }
        }
    }

    onTileHover(x, y) {
        // Show plant info tooltip
        const plantsHere = this.plantManager.getAllPlants().filter(
            plant => plant.x === x && plant.y === y
        );
        
        if (plantsHere.length > 0) {
            this.showPlantTooltip(plantsHere[0], x, y);
        }
    }

    selectTile(x, y) {
        // Remove previous selection
        if (this.selectedTile && this.selectedTile.sprite) {
            this.selectedTile.sprite.destroy();
        }
        
        // Add new selection
        this.selectedTile = {
            x: x,
            y: y,
            sprite: this.add.sprite(
                x * this.gridSize + this.gridSize / 2,
                y * this.gridSize + this.gridSize / 2,
                'selection'
            )
        };
        
        this.updateInfoPanel(x, y);
    }

    updateInfoPanel(x, y) {
        const plantsHere = this.plantManager.getAllPlants().filter(
            plant => plant.x === x && plant.y === y
        );
        
        let text = `Tile: (${x}, ${y})\n\n`;
        
        if (plantsHere.length > 0) {
            const plant = plantsHere[0];
            text += `Plant: ${plant.typeName}\n`;
            text += `Stage: ${plant.stage}/5 ${plant.emoji}\n`;
            text += `Status: ${plant.status}\n`;
            text += `Watered Today: ${plant.wateredToday ? 'Yes' : 'No'}\n\n`;
            
            if (plant.nextGrowthIn && plant.nextGrowthIn > 0) {
                const minutes = Math.ceil(plant.nextGrowthIn / 60000);
                text += `Next growth: ${minutes}m\n`;
            }
            
            text += `Care History:\n`;
            plant.checklist.slice(-3).forEach(entry => {
                const date = new Date(entry.date).toLocaleDateString();
                text += `${date}: ${entry.watered ? '💧' : '❌'} ${entry.weather}\n`;
            });
            
            text += `\nControls:\n`;
            text += `Space: Water\n`;
            text += `H: Harvest\n`;
            text += `Right-click: Menu`;
        } else {
            text += 'Empty tile\n\n';
            text += 'Click "Plant Seed"\nto start growing!';
        }
        
        this.infoPanelText.setText(text);
    }

    plantSeed(x, y) {
        // Check if tile is already occupied
        const plantsHere = this.plantManager.getAllPlants().filter(
            plant => plant.x === x && plant.y === y
        );
        
        if (plantsHere.length > 0) {
            this.showMessage('Tile already has a plant!');
            return;
        }
        
        // Plant the seed
        const plant = this.plantManager.createPlant(x, y, 'apple');
        this.showMessage('Seed planted! 🌱');
        
        // Update display
        this.renderPlant(plant);
        this.updateInfoPanel(x, y);
    }

    waterPlant(plantId) {
        const result = this.plantManager.waterPlant(plantId);
        this.showMessage(result.reason);
        
        if (result.success) {
            this.renderAllPlants();
            if (this.selectedTile) {
                this.updateInfoPanel(this.selectedTile.x, this.selectedTile.y);
            }
        }
    }

    waterSelectedPlant() {
        if (!this.selectedTile) return;
        
        const plantsHere = this.plantManager.getAllPlants().filter(
            plant => plant.x === this.selectedTile.x && plant.y === this.selectedTile.y
        );
        
        if (plantsHere.length > 0) {
            this.waterPlant(plantsHere[0].id);
        }
    }

    harvestPlant(plantId) {
        const result = this.plantManager.harvestPlant(plantId);
        if (result) {
            this.addRewards(result.rewards);
            this.showMessage(`Harvested! Grade: ${result.grade} - Got ${result.rewards.fruits} fruits, ${result.rewards.coins} coins, ${result.rewards.xp} XP`);
            this.renderAllPlants();
            
            if (this.selectedTile) {
                this.updateInfoPanel(this.selectedTile.x, this.selectedTile.y);
            }
        }
    }

    harvestSelectedPlant() {
        if (!this.selectedTile) return;
        
        const plantsHere = this.plantManager.getAllPlants().filter(
            plant => plant.x === this.selectedTile.x && plant.y === this.selectedTile.y
        );
        
        if (plantsHere.length > 0 && plantsHere[0].isReady) {
            this.harvestPlant(plantsHere[0].id);
        }
    }

    renderAllPlants() {
        // Clear existing plant sprites
        this.plantSprites.forEach(sprite => sprite.destroy());
        this.plantSprites.clear();
        
        // Render all plants
        const plants = this.plantManager.getAllPlants();
        plants.forEach(plant => this.renderPlant(plant));
    }

    renderPlant(plant) {
        const sprite = this.add.sprite(
            plant.x * this.gridSize + this.gridSize / 2,
            plant.y * this.gridSize + this.gridSize / 2,
            `plant_stage_${plant.stage}`
        );
        
        // Add glow effect for ready plants
        if (plant.isReady) {
            sprite.setTint(0xFFFFAA);
            
            // Add pulsing effect
            this.tweens.add({
                targets: sprite,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
        }
        
        // Add water indicator
        if (plant.wateredToday) {
            const droplet = this.add.text(
                plant.x * this.gridSize + this.gridSize - 10,
                plant.y * this.gridSize + 5,
                '💧',
                { fontSize: '12px' }
            );
            this.plantSprites.set(`${plant.id}_droplet`, droplet);
        }
        
        this.plantSprites.set(plant.id, sprite);
    }

    addRewards(rewards) {
        this.playerStats.coins += rewards.coins;
        this.playerStats.xp += rewards.xp;
        this.playerStats.fruits += rewards.fruits;
        
        this.updateStatsDisplay();
        this.savePlayerStats();
    }

    updateStatsDisplay() {
        document.getElementById('coins').textContent = this.playerStats.coins;
        document.getElementById('xp').textContent = this.playerStats.xp;
    }

    showMessage(message) {
        console.log(message);
        
        // Create floating message
        const messageText = this.add.text(
            this.cameras.main.centerX,
            50,
            message,
            {
                fontSize: '14px',
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 10, y: 5 }
            }
        ).setOrigin(0.5);
        
        // Animate and destroy
        this.tweens.add({
            targets: messageText,
            y: 20,
            alpha: 0,
            duration: 2000,
            onComplete: () => messageText.destroy()
        });
    }

    showPlantTooltip(plant, x, y) {
        // Simple tooltip - in a real game you might want a more sophisticated system
        const tooltip = document.createElement('div');
        tooltip.className = 'plant-info';
        tooltip.innerHTML = `
            <strong>${plant.typeName}</strong><br>
            Stage: ${plant.stage}/5 ${plant.emoji}<br>
            Status: ${plant.status}<br>
            Watered: ${plant.wateredToday ? 'Yes' : 'No'}
        `;
        
        tooltip.style.left = (x * this.gridSize) + 'px';
        tooltip.style.top = (y * this.gridSize - 60) + 'px';
        
        document.body.appendChild(tooltip);
        
        setTimeout(() => {
            if (document.body.contains(tooltip)) {
                document.body.removeChild(tooltip);
            }
        }, 2000);
    }

    savePlayerStats() {
        localStorage.setItem('growtopia_stats', JSON.stringify(this.playerStats));
    }

    loadPlayerStats() {
        try {
            const saved = localStorage.getItem('growtopia_stats');
            if (saved) {
                this.playerStats = { ...this.playerStats, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.error('Failed to load player stats:', error);
        }
    }
}

// Game Configuration
const gameConfig = {
    type: Phaser.AUTO,
    width: 8 * 64 + 220, // Grid width + UI panel
    height: 6 * 64,      // Grid height
    parent: 'game',
    backgroundColor: '#34495e',
    scene: GrowtopiaGame,
    pixelArt: true
};

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Phaser.Game(gameConfig);
}); 