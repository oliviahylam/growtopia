// Tutorial System - Guides new players through core gameplay
class TutorialSystem {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.isCompleted = false;
        this.steps = GameConfig.tutorial.steps;
        this.overlay = null;
        this.highlightedElement = null;
        
        this.checkFirstTime();
    }
    
    checkFirstTime() {
        const tutorialCompleted = localStorage.getItem('growtopia_tutorial_completed');
        if (!tutorialCompleted) {
            this.startTutorial();
        } else {
            this.isCompleted = true;
        }
    }
    
    startTutorial() {
        this.isActive = true;
        this.currentStep = 0;
        this.createTutorialOverlay();
        this.showCurrentStep();
        
        // Give player starting resources for tutorial (demo specific)
        window.gameState.resources.leafCoins = 10;  // Demo requirement: 10 Leaf Coins
        window.gameState.resources.seeds = 1;       // Demo requirement: 1 Apple Seed
    }
    
    createTutorialOverlay() {
        // Create semi-transparent overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'tutorial-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Press Start 2P', cursive;
        `;
        
        // Create tutorial dialog
        this.dialogBox = document.createElement('div');
        this.dialogBox.style.cssText = `
            background: linear-gradient(145deg, #2c3e50, #34495e);
            border: 3px solid #f39c12;
            border-radius: 12px;
            padding: 25px;
            max-width: 400px;
            color: #ecf0f1;
            text-align: center;
            box-shadow: 0 0 30px rgba(243, 156, 18, 0.5);
            position: relative;
        `;
        
        this.overlay.appendChild(this.dialogBox);
        document.body.appendChild(this.overlay);
    }
    
    showCurrentStep() {
        if (!this.isActive || this.currentStep >= this.steps.length) {
            this.completeTutorial();
            return;
        }
        
        const step = this.steps[this.currentStep];
        this.updateDialogContent(step);
        this.highlightElement(step.highlight);
    }
    
    updateDialogContent(step) {
        this.dialogBox.innerHTML = `
            <div style="margin-bottom: 15px;">
                <h3 style="color: #f39c12; margin: 0 0 15px 0; font-size: 12px;">
                    ${step.title}
                </h3>
                <p style="margin: 0 0 20px 0; line-height: 1.4; font-size: 10px;">
                    ${step.text}
                </p>
            </div>
            <div>
                ${this.createActionButton(step)}
            </div>
            <div style="margin-top: 15px; font-size: 8px; color: #bdc3c7;">
                Step ${this.currentStep + 1} of ${this.steps.length}
            </div>
        `;
        
        this.setupButtonEvents(step);
    }
    
    createActionButton(step) {
        switch (step.action) {
            case 'continue':
                return `<button id="tutorial-continue" class="tutorial-button">Continue</button>`;
            case 'plant_seed':
                return `<button id="tutorial-plant" class="tutorial-button">Got it!</button>`;
            case 'water_plant':
                return `<button id="tutorial-water" class="tutorial-button">Understood</button>`;
            case 'wait':
                return `<button id="tutorial-wait" class="tutorial-button">Continue Watching</button>`;
            case 'harvest':
                return `<button id="tutorial-harvest" class="tutorial-button">Ready to Harvest!</button>`;
            case 'open_shop':
                return `<button id="tutorial-shop" class="tutorial-button">Visit Shop</button>`;
            default:
                return `<button id="tutorial-next" class="tutorial-button">Next</button>`;
        }
    }
    
    setupButtonEvents(step) {
        // Add CSS for tutorial buttons
        const style = document.createElement('style');
        style.textContent = `
            .tutorial-button {
                background: linear-gradient(145deg, #27ae60, #2ecc71);
                border: 2px solid #2ecc71;
                color: white;
                padding: 10px 20px;
                font-family: 'Press Start 2P', cursive;
                font-size: 10px;
                cursor: pointer;
                border-radius: 6px;
                transition: all 0.3s ease;
            }
            .tutorial-button:hover {
                background: linear-gradient(145deg, #2ecc71, #27ae60);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }
        `;
        document.head.appendChild(style);
        
        // Add event listeners
        const button = this.dialogBox.querySelector('.tutorial-button');
        if (button) {
            button.addEventListener('click', () => this.handleStepAction(step));
        }
    }
    
    handleStepAction(step) {
        switch (step.action) {
            case 'continue':
            case 'wait':
                this.nextStep();
                break;
            case 'plant_seed':
                this.hideDialog();
                this.waitForAction('plant');
                break;
            case 'water_plant':
                this.hideDialog();
                this.waitForAction('water');
                break;
            case 'harvest':
                this.hideDialog();
                this.waitForAction('harvest');
                break;
            case 'open_shop':
                this.hideDialog();
                this.waitForAction('shop');
                break;
            default:
                this.nextStep();
        }
    }
    
    hideDialog() {
        if (this.dialogBox) {
            this.dialogBox.style.display = 'none';
        }
    }
    
    showDialog() {
        if (this.dialogBox) {
            this.dialogBox.style.display = 'block';
        }
    }
    
    waitForAction(actionType) {
        // Set up listeners for specific game actions
        this.waitingForAction = actionType;
        
        // Show instruction overlay
        this.showActionHint(actionType);
    }
    
    showActionHint(actionType) {
        const hints = {
            plant: 'Click on the highlighted plot to plant your seed',
            water: 'Click on your planted seed to water it',
            harvest: 'Click on your fruiting tree to harvest',
            shop: 'Click the Shop button to open the store'
        };
        
        this.createActionHint(hints[actionType] || 'Complete the action to continue');
    }
    
    createActionHint(text) {
        this.actionHint = document.createElement('div');
        this.actionHint.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(52, 73, 94, 0.95);
            color: #f39c12;
            padding: 15px 25px;
            border-radius: 8px;
            font-family: 'Press Start 2P', cursive;
            font-size: 10px;
            z-index: 10000;
            border: 2px solid #f39c12;
            animation: pulse 2s infinite;
        `;
        this.actionHint.textContent = text;
        
        // Add pulsing animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: translateX(-50%) scale(1); }
                50% { transform: translateX(-50%) scale(1.05); }
                100% { transform: translateX(-50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(this.actionHint);
    }
    
    highlightElement(elementType) {
        this.clearHighlight();
        
        if (!elementType) return;
        
        // Create highlight overlay for specific elements
        switch (elementType) {
            case 'plot':
                this.highlightFirstEmptyPlot();
                break;
            case 'plant':
                this.highlightFirstPlant();
                break;
            case 'conditions':
                this.highlightConditionsPanel();
                break;
            case 'shop_button':
                this.highlightShopButton();
                break;
        }
    }
    
    highlightFirstEmptyPlot() {
        // Find first empty plot and highlight it
        const plot = window.gameState.getPlot(0); // Use first plot for tutorial
        if (plot) {
            this.createHighlightBox(plot.x, plot.y, GameConfig.plotSize, GameConfig.plotSize);
        }
    }
    
    highlightFirstPlant() {
        const plot = window.gameState.getPlot(0);
        if (plot && plot.plant) {
            this.createHighlightBox(plot.x, plot.y, GameConfig.plotSize, GameConfig.plotSize);
        }
    }
    
    highlightConditionsPanel() {
        const panel = document.getElementById('weather-panel');
        if (panel) {
            const rect = panel.getBoundingClientRect();
            this.createHighlightBox(rect.left, rect.top, rect.width, rect.height, true);
        }
    }
    
    highlightShopButton() {
        // Highlight shop area
        const shopPanel = document.getElementById('shop-panel');
        if (shopPanel) {
            const rect = shopPanel.getBoundingClientRect();
            this.createHighlightBox(rect.left, rect.top, rect.width, rect.height, true);
        }
    }
    
    createHighlightBox(x, y, width, height, isUI = false) {
        this.highlightedElement = document.createElement('div');
        this.highlightedElement.style.cssText = `
            position: ${isUI ? 'fixed' : 'absolute'};
            left: ${x}px;
            top: ${y}px;
            width: ${width}px;
            height: ${height}px;
            border: 3px solid #f39c12;
            border-radius: 8px;
            background: rgba(243, 156, 18, 0.2);
            z-index: 9998;
            pointer-events: none;
            animation: highlight-pulse 1.5s ease-in-out infinite;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes highlight-pulse {
                0%, 100% { 
                    border-color: #f39c12; 
                    background: rgba(243, 156, 18, 0.2);
                }
                50% { 
                    border-color: #e67e22; 
                    background: rgba(243, 156, 18, 0.4);
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(this.highlightedElement);
    }
    
    clearHighlight() {
        if (this.highlightedElement) {
            this.highlightedElement.remove();
            this.highlightedElement = null;
        }
    }
    
    clearActionHint() {
        if (this.actionHint) {
            this.actionHint.remove();
            this.actionHint = null;
        }
    }
    
    // Called by game systems when actions are performed
    onActionPerformed(actionType) {
        if (!this.isActive || this.waitingForAction !== actionType) return;
        
        this.clearActionHint();
        this.waitingForAction = null;
        this.showDialog();
        
        // Small delay before moving to next step
        setTimeout(() => {
            this.nextStep();
        }, 1000);
    }
    
    nextStep() {
        this.currentStep++;
        this.clearHighlight();
        
        if (this.currentStep >= this.steps.length) {
            this.completeTutorial();
        } else {
            this.showCurrentStep();
        }
    }
    
    completeTutorial() {
        this.isActive = false;
        this.isCompleted = true;
        this.clearHighlight();
        this.clearActionHint();
        
        // Save completion status
        localStorage.setItem('growtopia_tutorial_completed', 'true');
        
        // Show completion message
        this.showCompletionMessage();
        
        // Clean up overlay
        setTimeout(() => {
            if (this.overlay) {
                this.overlay.remove();
                this.overlay = null;
            }
        }, 3000);
    }
    
    showCompletionMessage() {
        this.dialogBox.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #2ecc71; margin: 0 0 15px 0; font-size: 14px;">
                    🌳 Tutorial Complete! 🌳
                </h3>
                <p style="margin: 0 0 20px 0; line-height: 1.4; font-size: 10px;">
                    You've mastered the basics of Growtopia!<br/>
                    Keep growing your garden and discover new plants, tools, and helpers.
                </p>
                <div style="font-size: 8px; color: #bdc3c7; margin-top: 15px;">
                    Happy gardening! 🌱
                </div>
            </div>
        `;
    }
    
    // Method to restart tutorial (for testing)
    resetTutorial() {
        localStorage.removeItem('growtopia_tutorial_completed');
        this.currentStep = 0;
        this.isCompleted = false;
        this.startTutorial();
    }
    
    // Skip tutorial (for returning players)
    skipTutorial() {
        this.completeTutorial();
    }
}

// Global tutorial system instance
window.tutorialSystem = new TutorialSystem();