// Farm Plot Renderer - Handles visual representation of farm plots
class FarmPlotRenderer {
    constructor(scene) {
        this.scene = scene;
        this.plotGraphics = [];
        this.cropSprites = [];
        this.overlayGraphics = [];
        this.waterIndicators = [];
        this.selectedPlot = null;
        
        this.createPlotVisuals();
    }
    
    createPlotVisuals() {
        // Create background grid
        for (let i = 0; i < window.gameState.farm.maxPlots; i++) {
            const plot = window.gameState.getPlot(i);
            
            // Plot background
            const plotGraphic = this.scene.add.graphics();
            this.plotGraphics.push(plotGraphic);
            
            // Crop sprite container
            const cropContainer = this.scene.add.container(plot.x, plot.y);
            this.cropSprites.push(cropContainer);
            
            // Overlay for effects (water level, fertilizer, etc.)
            const overlay = this.scene.add.graphics();
            this.overlayGraphics.push(overlay);
            
            // Water level indicator
            const waterBar = this.scene.add.graphics();
            this.waterIndicators.push(waterBar);
            
            // Make plots interactive
            const hitArea = this.scene.add.rectangle(
                plot.x + GameConfig.plotSize / 2,
                plot.y + GameConfig.plotSize / 2,
                GameConfig.plotSize,
                GameConfig.plotSize,
                0x000000,
                0 // Transparent
            );
            
            hitArea.setInteractive();
            hitArea.plotIndex = i;
            
            // Click handlers
            hitArea.on('pointerdown', (pointer) => {
                if (pointer.rightButtonDown()) {
                    this.handleRightClick(i);
                } else {
                    this.handleLeftClick(i);
                }
            });
            
            hitArea.on('pointerover', () => {
                this.highlightPlot(i);
            });
            
            hitArea.on('pointerout', () => {
                this.unhighlightPlot(i);
            });
        }
        
        this.updateAllPlots();
    }
    
    handleLeftClick(plotIndex) {
        const plot = window.gameState.getPlot(plotIndex);
        if (!plot || !plot.isUnlocked) return;
        
        // Select plot
        this.selectedPlot = plotIndex;
        
        // Plant crop if empty and have seeds
        if (!plot.crop) {
            const success = window.gameState.plantCrop(plotIndex, window.gameState.selectedCropType);
            if (success) {
                this.updatePlot(plotIndex);
                window.uiManager?.updateUI();
                
                // Add planting sound/effect
                this.createPlantingEffect(plot);
            }
        } else {
            // Water the plant
            window.gameState.waterPlot(plotIndex);
            this.updatePlot(plotIndex);
            this.createWateringEffect(plot);
        }
    }
    
    handleRightClick(plotIndex) {
        const plot = window.gameState.getPlot(plotIndex);
        if (!plot || !plot.isUnlocked || !plot.crop) return;
        
        // Try to harvest
        if (plot.crop.stage === GameConfig.cropStages.READY) {
            const result = window.gameState.harvestCrop(plotIndex);
            if (result) {
                this.updatePlot(plotIndex);
                window.uiManager?.updateUI();
                
                // Create harvest effects
                this.createHarvestEffect(plot, result.yield);
                window.cropSystem.createHarvestParticle(plot, result.yield);
                
                // Gain experience
                window.gameState.gainExperience(5);
            }
        }
    }
    
    updateAllPlots() {
        for (let i = 0; i < window.gameState.farm.maxPlots; i++) {
            this.updatePlot(i);
        }
    }
    
    updatePlot(plotIndex) {
        const plot = window.gameState.getPlot(plotIndex);
        const plotGraphic = this.plotGraphics[plotIndex];
        const cropContainer = this.cropSprites[plotIndex];
        const overlay = this.overlayGraphics[plotIndex];
        const waterBar = this.waterIndicators[plotIndex];
        
        if (!plot || !plotGraphic || !cropContainer) return;
        
        // Clear previous graphics
        plotGraphic.clear();
        overlay.clear();
        waterBar.clear();
        cropContainer.removeAll(true);
        
        // Draw plot background
        this.drawPlotBackground(plotGraphic, plot);
        
        // Draw crop if present
        if (plot.crop) {
            this.drawCrop(cropContainer, plot);
        }
        
        // Draw overlays (water, fertilizer, etc.)
        this.drawOverlays(overlay, plot);
        
        // Draw water indicator
        this.drawWaterIndicator(waterBar, plot);
        
        // Selection highlight
        if (this.selectedPlot === plotIndex) {
            this.drawSelectionHighlight(plotGraphic, plot);
        }
    }
    
    drawPlotBackground(graphic, plot) {
        let backgroundColor = GameConfig.colors.soil;
        
        if (!plot.isUnlocked) {
            backgroundColor = 0x444444; // Locked color
        } else if (plot.fertilized) {
            backgroundColor = GameConfig.colors.fertilized;
        }
        
        // Draw main plot
        graphic.fillStyle(backgroundColor);
        graphic.fillRect(plot.x, plot.y, GameConfig.plotSize, GameConfig.plotSize);
        
        // Draw border
        graphic.lineStyle(2, 0x654321, 0.8);
        graphic.strokeRect(plot.x, plot.y, GameConfig.plotSize, GameConfig.plotSize);
        
        // Draw grid lines for visual appeal
        graphic.lineStyle(1, 0x8B4513, 0.3);
        for (let i = 1; i < 4; i++) {
            const offset = (GameConfig.plotSize / 4) * i;
            graphic.moveTo(plot.x + offset, plot.y);
            graphic.lineTo(plot.x + offset, plot.y + GameConfig.plotSize);
            graphic.moveTo(plot.x, plot.y + offset);
            graphic.lineTo(plot.x + GameConfig.plotSize, plot.y + offset);
        }
        graphic.strokePath();
        
        // Sprinkler indicator
        if (plot.hasSprinkler) {
            graphic.fillStyle(0x4169E1);
            graphic.fillCircle(plot.x + GameConfig.plotSize - 8, plot.y + 8, 4);
        }
    }
    
    drawCrop(container, plot) {
        const visual = window.cropSystem.getCropVisual(plot.crop);
        if (!visual) return;
        
        // Create crop sprite/graphic
        const cropSize = GameConfig.plotSize * visual.size * 0.6;
        const centerX = GameConfig.plotSize / 2;
        const centerY = GameConfig.plotSize / 2;
        
        // Health-based color tinting
        const healthColor = window.cropSystem.getHealthColor(plot.crop.health);
        
        // Create crop visual
        const cropGraphic = this.scene.add.graphics();
        cropGraphic.fillStyle(visual.color);
        
        // Different shapes for different stages
        switch (plot.crop.stage) {
            case GameConfig.cropStages.SEED:
                cropGraphic.fillCircle(centerX, centerY + 8, cropSize * 0.3);
                break;
            case GameConfig.cropStages.SPROUT:
                cropGraphic.fillCircle(centerX, centerY + 4, cropSize * 0.4);
                cropGraphic.fillRect(centerX - 2, centerY - 8, 4, 12);
                break;
            case GameConfig.cropStages.GROWING:
                cropGraphic.fillEllipse(centerX, centerY, cropSize * 0.6, cropSize * 0.8);
                break;
            case GameConfig.cropStages.MATURE:
                cropGraphic.fillEllipse(centerX, centerY, cropSize * 0.8, cropSize);
                break;
            case GameConfig.cropStages.READY:
                // Special ready glow effect
                cropGraphic.fillStyle(0xFFD700, 0.3);
                cropGraphic.fillCircle(centerX, centerY, cropSize * 0.7);
                cropGraphic.fillStyle(visual.color);
                cropGraphic.fillEllipse(centerX, centerY, cropSize, cropSize * 1.1);
                break;
        }
        
        // Add health tinting
        cropGraphic.setTint(healthColor);
        
        // Growth animation - slight bob for growing plants
        if (plot.crop.stage > GameConfig.cropStages.SEED) {
            const bobOffset = Math.sin(this.scene.time.now * 0.001) * 2;
            cropGraphic.y += bobOffset;
        }
        
        container.add(cropGraphic);
        
        // Add growth progress indicator for growing crops
        if (plot.crop.stage < GameConfig.cropStages.READY) {
            this.drawGrowthProgress(container, plot);
        }
    }
    
    drawGrowthProgress(container, plot) {
        const progress = window.cropSystem.getGrowthProgress(plot.crop);
        const barWidth = 40;
        const barHeight = 4;
        const x = (GameConfig.plotSize - barWidth) / 2;
        const y = GameConfig.plotSize - 12;
        
        // Background
        const bgBar = this.scene.add.graphics();
        bgBar.fillStyle(0x000000, 0.5);
        bgBar.fillRect(x, y, barWidth, barHeight);
        container.add(bgBar);
        
        // Progress
        const progBar = this.scene.add.graphics();
        progBar.fillStyle(0x00FF00);
        progBar.fillRect(x, y, barWidth * progress, barHeight);
        container.add(progBar);
    }
    
    drawOverlays(graphic, plot) {
        // Water level visualization
        if (plot.waterLevel < 0.3) {
            // Dry soil effect
            graphic.fillStyle(0xD2691E, 0.3);
            graphic.fillRect(plot.x, plot.y, GameConfig.plotSize, GameConfig.plotSize);
        } else if (plot.waterLevel > 0.8) {
            // Wet soil effect
            graphic.fillStyle(0x4169E1, 0.2);
            graphic.fillRect(plot.x, plot.y, GameConfig.plotSize, GameConfig.plotSize);
        }
        
        // Fertilizer glow
        if (plot.fertilized) {
            graphic.lineStyle(3, 0x32CD32, 0.6);
            graphic.strokeRect(plot.x + 2, plot.y + 2, GameConfig.plotSize - 4, GameConfig.plotSize - 4);
        }
    }
    
    drawWaterIndicator(graphic, plot) {
        if (!plot.isUnlocked) return;
        
        const barWidth = 6;
        const barHeight = 30;
        const x = plot.x + GameConfig.plotSize - barWidth - 2;
        const y = plot.y + 2;
        
        // Background
        graphic.fillStyle(0x000000, 0.3);
        graphic.fillRect(x, y, barWidth, barHeight);
        
        // Water level
        const waterHeight = barHeight * plot.waterLevel;
        let waterColor = 0x4169E1;
        
        if (plot.waterLevel < 0.3) {
            waterColor = 0xFF4500; // Red for low water
        } else if (plot.waterLevel > 0.8) {
            waterColor = 0x00BFFF; // Light blue for high water
        }
        
        graphic.fillStyle(waterColor);
        graphic.fillRect(x, y + barHeight - waterHeight, barWidth, waterHeight);
    }
    
    drawSelectionHighlight(graphic, plot) {
        graphic.lineStyle(3, GameConfig.colors.selected, 1);
        graphic.strokeRect(plot.x - 2, plot.y - 2, GameConfig.plotSize + 4, GameConfig.plotSize + 4);
    }
    
    highlightPlot(plotIndex) {
        // Add subtle highlight on hover
        const overlay = this.overlayGraphics[plotIndex];
        overlay.clear();
        
        const plot = window.gameState.getPlot(plotIndex);
        if (plot) {
            overlay.fillStyle(0xFFFFFF, 0.1);
            overlay.fillRect(plot.x, plot.y, GameConfig.plotSize, GameConfig.plotSize);
            this.drawOverlays(overlay, plot);
        }
    }
    
    unhighlightPlot(plotIndex) {
        const overlay = this.overlayGraphics[plotIndex];
        overlay.clear();
        
        const plot = window.gameState.getPlot(plotIndex);
        if (plot) {
            this.drawOverlays(overlay, plot);
        }
    }
    
    // Visual effects
    createPlantingEffect(plot) {
        // Small dirt particles
        for (let i = 0; i < 5; i++) {
            const particle = this.scene.add.graphics();
            particle.fillStyle(0x8B4513);
            particle.fillCircle(0, 0, 2);
            
            particle.x = plot.x + GameConfig.plotSize / 2 + (Math.random() - 0.5) * 20;
            particle.y = plot.y + GameConfig.plotSize / 2 + (Math.random() - 0.5) * 20;
            
            this.scene.tweens.add({
                targets: particle,
                y: particle.y - 20,
                alpha: 0,
                duration: 800,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }
    
    createWateringEffect(plot) {
        // Water droplets
        for (let i = 0; i < 8; i++) {
            const droplet = this.scene.add.graphics();
            droplet.fillStyle(0x4169E1);
            droplet.fillCircle(0, 0, 1.5);
            
            droplet.x = plot.x + GameConfig.plotSize / 2 + (Math.random() - 0.5) * 30;
            droplet.y = plot.y + GameConfig.plotSize / 2 - 10;
            
            this.scene.tweens.add({
                targets: droplet,
                y: droplet.y + 25,
                alpha: 0,
                duration: 600,
                ease: 'Power2',
                onComplete: () => droplet.destroy()
            });
        }
    }
    
    createHarvestEffect(plot, yield) {
        // Sparkle effects
        for (let i = 0; i < yield + 3; i++) {
            const sparkle = this.scene.add.graphics();
            sparkle.fillStyle(0xFFD700);
            sparkle.fillStar(0, 0, 4, 3, 6);
            
            sparkle.x = plot.x + GameConfig.plotSize / 2 + (Math.random() - 0.5) * 40;
            sparkle.y = plot.y + GameConfig.plotSize / 2 + (Math.random() - 0.5) * 20;
            
            this.scene.tweens.add({
                targets: sparkle,
                y: sparkle.y - 30,
                alpha: 0,
                scaleX: 0,
                scaleY: 0,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => sparkle.destroy()
            });
        }
    }
    
    // Update method called each frame
    update() {
        // Update any animations or time-based effects
        this.updatePlotAnimations();
    }
    
    updatePlotAnimations() {
        // Update any ongoing animations
        for (let i = 0; i < this.cropSprites.length; i++) {
            const plot = window.gameState.getPlot(i);
            if (plot && plot.crop && plot.crop.stage > GameConfig.cropStages.SEED) {
                // Gentle swaying animation for crops
                const container = this.cropSprites[i];
                if (container.list.length > 0) {
                    const sway = Math.sin(this.scene.time.now * 0.002 + i) * 0.5;
                    container.rotation = sway * 0.02;
                }
            }
        }
    }
    
    // Cleanup
    destroy() {
        this.plotGraphics.forEach(graphic => graphic.destroy());
        this.cropSprites.forEach(sprite => sprite.destroy());
        this.overlayGraphics.forEach(overlay => overlay.destroy());
        this.waterIndicators.forEach(indicator => indicator.destroy());
    }
}

// Export for use in game scene
window.FarmPlotRenderer = FarmPlotRenderer;