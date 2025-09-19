const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.8;

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
        // Apply gravity
        this.velY += gravity;
        this.x += this.velX;
        this.y += this.velY;

        // Collision with floor
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velY = 0;
            this.grounded = true;
        }

        this.draw();
    }

    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
        ctx.fillStyle = 'brown';
        ctx.fillRect(this.x - offsetX, this.y, this.width, this.height);
    }
}

const player = new Player();
const keys = {};

const platforms = [
    new Platform(300, canvas.height - 150, 200, 20),
    new Platform(600, canvas.height - 250, 200, 20),
    new Platform(1000, canvas.height - 200, 200, 20),
    new Platform(1400, canvas.height - 300, 200, 20),
];

let cameraOffsetX = 0;

window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player movement
    if (keys['ArrowLeft']) player.velX = -player.speed;
    else if (keys['ArrowRight']) player.velX = player.speed;
    else player.velX = 0;

    if (keys['ArrowUp'] && player.grounded) {
        player.velY = -player.jumpForce;
        player.grounded = false;
    }

    // Update player
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
