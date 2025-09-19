const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.8;

// Load textures
const playerImg = new Image();
playerImg.src = 'Mossy Tileset/Mossy - TileSet.png'; // pick a player tile section later

const platformImg = new Image();
platformImg.src = 'Mossy Tileset/Mossy - MossyHills.png';

const backgroundImg = new Image();
backgroundImg.src = 'Mossy Tileset/Mossy - BackgroundDecoration.png';

class Player {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = 100;
        this.y = canvas.height - this.height - 100;
        this.velX = 0;
        this.velY = 0;
        this.speed = 5;
        this.jumpForce = 15;
        this.grounded = false;
    }

    update() {
        this.velY += gravity;
        this.x += this.velX;
        this.y += this.velY;

        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velY = 0;
            this.grounded = true;
        }

        this.draw();
    }

    draw() {
        // Draw a section of the tileset as player
        ctx.drawImage(
            playerImg,
            0, 0, 32, 32,           // crop from tileset
            this.x, this.y, this.width, this.height
        );
    }
}

class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(offsetX) {
        // Tile the platform texture
        const pattern = ctx.createPattern(platformImg, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(this.x - offsetX, this.y, this.width, this.height);
    }
}

const player = new Player();
const keys = {};

const platforms = [
    new Platform(300, canvas.height - 150, 200, 50),
    new Platform(600, canvas.height - 250, 200, 50),
    new Platform(1000, canvas.height - 200, 200, 50),
    new Platform(1400, canvas.height - 300, 200, 50),
];

let cameraOffsetX = 0;

window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

function gameLoop() {
    // Draw background
    if (backgroundImg.complete) {
        const pattern = ctx.createPattern(backgroundImg, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Player movement
    if (keys['ArrowLeft']) player.velX = -player.speed;
    else if (keys['ArrowRight']) player.velX = player.speed;
    else player.velX = 0;

    if (keys['ArrowUp'] && player.grounded) {
        player.velY = -player.jumpForce;
        player.grounded = false;
    }

    player.update();

    // Platform collision
    player.grounded = false;
    for (let plat of platforms) {
        if (
            player.x < plat.x + plat.width &&
            player.x + player.width > plat.x &&
            player.y + player.height > plat.y &&
            player.y + player.height < plat.y + plat.height &&
            player.velY >= 0
        ) {
            player.y = plat.y - player.height;
            player.velY = 0;
            player.grounded = true;
        }

        plat.draw(cameraOffsetX);
    }

    // Update camera
    cameraOffsetX = player.x - 100;

    requestAnimationFrame(gameLoop);
}

gameLoop();
