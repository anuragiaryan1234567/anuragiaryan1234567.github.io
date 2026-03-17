window.initSportsGame = () => {
    const canvas = document.getElementById('sportsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Game variables
    let ball = { x: 400, y: 200, r: 10, dx: 5, dy: 4, speed: 6 };
    let p1 = { x: 20, y: 150, w: 10, h: 100, score: 0, dy: 0, speed: 6 };
    let p2 = { x: 770, y: 150, w: 10, h: 100, score: 0, dy: 0, speed: 5 };
    let isPlaying = false;
    let keys = {};

    // Input handling
    const keydown = (e) => {
        keys[e.key] = true;
        if (e.code === 'Space' && !isPlaying) {
            isPlaying = true;
            resetBall();
        }
    };
    const keyup = (e) => { keys[e.key] = false; };
    
    // Clear old listeners safely via cleanup flag or just remove on nav, but for simplicity:
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);

    function resetBall() {
        ball.x = 400; ball.y = 200;
        ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
        ball.dy = (Math.random() * 2 - 1) * ball.speed;
    }

    function update() {
        if (!isPlaying) return;

        // Player 1 movement
        if ((keys['w'] || keys['W']) && p1.y > 0) p1.dy = -p1.speed;
        else if ((keys['s'] || keys['S']) && p1.y + p1.h < canvas.height) p1.dy = p1.speed;
        else p1.dy = 0;
        p1.y += p1.dy;

        // Player 2 (AI) movement
        if (ball.y < p2.y + p2.h/2 - 10 && p2.y > 0) p2.y -= p2.speed;
        else if (ball.y > p2.y + p2.h/2 + 10 && p2.y + p2.h < canvas.height) p2.y += p2.speed;

        // Ball movement
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Wall collision (top/bottom)
        if (ball.y - ball.r < 0 || ball.y + ball.r > canvas.height) ball.dy *= -1;

        // Paddle collision
        let player = (ball.x < canvas.width / 2) ? p1 : p2;
        if (ball.x - ball.r < player.x + player.w && ball.x + ball.r > player.x &&
            ball.y + ball.r > player.y && ball.y - ball.r < player.y + player.h) {
            
            // Hit sound or effect logic here
            ball.dx *= -1.05; // speed up slightly
            
            // Change angle based on hit location
            let hitPoint = ball.y - (player.y + player.h/2);
            hitPoint = hitPoint / (player.h/2);
            let angle = hitPoint * Math.PI/4; // max angle 45deg
            let direction = (ball.x < canvas.width/2) ? 1 : -1;
            
            const currentSpeed = Math.sqrt(ball.dx*ball.dx + ball.dy*ball.dy);
            ball.dx = direction * currentSpeed * Math.cos(angle);
            ball.dy = currentSpeed * Math.sin(angle);
        }

        // Scoring
        if (ball.x - ball.r < 0) { p2.score++; resetBall(); }
        else if (ball.x + ball.r > canvas.width) { p1.score++; resetBall(); }
    }

    function draw() {
        // Clear screen with slight trail
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Center line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Paddles
        ctx.fillStyle = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f0ff';
        ctx.fillRect(p1.x, p1.y, p1.w, p1.h);
        
        ctx.fillStyle = '#ff0055';
        ctx.shadowColor = '#ff0055';
        ctx.fillRect(p2.x, p2.y, p2.w, p2.h);

        // Ball
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Scores
        ctx.font = '30px "Press Start 2P", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(p1.score, 300, 50);
        ctx.fillText(p2.score, 470, 50);

        if (!isPlaying) {
            ctx.fillStyle = 'white';
            ctx.font = '20px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("Press SPACE to Start", canvas.width/2, canvas.height/2);
            ctx.textAlign = 'left';
        }
    }

    function loop() {
        update();
        draw();
        window.currentGameLoop = requestAnimationFrame(loop);
    }
    
    loop();
};
