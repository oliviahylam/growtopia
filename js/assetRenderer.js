// Asset Renderer - Creates fake visual assets using CSS and canvas
class AssetRenderer {
    constructor() {
        this.assets = new Map();
        this.createAssets();
    }
    
    createAssets() {
        // Plant stages
        this.createPlantAssets();
        
        // Tools and items
        this.createToolAssets();
        
        // Animals
        this.createAnimalAssets();
        
        // Environmental effects
        this.createEnvironmentalAssets();
        
        // UI elements
        this.createUIAssets();
    }
    
    createPlantAssets() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Apple Seed
        this.createAppleSeed(ctx, canvas);
        
        // Apple Sprout
        this.createAppleSprout(ctx, canvas);
        
        // Small Apple Tree
        this.createSmallAppleTree(ctx, canvas);
        
        // Big Apple Tree
        this.createBigAppleTree(ctx, canvas);
        
        // Fruiting Apple Tree
        this.createFruitingAppleTree(ctx, canvas);
        
        // Sick Plant
        this.createSickPlant(ctx, canvas);
        
        // Dead Plant
        this.createDeadPlant(ctx, canvas);
    }
    
    createAppleSeed(ctx, canvas) {
        ctx.clearRect(0, 0, 64, 64);
        
        // Draw soil mound
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(20, 45, 24, 15);
        
        // Draw small seed
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.ellipse(32, 50, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        this.assets.set('apple_seed', canvas.toDataURL());
    }
    
    createAppleSprout(ctx, canvas) {
        ctx.clearRect(0, 0, 64, 64);
        
        // Soil
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(18, 48, 28, 12);
        
        // Small green sprout
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(30, 35, 4, 15);
        
        // Two small leaves
        ctx.beginPath();
        ctx.ellipse(28, 38, 6, 4, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(36, 38, 6, 4, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        this.assets.set('apple_sprout', canvas.toDataURL());
    }
    
    createSmallAppleTree(ctx, canvas) {
        ctx.clearRect(0, 0, 64, 64);
        
        // Trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(28, 35, 8, 25);
        
        // Small crown
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(32, 30, 16, 0, Math.PI * 2);
        ctx.fill();
        
        // Highlight
        ctx.fillStyle = '#32CD32';
        ctx.beginPath();
        ctx.arc(28, 26, 6, 0, Math.PI * 2);
        ctx.fill();
        
        this.assets.set('apple_small_tree', canvas.toDataURL());
    }
    
    createBigAppleTree(ctx, canvas) {
        ctx.clearRect(0, 0, 64, 64);
        
        // Thicker trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(26, 30, 12, 30);
        
        // Larger crown
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(32, 25, 22, 0, Math.PI * 2);
        ctx.fill();
        
        // Multiple highlights
        ctx.fillStyle = '#32CD32';
        ctx.beginPath();
        ctx.arc(25, 20, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(39, 22, 6, 0, Math.PI * 2);
        ctx.fill();
        
        this.assets.set('apple_big_tree', canvas.toDataURL());
    }
    
    createFruitingAppleTree(ctx, canvas) {
        ctx.clearRect(0, 0, 64, 64);
        
        // Trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(26, 30, 12, 30);
        
        // Crown
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(32, 25, 22, 0, Math.PI * 2);
        ctx.fill();
        
        // Highlights
        ctx.fillStyle = '#32CD32';
        ctx.beginPath();
        ctx.arc(25, 20, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Red apples
        ctx.fillStyle = '#DC143C';
        const applePositions = [
            [22, 18], [28, 15], [35, 20], [40, 25], [25, 28], [38, 30]
        ];
        
        applePositions.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Apple highlight
            ctx.fillStyle = '#FF6347';
            ctx.beginPath();
            ctx.arc(x - 1, y - 1, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#DC143C';
        });
        
        // Glowing effect for ready harvest
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(32, 25, 24, 0, Math.PI * 2);
        ctx.stroke();
        
        this.assets.set('apple_fruiting_tree', canvas.toDataURL());
    }
    
    createSickPlant(ctx, canvas) {
        ctx.clearRect(0, 0, 64, 64);
        
        // Wilted trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(28, 35, 8, 25);
        
        // Yellowing crown
        ctx.fillStyle = '#DAA520';
        ctx.beginPath();
        ctx.arc(32, 30, 14, 0, Math.PI * 2);
        ctx.fill();
        
        // Brown spots
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(28, 28, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(36, 32, 2, 0, Math.PI * 2);
        ctx.fill();
        
        this.assets.set('apple_sick', canvas.toDataURL());
    }
    
    createDeadPlant(ctx, canvas) {
        ctx.clearRect(0, 0, 64, 64);
        
        // Dark trunk
        ctx.fillStyle = '#654321';
        ctx.fillRect(28, 40, 8, 20);
        
        // Withered branches
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(32, 40);
        ctx.lineTo(20, 30);
        ctx.moveTo(32, 40);
        ctx.lineTo(44, 30);
        ctx.moveTo(32, 35);
        ctx.lineTo(25, 25);
        ctx.stroke();
        
        this.assets.set('apple_dead', canvas.toDataURL());
    }
    
    createToolAssets() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Watering Can
        this.createWateringCan(ctx, canvas);
        
        // Sprinkler
        this.createSprinkler(ctx, canvas);
        
        // Greenhouse
        this.createGreenhouse(ctx, canvas);
        
        // Water Filter
        this.createWaterFilter(ctx, canvas);
    }
    
    createWateringCan(ctx, canvas) {
        ctx.clearRect(0, 0, 32, 32);
        
        // Can body
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(8, 12, 16, 12);
        
        // Handle
        ctx.strokeStyle = '#4169E1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(18, 18, 8, 0, Math.PI);
        ctx.stroke();
        
        // Spout
        ctx.fillRect(24, 14, 6, 3);
        
        // Water drops
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.arc(28, 10, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(30, 8, 1, 0, Math.PI * 2);
        ctx.fill();
        
        this.assets.set('watering_can', canvas.toDataURL());
    }
    
    createSprinkler(ctx, canvas) {
        ctx.clearRect(0, 0, 32, 32);
        
        // Base
        ctx.fillStyle = '#696969';
        ctx.fillRect(14, 20, 4, 8);
        
        // Sprinkler head
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(10, 16, 12, 6);
        
        // Water spray effect
        ctx.fillStyle = '#87CEEB';
        const sprayPattern = [
            [8, 12], [12, 10], [16, 8], [20, 10], [24, 12],
            [6, 16], [26, 16], [8, 20], [24, 20]
        ];
        
        sprayPattern.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
        });
        
        this.assets.set('sprinkler', canvas.toDataURL());
    }
    
    createGreenhouse(ctx, canvas) {
        ctx.clearRect(0, 0, 32, 32);
        
        // Greenhouse frame
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(4, 8, 24, 20);
        
        // Glass panels
        ctx.fillStyle = 'rgba(135, 206, 235, 0.3)';
        ctx.fillRect(6, 10, 20, 16);
        
        // Roof
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.moveTo(16, 4);
        ctx.lineTo(28, 12);
        ctx.lineTo(4, 12);
        ctx.closePath();
        ctx.fill();
        
        // Door
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(14, 18, 4, 10);
        
        this.assets.set('greenhouse', canvas.toDataURL());
    }
    
    createWaterFilter(ctx, canvas) {
        ctx.clearRect(0, 0, 32, 32);
        
        // Filter body
        ctx.fillStyle = '#696969';
        ctx.fillRect(10, 8, 12, 16);
        
        // Filter media
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(12, 10, 8, 6);
        
        // Clean water indicator
        ctx.fillStyle = '#00BFFF';
        ctx.fillRect(12, 18, 8, 4);
        
        // Pipes
        ctx.strokeStyle = '#696969';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(16, 8);
        ctx.lineTo(16, 4);
        ctx.moveTo(16, 24);
        ctx.lineTo(16, 28);
        ctx.stroke();
        
        this.assets.set('water_filter', canvas.toDataURL());
    }
    
    createAnimalAssets() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        this.createChicken(ctx, canvas);
    }
    
    createChicken(ctx, canvas) {
        ctx.clearRect(0, 0, 32, 32);
        
        // Chicken body
        ctx.fillStyle = '#FFFAF0';
        ctx.beginPath();
        ctx.ellipse(16, 18, 8, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.beginPath();
        ctx.arc(16, 10, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Beak
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.moveTo(18, 10);
        ctx.lineTo(22, 10);
        ctx.lineTo(20, 12);
        ctx.closePath();
        ctx.fill();
        
        // Eye
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(17, 8, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Comb
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(14, 4, 4, 4);
        
        // Legs
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(12, 24, 2, 4);
        ctx.fillRect(18, 24, 2, 4);
        
        // Wing
        ctx.fillStyle = '#F5DEB3';
        ctx.beginPath();
        ctx.ellipse(20, 16, 4, 3, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        this.assets.set('chicken_idle', canvas.toDataURL());
    }
    
    createEnvironmentalAssets() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Pollution haze
        this.createPollutionHaze(ctx, canvas);
        
        // Pest/bug
        this.createBug(ctx, canvas);
        
        // Water droplets
        this.createWaterDroplets(ctx, canvas);
        
        // Sun effect
        this.createSunEffect(ctx, canvas);
        
        // Rain overlay
        this.createRainOverlay(ctx, canvas);
        
        // Snow overlay
        this.createSnowOverlay(ctx, canvas);
    }
    
    createPollutionHaze(ctx, canvas) {
        ctx.clearRect(0, 0, 64, 64);
        
        // Create pollution gradient
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(105, 105, 105, 0.6)');
        gradient.addColorStop(1, 'rgba(105, 105, 105, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        this.assets.set('pollution_haze', canvas.toDataURL());
    }
    
    createBug(ctx, canvas) {
        ctx.clearRect(0, 0, 64, 64);
        
        // Bug body
        ctx.fillStyle = '#32CD32';
        ctx.beginPath();
        ctx.ellipse(32, 32, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Bug head
        ctx.beginPath();
        ctx.arc(32, 28, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Antennae
        ctx.strokeStyle = '#32CD32';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, 26);
        ctx.lineTo(28, 22);
        ctx.moveTo(34, 26);
        ctx.lineTo(36, 22);
        ctx.stroke();
        
        // Legs
        ctx.beginPath();
        ctx.moveTo(26, 30);
        ctx.lineTo(22, 28);
        ctx.moveTo(26, 34);
        ctx.lineTo(22, 36);
        ctx.moveTo(38, 30);
        ctx.lineTo(42, 28);
        ctx.moveTo(38, 34);
        ctx.lineTo(42, 36);
        ctx.stroke();
        
        this.assets.set('bug_sprite', canvas.toDataURL());
    }
    
    createWaterDroplets(ctx, canvas) {
        ctx.clearRect(0, 0, 64, 64);
        
        // Multiple water droplets
        ctx.fillStyle = '#4169E1';
        const droplets = [
            [15, 20], [35, 15], [25, 35], [45, 30], [20, 45], [40, 50]
        ];
        
        droplets.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Highlight
            ctx.fillStyle = '#87CEEB';
            ctx.beginPath();
            ctx.arc(x - 1, y - 1, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#4169E1';
        });
        
        this.assets.set('water_droplets', canvas.toDataURL());
    }
    
    createSunEffect(ctx, canvas) {
        ctx.clearRect(0, 0, 64, 64);
        
        // Sun rays
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        this.assets.set('sun_effect', canvas.toDataURL());
    }
    
    createRainOverlay(ctx, canvas) {
        ctx.clearRect(0, 0, 64, 64);
        
        // Rain lines
        ctx.strokeStyle = 'rgba(65, 105, 225, 0.6)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 64;
            const y = Math.random() * 64;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 2, y + 8);
            ctx.stroke();
        }
        
        this.assets.set('rain_overlay', canvas.toDataURL());
    }
    
    createSnowOverlay(ctx, canvas) {
        ctx.clearRect(0, 0, 64, 64);
        
        // Snowflakes
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * 64;
            const y = Math.random() * 64;
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 2 + 1, 0, Math.PI * 2);
            ctx.fill();
        }
        
        this.assets.set('snow_overlay', canvas.toDataURL());
    }
    
    createUIAssets() {
        // Create small icons for UI elements
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        
        // Leaf coin icon
        this.createLeafCoin(ctx, canvas);
        
        // Apple seed icon
        this.createAppleSeedIcon(ctx, canvas);
        
        // Experience star
        this.createExperienceStar(ctx, canvas);
    }
    
    createLeafCoin(ctx, canvas) {
        ctx.clearRect(0, 0, 16, 16);
        
        // Leaf shape
        ctx.fillStyle = '#32CD32';
        ctx.beginPath();
        ctx.ellipse(8, 8, 6, 4, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Leaf vein
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(8, 4);
        ctx.lineTo(8, 12);
        ctx.stroke();
        
        this.assets.set('leaf_coin_icon', canvas.toDataURL());
    }
    
    createAppleSeedIcon(ctx, canvas) {
        ctx.clearRect(0, 0, 16, 16);
        
        // Seed
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(8, 8, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Highlight
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.ellipse(7, 7, 2, 1, 0, 0, Math.PI * 2);
        ctx.fill();
        
        this.assets.set('apple_seed_icon', canvas.toDataURL());
    }
    
    createExperienceStar(ctx, canvas) {
        ctx.clearRect(0, 0, 16, 16);
        
        // Star
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        const points = 5;
        const outerRadius = 6;
        const innerRadius = 3;
        
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / points;
            const x = 8 + radius * Math.cos(angle - Math.PI / 2);
            const y = 8 + radius * Math.sin(angle - Math.PI / 2);
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        this.assets.set('experience_star', canvas.toDataURL());
    }
    
    // Get asset by name
    getAsset(name) {
        return this.assets.get(name);
    }
    
    // Create a DOM element with the asset
    createAssetElement(name, width = 32, height = 32) {
        const asset = this.getAsset(name);
        if (!asset) return null;
        
        const img = document.createElement('img');
        img.src = asset;
        img.style.width = width + 'px';
        img.style.height = height + 'px';
        img.style.imageRendering = 'pixelated';
        
        return img;
    }
    
    // Create CSS background style for asset
    createAssetBackground(name) {
        const asset = this.getAsset(name);
        if (!asset) return '';
        
        return `background-image: url('${asset}'); background-size: contain; background-repeat: no-repeat; background-position: center;`;
    }
}

// Global asset renderer instance
window.assetRenderer = new AssetRenderer();