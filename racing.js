window.initRacingGame = () => {
    const canvas = document.getElementById('racingCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let player = { x: canvas.width / 2 - 20, y: canvas.height - 80, w: 40, h: 60, speed: 5 };
    let obstacles = [];
    let lines = [];
    let score = 0;
    let speedMult = 1;
    let frames = 0;
    let keys = {};
    let isGameOver = false;

    // Road lines
    for(let i=0; i<canvas.height; i+=40) {
        lines.push({y: i});
    }

    document.addEventListener('keydown', (e) => keys[e.key] = true);
    document.addEventListener('keyup', (e) => keys[e.key] = false);

    function spawnObstacle() {
        let w = 40 + Math.random() * 40;
        let x = Math.random() * (canvas.width - w);
        obstacles.push({ x: x, y: -80, w: w, h: 40, speed: 3 + Math.random() * 2 });
    }

    function update() {
        if (isGameOver) return;
        frames++;
        
        // Speed up over time
        if (frames % 300 === 0) speedMult += 0.2;

        // Player Movement
        if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
        if (keys['ArrowRight'] && player.x < canvas.width - player.w) player.x += player.speed;

        // Lines
        lines.forEach(l => {
            l.y += 5 * speedMult;
            if (l.y > canvas.height) l.y = -40;
        });

        // Obstacles
        if (frames % Math.max(30, 80 - Math.floor(speedMult*5)) === 0) {
            spawnObstacle();
        }

        for (let i = 0; i < obstacles.length; i++) {
            let obs = obstacles[i];
            obs.y += obs.speed * speedMult;

            // Collision check
            if (player.x < obs.x + obs.w && player.x + player.w > obs.x &&
                player.y < obs.y + obs.h && player.y + player.h > obs.y) {
                isGameOver = true;
            }

            if (obs.y > canvas.height) {
                score += 10;
                obstacles.splice(i, 1);
                i--;
            }
        }
    }

    function draw() {
        // Road
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Lines
        ctx.fillStyle = '#fff';
        lines.forEach(l => {
            ctx.fillRect(canvas.width / 2 - 5, l.y, 10, 20);
        });

        // Obstacles
        ctx.fillStyle = '#da3633';
        obstacles.forEach(obs => {
            ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        });

        // Player Car
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(player.x, player.y, player.w, player.h);

        // Score
        ctx.fillStyle = 'white';
        ctx.font = '20px sans-serif';
        ctx.fillText(`Score: ${score}`, 10, 30);

        if (isGameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = 'red';
            ctx.textAlign = 'center';
            ctx.font = '30px "Press Start 2P"';
            ctx.fillText('CRASHED!', canvas.width/2, canvas.height/2);
            ctx.fillStyle = 'white';
            ctx.font = '16px sans-serif';
            ctx.fillText('Refresh or navigate away to reset', canvas.width/2, canvas.height/2 + 40);
            ctx.textAlign = 'left';
        }
    }

    function loop() {
        update();
        draw();
        if (!isGameOver) {
            window.currentGameLoop = requestAnimationFrame(loop);
        } else {
             window.currentGameLoop = null; // stop loop
        }
    }
    loop();
};
