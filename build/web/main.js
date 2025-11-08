/**
 * ========================================
 * Modern Flappy Bird - Professional Edition
 * Main JavaScript File
 * ========================================
 * Developer: Daffa Aditya Pratama
 * Designer: Samsul Bahrur
 * Version: 2.0
 * ========================================
 */

// ============================================
// CANVAS & CONTEXT SETUP
// ============================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ============================================
// COLOR SYSTEM
// ============================================
const COLORS = {
    PRIMARY: 'rgb(88, 101, 242)',           // Discord Blurple
    SECONDARY: 'rgb(71, 82, 196)',          // Darker Blurple
    ACCENT: 'rgb(235, 69, 158)',            // Hot Pink
    ACCENT_SECONDARY: 'rgb(87, 242, 135)',  // Neon Green
    BACKGROUND: 'rgb(35, 39, 42)',          // Dark Gray
    WHITE: 'rgb(255, 255, 255)',
    BLACK: 'rgb(0, 0, 0)',
    GOLD: 'rgb(255, 215, 0)',
    SILVER: 'rgb(192, 192, 192)'
};

// ============================================
// GAME CONSTANTS
// ============================================
const GRAVITY = 0.5;
const JUMP = -9;
const BIRD_SIZE = 30;

// ============================================
// GAME STATE
// ============================================
let gameState = 'MAIN_MENU'; // MAIN_MENU, PLAYING, GAME_OVER, SETTINGS, SHOP, CREDITS
let previousState = 'MAIN_MENU';

// ============================================
// PLAYER DATA
// ============================================
let player = {
    coins: 0,
    highScore: 0,
    birdSkin: 'default',
    obstacleSkin: 'default',
    unlockedBirds: ['default'],
    unlockedObstacles: ['default']
};

// ============================================
// SETTINGS
// ============================================
let settings = {
    difficulty: 'normal',
    musicVolume: 0.5,
    sfxVolume: 0.7,
    particles: true,
    screenShake: true,
    vsync: true,
    fullscreen: false
};

// ============================================
// GAME VARIABLES
// ============================================
let bird = { y: 360, velocity: 0, rotation: 0, wingPhase: 0 };
let pipes = [];
let particles = [];
let backgroundParticles = [];
let score = 0;
let combo = 0;
let maxCombo = 0;
let perfectPasses = 0;
let coinsEarned = 0;
let gameSpeed = 3;
let screenShakeAmount = 0;
let animationTime = 0;

// ============================================
// DIFFICULTY SETTINGS
// ============================================
const DIFFICULTY = {
    easy: { pipeGap: 220, speed: 2.5, speedIncrease: 0.05 },
    normal: { pipeGap: 180, speed: 3, speedIncrease: 0.08 },
    hardcore: { pipeGap: 140, speed: 4, speedIncrease: 0.12 }
};

// ============================================
// SHOP ITEMS
// ============================================
const SHOP_ITEMS = {
    birds: [
        { id: 'default', name: 'Default', price: 0, color: COLORS.GOLD },
        { id: 'golden', name: 'Golden', price: 100, color: COLORS.GOLD },
        { id: 'rainbow', name: 'Rainbow', price: 500, color: COLORS.ACCENT },
        { id: 'robot', name: 'Robot', price: 999, color: COLORS.SILVER }
    ],
    obstacles: [
        { id: 'default', name: 'Default', price: 0, color: COLORS.PRIMARY },
        { id: 'crystal', name: 'Crystal', price: 150, color: '#87CEEB' },
        { id: 'neon', name: 'Neon', price: 300, color: COLORS.ACCENT },
        { id: 'gold', name: 'Gold', price: 750, color: COLORS.GOLD }
    ]
};

// ============================================
// UI SYSTEM
// ============================================
let buttons = [];
let hoveredButton = null;
let mouseX = 0, mouseY = 0;

// ============================================
// AUDIO SYSTEM
// ============================================
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(type) {
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    const volume = settings.sfxVolume * 0.15;
    
    switch(type) {
        case 'click':
            osc.frequency.value = 600;
            gain.gain.setValueAtTime(volume, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
            break;
        case 'jump':
            osc.frequency.value = 800;
            gain.gain.setValueAtTime(volume, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
            break;
        case 'point':
            osc.frequency.value = 1000 + Math.random() * 200;
            gain.gain.setValueAtTime(volume, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
            break;
        case 'death':
            osc.frequency.value = 150;
            gain.gain.setValueAtTime(volume * 1.5, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
            break;
    }
}

// ============================================
// PARTICLE SYSTEM
// ============================================
class Particle {
    constructor(x, y, color, type = 'default') {
        this.x = x;
        this.y = y;
        this.color = color;
        this.type = type;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 1.0;
        this.decay = 0.02;
        this.size = Math.random() * 4 + 2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // gravity
        this.life -= this.decay;
        return this.life > 0;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createParticles(x, y, count, color) {
    if (!settings.particles) return;
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function createBackgroundParticles() {
    for (let i = 0; i < 50; i++) {
        backgroundParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.3 + 0.1
        });
    }
}

// ============================================
// BUTTON SYSTEM
// ============================================
class Button {
    constructor(x, y, width, height, text, action, style = {}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.action = action;
        this.hovered = false;
        this.style = {
            bgColor: style.bgColor || COLORS.PRIMARY,
            hoverColor: style.hoverColor || COLORS.SECONDARY,
            textColor: style.textColor || COLORS.WHITE,
            fontSize: style.fontSize || 20,
            ...style
        };
    }
    
    contains(x, y) {
        return x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }
    
    draw(ctx) {
        const color = this.hovered ? this.style.hoverColor : this.style.bgColor;
        const scale = this.hovered ? 1.05 : 1;
        
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(scale, scale);
        
        // Shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 5;
        
        // Button background
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 10);
        ctx.fill();
        
        // Button text
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = this.style.textColor;
        ctx.font = `bold ${this.style.fontSize}px 'Segoe UI'`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, 0, 0);
        
        ctx.restore();
    }
}

// ============================================
// DRAWING UTILITIES
// ============================================
function drawAnimatedTitle(text, y, size = 48) {
    ctx.save();
    const hue = (animationTime * 50) % 360;
    const gradient = ctx.createLinearGradient(0, y - size, 0, y + size);
    gradient.addColorStop(0, `hsl(${hue}, 80%, 60%)`);
    gradient.addColorStop(0.5, `hsl(${(hue + 60) % 360}, 80%, 60%)`);
    gradient.addColorStop(1, `hsl(${(hue + 120) % 360}, 80%, 60%)`);
    
    ctx.fillStyle = gradient;
    ctx.font = `bold ${size}px 'Segoe UI'`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Shadow effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    
    const wave = Math.sin(animationTime * 3) * 5;
    ctx.fillText(text, canvas.width / 2, y + wave);
    ctx.restore();
}

function drawGradientBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, COLORS.PRIMARY);
    gradient.addColorStop(0.5, COLORS.SECONDARY);
    gradient.addColorStop(1, COLORS.BACKGROUND);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Animated waves at bottom
    ctx.save();
    ctx.fillStyle = 'rgba(88, 101, 242, 0.3)';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let x = 0; x <= canvas.width; x += 10) {
        const y = canvas.height - 100 + Math.sin(x * 0.02 + animationTime * 2) * 20;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawBackgroundParticles() {
    if (!settings.particles) return;
    
    backgroundParticles.forEach(p => {
        p.y -= p.speed;
        if (p.y < -10) p.y = canvas.height + 10;
        
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = COLORS.WHITE;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

// ============================================
// MENU SCREENS
// ============================================
function drawMainMenu() {
    drawGradientBackground();
    drawBackgroundParticles();
    
    drawAnimatedTitle('Modern Flappy Bird', 120, 56);
    
    // Menu buttons
    buttons = [
        new Button(canvas.width / 2 - 100, 250, 200, 50, '▶ Play', () => startGame()),
        new Button(canvas.width / 2 - 100, 320, 200, 50, '⚙ Settings', () => { gameState = 'SETTINGS'; }),
        new Button(canvas.width / 2 - 100, 390, 200, 50, '🛒 Shop', () => { gameState = 'SHOP'; }),
        new Button(canvas.width / 2 - 100, 460, 200, 50, '🏆 Credits', () => { gameState = 'CREDITS'; })
    ];
    
    buttons.forEach(btn => {
        btn.hovered = btn.contains(mouseX, mouseY);
        btn.draw(ctx);
    });
    
    // Footer info
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '14px "Segoe UI"';
    ctx.textAlign = 'center';
    ctx.fillText('Developer: Daffa Aditya Pratama | Designer: Samsul Bahrur', canvas.width / 2, canvas.height - 30);
}

function drawSettings() {
    drawGradientBackground();
    drawBackgroundParticles();
    
    drawAnimatedTitle('Settings', 80, 48);
    
    const startY = 150;
    const spacing = 70;
    let currentY = startY;
    
    ctx.fillStyle = COLORS.WHITE;
    ctx.font = 'bold 20px "Segoe UI"';
    ctx.textAlign = 'left';
    
    buttons = [];
    
    // Difficulty
    ctx.fillText('🎮 Difficulty:', 100, currentY);
    const diffBtns = ['Easy', 'Normal', 'Hardcore'];
    diffBtns.forEach((diff, i) => {
        const isActive = settings.difficulty === diff.toLowerCase();
        const btn = new Button(
            400 + i * 130, currentY - 25, 110, 40,
            diff,
            () => { 
                settings.difficulty = diff.toLowerCase(); 
                createParticles(canvas.width / 2, currentY, 20, COLORS.ACCENT); 
                playSound('click');
            },
            { bgColor: isActive ? COLORS.ACCENT : COLORS.PRIMARY }
        );
        btn.hovered = btn.contains(mouseX, mouseY);
        btn.draw(ctx);
        buttons.push(btn);
    });
    
    currentY += spacing;
    
    // Audio Section
    ctx.fillText('🔊 Audio:', 100, currentY);
    ctx.font = '16px "Segoe UI"';
    ctx.fillText(`Music: ${Math.round(settings.musicVolume * 100)}%`, 400, currentY);
    ctx.fillText(`SFX: ${Math.round(settings.sfxVolume * 100)}%`, 700, currentY);
    
    currentY += spacing;
    
    // Graphics Section
    ctx.font = 'bold 20px "Segoe UI"';
    ctx.fillText('🎨 Graphics:', 100, currentY);
    
    const graphicsToggles = [
        { name: 'Particles', key: 'particles' },
        { name: 'Screen Shake', key: 'screenShake' },
        { name: 'VSync', key: 'vsync' }
    ];
    
    graphicsToggles.forEach((toggle, i) => {
        const isOn = settings[toggle.key];
        const btn = new Button(
            400 + i * 180, currentY - 25, 150, 40,
            `${toggle.name}: ${isOn ? 'ON' : 'OFF'}`,
            () => { 
                settings[toggle.key] = !settings[toggle.key]; 
                playSound('click'); 
            },
            { bgColor: isOn ? COLORS.ACCENT_SECONDARY : COLORS.SECONDARY, fontSize: 16 }
        );
        btn.hovered = btn.contains(mouseX, mouseY);
        btn.draw(ctx);
        buttons.push(btn);
    });
    
    // Back button
    const backBtn = new Button(canvas.width / 2 - 75, canvas.height - 100, 150, 50, '← Back', () => { gameState = 'MAIN_MENU'; playSound('click'); });
    backBtn.hovered = backBtn.contains(mouseX, mouseY);
    backBtn.draw(ctx);
    buttons.push(backBtn);
}

function drawShop() {
    drawGradientBackground();
    drawBackgroundParticles();
    
    drawAnimatedTitle('Shop', 80, 48);
    
    // Coin display
    ctx.fillStyle = COLORS.GOLD;
    ctx.font = 'bold 24px "Segoe UI"';
    ctx.textAlign = 'left';
    ctx.fillText(`💰 ${player.coins} Coins`, 50, 150);
    
    // Bird Skins
    ctx.fillStyle = COLORS.WHITE;
    ctx.font = 'bold 20px "Segoe UI"';
    ctx.fillText('🐦 Bird Skins:', 100, 220);
    
    buttons = [];
    SHOP_ITEMS.birds.forEach((item, i) => {
        const isUnlocked = player.unlockedBirds.includes(item.id);
        const isEquipped = player.birdSkin === item.id;
        const x = 100 + (i % 2) * 220;
        const y = 260 + Math.floor(i / 2) * 80;
        
        const btn = new Button(
            x, y, 200, 60,
            isUnlocked ? (isEquipped ? `✓ ${item.name}` : item.name) : `🔒 ${item.price}`,
            () => {
                if (!isUnlocked && player.coins >= item.price) {
                    player.coins -= item.price;
                    player.unlockedBirds.push(item.id);
                    player.birdSkin = item.id;
                    playSound('point');
                    createParticles(x + 100, y + 30, 30, COLORS.GOLD);
                } else if (isUnlocked) {
                    player.birdSkin = item.id;
                    playSound('click');
                }
            },
            {
                bgColor: isUnlocked ? item.color : COLORS.SECONDARY,
                fontSize: 18
            }
        );
        btn.hovered = btn.contains(mouseX, mouseY);
        btn.draw(ctx);
        buttons.push(btn);
    });
    
    // Obstacle Skins
    ctx.fillStyle = COLORS.WHITE;
    ctx.font = 'bold 20px "Segoe UI"';
    ctx.fillText('🚧 Obstacle Styles:', 640, 220);
    
    SHOP_ITEMS.obstacles.forEach((item, i) => {
        const isUnlocked = player.unlockedObstacles.includes(item.id);
        const isEquipped = player.obstacleSkin === item.id;
        const x = 640 + (i % 2) * 220;
        const y = 260 + Math.floor(i / 2) * 80;
        
        const btn = new Button(
            x, y, 200, 60,
            isUnlocked ? (isEquipped ? `✓ ${item.name}` : item.name) : `🔒 ${item.price}`,
            () => {
                if (!isUnlocked && player.coins >= item.price) {
                    player.coins -= item.price;
                    player.unlockedObstacles.push(item.id);
                    player.obstacleSkin = item.id;
                    playSound('point');
                    createParticles(x + 100, y + 30, 30, COLORS.GOLD);
                } else if (isUnlocked) {
                    player.obstacleSkin = item.id;
                    playSound('click');
                }
            },
            {
                bgColor: isUnlocked ? item.color : COLORS.SECONDARY,
                fontSize: 18
            }
        );
        btn.hovered = btn.contains(mouseX, mouseY);
        btn.draw(ctx);
        buttons.push(btn);
    });
    
    // Back button
    const backBtn = new Button(canvas.width / 2 - 75, canvas.height - 100, 150, 50, '← Back', () => { gameState = 'MAIN_MENU'; playSound('click'); });
    backBtn.hovered = backBtn.contains(mouseX, mouseY);
    backBtn.draw(ctx);
    buttons.push(backBtn);
}

function drawCredits() {
    drawGradientBackground();
    drawBackgroundParticles();
    
    drawAnimatedTitle('Credits', 100, 48);
    
    const credits = [
        { role: 'Developer', name: 'Daffa Aditya Pratama' },
        { role: 'Designer', name: 'Samsul Bahrur' },
        { role: 'Sound Design', name: 'Web Audio API' },
        { role: 'Engine', name: 'Pure JavaScript + Canvas' }
    ];
    
    credits.forEach((credit, i) => {
        const y = 250 + i * 80;
        const wave = Math.sin(animationTime * 2 + i) * 5;
        
        ctx.fillStyle = COLORS.WHITE;
        ctx.font = 'bold 28px "Segoe UI"';
        ctx.textAlign = 'center';
        ctx.fillText(credit.name, canvas.width / 2, y + wave);
        
        ctx.fillStyle = COLORS.SECONDARY;
        ctx.font = '18px "Segoe UI"';
        ctx.fillText(credit.role, canvas.width / 2, y + 30 + wave);
    });
    
    buttons = [
        new Button(canvas.width / 2 - 75, canvas.height - 100, 150, 50, '← Back', () => { gameState = 'MAIN_MENU'; playSound('click'); })
    ];
    
    buttons[0].hovered = buttons[0].contains(mouseX, mouseY);
    buttons[0].draw(ctx);
}

// ============================================
// GAME LOGIC
// ============================================
function startGame() {
    gameState = 'PLAYING';
    bird = { y: 360, velocity: 0, rotation: 0, wingPhase: 0 };
    pipes = [];
    particles = [];
    score = 0;
    combo = 0;
    maxCombo = 0;
    perfectPasses = 0;
    coinsEarned = 0;
    
    const diff = DIFFICULTY[settings.difficulty];
    gameSpeed = diff.speed;
    
    // Create initial pipes
    createPipe(canvas.width);
    createPipe(canvas.width + 400);
    
    playSound('click');
}

function createPipe(x) {
    const diff = DIFFICULTY[settings.difficulty];
    const minHeight = 100;
    const maxHeight = canvas.height - diff.pipeGap - minHeight - 50;
    const height = minHeight + Math.random() * (maxHeight - minHeight);
    
    pipes.push({
        x: x,
        height: height,
        gap: diff.pipeGap,
        passed: false,
        scored: false,
        perfect: false
    });
}

function updateGame() {
    // Bird physics
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;
    bird.rotation = Math.min(Math.max(bird.velocity * 3, -30), 90);
    bird.wingPhase += 0.2;
    
    // Move pipes
    pipes.forEach(pipe => {
        pipe.x -= gameSpeed;
        
        // Check for passing
        if (!pipe.scored && pipe.x + 70 < 100) {
            pipe.scored = true;
            score++;
            
            // Check if perfect pass (centered)
            const centerY = pipe.height + pipe.gap / 2;
            const distance = Math.abs(bird.y - centerY);
            
            if (distance < 30) {
                pipe.perfect = true;
                perfectPasses++;
                combo++;
                maxCombo = Math.max(maxCombo, combo);
                coinsEarned += 2;
                playSound('point');
                createParticles(100, bird.y, 15, COLORS.GOLD);
            } else {
                combo = 0;
                coinsEarned += 1;
                playSound('point');
            }
        }
    });
    
    // Remove off-screen pipes
    pipes = pipes.filter(p => p.x > -100);
    
    // Create new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 400) {
        createPipe(canvas.width);
    }
    
    // Update particles
    particles = particles.filter(p => p.update());
    
    // Check collision
    checkCollision();
    
    // Increase difficulty
    const diff = DIFFICULTY[settings.difficulty];
    gameSpeed = Math.min(diff.speed + score * diff.speedIncrease, diff.speed * 2);
    
    // Screen shake decay
    if (screenShakeAmount > 0) {
        screenShakeAmount *= 0.9;
        if (screenShakeAmount < 0.1) screenShakeAmount = 0;
    }
}

function checkCollision() {
    const birdLeft = 100 - BIRD_SIZE / 2;
    const birdRight = 100 + BIRD_SIZE / 2;
    const birdTop = bird.y - BIRD_SIZE / 2;
    const birdBottom = bird.y + BIRD_SIZE / 2;
    
    // Check bounds
    if (birdTop < 0 || birdBottom > canvas.height) {
        endGame();
        return;
    }
    
    // Check pipes
    pipes.forEach(pipe => {
        if (birdRight > pipe.x && birdLeft < pipe.x + 70) {
            if (birdTop < pipe.height || birdBottom > pipe.height + pipe.gap) {
                endGame();
            }
        }
    });
}

function endGame() {
    if (gameState !== 'PLAYING') return;
    
    gameState = 'GAME_OVER';
    playSound('death');
    
    if (settings.screenShake) {
        screenShakeAmount = 10;
    }
    
    // Death particles
    createParticles(100, bird.y, 40, COLORS.ACCENT);
    
    // Update stats
    player.coins += coinsEarned;
    if (score > player.highScore) {
        player.highScore = score;
    }
}

function jump() {
    if (gameState === 'PLAYING') {
        bird.velocity = JUMP;
        playSound('jump');
        createParticles(100, bird.y + BIRD_SIZE / 2, 10, COLORS.WHITE);
    }
}

// ============================================
// GAME RENDERING
// ============================================
function drawGame() {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, COLORS.PRIMARY);
    gradient.addColorStop(1, COLORS.SECONDARY);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Apply screen shake
    if (screenShakeAmount > 0 && settings.screenShake) {
        ctx.save();
        ctx.translate(
            (Math.random() - 0.5) * screenShakeAmount,
            (Math.random() - 0.5) * screenShakeAmount
        );
    }
    
    // Draw pipes
    const obstacleColor = SHOP_ITEMS.obstacles.find(o => o.id === player.obstacleSkin)?.color || COLORS.PRIMARY;
    pipes.forEach(pipe => {
        ctx.fillStyle = obstacleColor;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        
        // Top pipe
        ctx.beginPath();
        ctx.roundRect(pipe.x, 0, 70, pipe.height, [0, 0, 15, 15]);
        ctx.fill();
        
        // Bottom pipe
        ctx.beginPath();
        ctx.roundRect(pipe.x, pipe.height + pipe.gap, 70, canvas.height - pipe.height - pipe.gap, [15, 15, 0, 0]);
        ctx.fill();
        
        ctx.shadowBlur = 0;
    });
    
    // Draw bird
    const birdColor = SHOP_ITEMS.birds.find(b => b.id === player.birdSkin)?.color || COLORS.GOLD;
    ctx.save();
    ctx.translate(100, bird.y);
    ctx.rotate(bird.rotation * Math.PI / 180);
    
    // Bird body
    ctx.fillStyle = birdColor;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, BIRD_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Wing animation
    const wingY = Math.sin(bird.wingPhase) * 5;
    ctx.fillStyle = birdColor;
    ctx.beginPath();
    ctx.ellipse(-5, wingY, 8, 12, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye
    ctx.shadowBlur = 0;
    ctx.fillStyle = COLORS.WHITE;
    ctx.beginPath();
    ctx.arc(8, -5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.BLACK;
    ctx.beginPath();
    ctx.arc(10, -5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // Draw particles
    particles.forEach(p => p.draw(ctx));
    
    if (screenShakeAmount > 0 && settings.screenShake) {
        ctx.restore();
    }
    
    // HUD
    drawHUD();
}

function drawHUD() {
    // Score (center top)
    const scoreScale = combo > 0 ? 1 + Math.sin(animationTime * 10) * 0.1 : 1;
    ctx.save();
    ctx.translate(canvas.width / 2, 60);
    ctx.scale(scoreScale, scoreScale);
    ctx.fillStyle = combo > 5 ? COLORS.GOLD : COLORS.WHITE;
    ctx.font = 'bold 48px "Segoe UI"';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillText(score, 0, 0);
    ctx.restore();
    
    // Combo counter
    if (combo > 0) {
        ctx.fillStyle = COLORS.ACCENT_SECONDARY;
        ctx.font = 'bold 24px "Segoe UI"';
        ctx.textAlign = 'center';
        ctx.fillText(`Combo x${combo}`, canvas.width / 2, 110);
    }
    
    // Perfect passes (top left)
    ctx.fillStyle = COLORS.GOLD;
    ctx.font = 'bold 20px "Segoe UI"';
    ctx.textAlign = 'left';
    ctx.fillText(`⭐ Perfect: ${perfectPasses}`, 20, 40);
    
    // Coins (top right)
    ctx.textAlign = 'right';
    ctx.fillText(`💰 +${coinsEarned}`, canvas.width - 20, 40);
    
    // Difficulty (bottom left)
    ctx.fillStyle = COLORS.WHITE;
    ctx.font = '16px "Segoe UI"';
    ctx.textAlign = 'left';
    ctx.fillText(`Mode: ${settings.difficulty.toUpperCase()}`, 20, canvas.height - 20);
    
    // Speed (bottom right)
    ctx.textAlign = 'right';
    ctx.fillText(`Speed: ${gameSpeed.toFixed(1)}x`, canvas.width - 20, canvas.height - 20);
}

function drawGameOver() {
    drawGame();
    
    // Dark overlay with pulse
    const pulseAlpha = 0.7 + Math.sin(animationTime * 3) * 0.1;
    ctx.fillStyle = `rgba(0, 0, 0, ${pulseAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Gradient accent overlay
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, 400);
    gradient.addColorStop(0, 'rgba(235, 69, 158, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Game Over title with animation
    const scale = 1 + Math.sin(animationTime * 2) * 0.05;
    ctx.save();
    ctx.translate(canvas.width / 2, 150);
    ctx.scale(scale, scale);
    ctx.fillStyle = COLORS.ACCENT;
    ctx.font = 'bold 72px "Segoe UI"';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 20;
    ctx.fillText('GAME OVER', 0, 0);
    ctx.restore();
    
    // Stats
    const stats = [
        { label: 'Final Score', value: score, color: score > player.highScore ? COLORS.GOLD : COLORS.WHITE },
        { label: 'High Score', value: player.highScore, color: COLORS.GOLD },
        { label: 'Perfect Passes', value: perfectPasses, color: COLORS.ACCENT_SECONDARY },
        { label: 'Max Combo', value: maxCombo, color: COLORS.PRIMARY },
        { label: 'Coins Earned', value: coinsEarned, color: COLORS.GOLD }
    ];
    
    stats.forEach((stat, i) => {
        const y = 280 + i * 60;
        const slideX = canvas.width / 2 + Math.sin(animationTime * 3 + i) * 10;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '20px "Segoe UI"';
        ctx.textAlign = 'center';
        ctx.fillText(stat.label, slideX, y);
        
        ctx.fillStyle = stat.color;
        ctx.font = 'bold 32px "Segoe UI"';
        ctx.fillText(stat.value, slideX, y + 35);
    });
    
    // Restart instruction with pulse
    const pulseSize = 20 + Math.sin(animationTime * 4) * 2;
    ctx.fillStyle = COLORS.PRIMARY;
    ctx.font = `bold ${pulseSize}px "Segoe UI"`;
    ctx.textAlign = 'center';
    ctx.fillText('TAP / CLICK / SPACE TO RESTART', canvas.width / 2, canvas.height - 80);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '16px "Segoe UI"';
    ctx.fillText('Press ESC for Main Menu', canvas.width / 2, canvas.height - 40);
}

// ============================================
// MAIN UPDATE & RENDER LOOP
// ============================================
function update() {
    animationTime += 0.016; // ~60fps
    
    if (gameState === 'PLAYING') {
        updateGame();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    switch (gameState) {
        case 'MAIN_MENU':
            drawMainMenu();
            break;
        case 'SETTINGS':
            drawSettings();
            break;
        case 'SHOP':
            drawShop();
            break;
        case 'CREDITS':
            drawCredits();
            break;
        case 'PLAYING':
            drawGame();
            break;
        case 'GAME_OVER':
            drawGameOver();
            break;
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// ============================================
// INPUT HANDLERS
// ============================================
function handleClick(x, y) {
    initAudio();
    
    // Check button clicks
    let buttonClicked = false;
    buttons.forEach(btn => {
        if (btn.contains(x, y)) {
            playSound('click');
            btn.action();
            buttonClicked = true;
        }
    });
    
    // Game actions
    if (!buttonClicked) {
        if (gameState === 'PLAYING') {
            jump();
        } else if (gameState === 'GAME_OVER') {
            startGame();
        }
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    handleClick(x, y);
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;
    handleClick(x, y);
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    mouseX = (e.clientX - rect.left) * scaleX;
    mouseY = (e.clientY - rect.top) * scaleY;
});

document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (gameState === 'PLAYING') {
            jump();
        } else if (gameState === 'GAME_OVER') {
            startGame();
        }
    } else if (e.key === 'Escape') {
        if (gameState === 'GAME_OVER' || gameState === 'SETTINGS' || gameState === 'SHOP' || gameState === 'CREDITS') {
            gameState = 'MAIN_MENU';
            playSound('click');
        }
    }
});

// ============================================
// INITIALIZATION
// ============================================
function init() {
    console.log('%c🎮 Modern Flappy Bird - Professional Edition', 'color: #5865F2; font-size: 24px; font-weight: bold;');
    console.log('%c✨ Complete UI system with menus, shop, settings, and credits', 'color: #EB459E; font-size: 14px;');
    console.log('%c🎨 Professional design with Discord-inspired color scheme', 'color: #57F287; font-size: 14px;');
    console.log('%c🔊 Full audio system with Web Audio API', 'color: #FFD700; font-size: 14px;');
    console.log('%c💫 Particle effects and smooth animations', 'color: #87CEEB; font-size: 14px;');
    console.log('%c👨‍💻 Developer: Daffa Aditya Pratama', 'color: #FFF; font-size: 14px;');
    console.log('%c🎨 Designer: Samsul Bahrur', 'color: #FFF; font-size: 14px;');
    
    // Create background particles
    createBackgroundParticles();
    
    // Hide loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
    }
    
    // Start game loop
    gameLoop();
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
