window.initAdventureGame = () => {
    const canvas = document.getElementById('adventureCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const tileSize = 40;
    const cols = canvas.width / tileSize;
    const rows = canvas.height / tileSize;

    let player = { x: 1, y: 1, color: '#00f0ff' };
    let coins = [];
    let enemies = [];
    let score = 0;
    let keys = {};
    let lastMove = 0;
    let map = [];

    // Simple Map Gen (0=floor, 1=wall)
    for (let i = 0; i < rows; i++) {
        map[i] = [];
        for (let j = 0; j < cols; j++) {
            if (i === 0 || j === 0 || i === rows-1 || j === cols-1) map[i][j] = 1;
            else if (Math.random() < 0.2) map[i][j] = 1;
            else map[i][j] = 0;
        }
    }
    map[1][1] = 0; // Spawn clear

    // Spawn stuff
    for(let i=0; i<5; i++) {
        spawnCoin();
        if(i<3) spawnEnemy();
    }

    document.addEventListener('keydown', (e) => keys[e.key] = true);
    document.addEventListener('keyup', (e) => keys[e.key] = false);

    function spawnCoin() {
        let x, y;
        do {
            x = Math.floor(Math.random() * (cols-2)) + 1;
            y = Math.floor(Math.random() * (rows-2)) + 1;
        } while(map[y][x] !== 0);
        coins.push({x, y});
    }

    function spawnEnemy() {
        let x, y;
        do {
            x = Math.floor(Math.random() * (cols-2)) + 1;
            y = Math.floor(Math.random() * (rows-2)) + 1;
        } while(map[y][x] !== 0);
        enemies.push({x, y, dx: 1, dy: 0, timer: 0});
    }

    function movePlayer() {
        const now = Date.now();
        if (now - lastMove < 100) return; // limit speed
        
        let dx = 0, dy = 0;
        if (keys['ArrowUp'] || keys['w']) dy = -1;
        else if (keys['ArrowDown'] || keys['s']) dy = 1;
        else if (keys['ArrowLeft'] || keys['a']) dx = -1;
        else if (keys['ArrowRight'] || keys['d']) dx = 1;

        if (dx !== 0 || dy !== 0) {
            if (map[player.y + dy][player.x + dx] === 0) {
                player.x += dx;
                player.y += dy;
                lastMove = now;
            }
        }
    }

    function update() {
        movePlayer();

        // Check coins
        for (let i=0; i<coins.length; i++) {
            if (coins[i].x === player.x && coins[i].y === player.y) {
                score += 10;
                coins.splice(i, 1);
                spawnCoin();
                break;
            }
        }

        // Enemy movement simple logic
        enemies.forEach(e => {
            e.timer++;
            if (e.timer > 30) {
                const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
                const rDir = dirs[Math.floor(Math.random()*4)];
                if (map[e.y + rDir[1]][e.x + rDir[0]] === 0) {
                    e.x += rDir[0];
                    e.y += rDir[1];
                }
                e.timer = 0;
            }
            
            // Hit check
            if (e.x === player.x && e.y === player.y) {
                score = Math.max(0, score - 50);
                player.x = 1; player.y = 1; // Respawn
            }
        });
    }

    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Map
        for (let i=0; i<rows; i++) {
            for (let j=0; j<cols; j++) {
                if (map[i][j] === 1) {
                    ctx.fillStyle = '#7d2ae8';
                    ctx.fillRect(j*tileSize, i*tileSize, tileSize-1, tileSize-1);
                }
            }
        }

        // Coins
        ctx.fillStyle = '#ffd700';
        coins.forEach(c => {
            ctx.beginPath();
            ctx.arc(c.x*tileSize + tileSize/2, c.y*tileSize + tileSize/2, tileSize/4, 0, Math.PI*2);
            ctx.fill();
        });

        // Enemies
        ctx.fillStyle = '#ff0055';
        enemies.forEach(e => {
            ctx.fillRect(e.x*tileSize+4, e.y*tileSize+4, tileSize-8, tileSize-8);
        });

        // Player
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x*tileSize+2, player.y*tileSize+2, tileSize-4, tileSize-4);

        // Score
        ctx.fillStyle = 'white';
        ctx.font = '20px sans-serif';
        ctx.fillText(`Score: ${score}`, 10, 30);
    }

    function loop() {
        update();
        draw();
        window.currentGameLoop = requestAnimationFrame(loop);
    }
    loop();
};
