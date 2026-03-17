window.initFightingGame = () => {
    const canvas = document.getElementById('fightingCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let p1 = { x: 100, y: 250, w: 40, h: 80, color: '#00f0ff', hp: 100, isAttacking: false, facingRight: true };
    let ai = { x: 600, y: 250, w: 40, h: 80, color: '#ff0055', hp: 100, isAttacking: false, facingRight: false, attackTimer: 0 };
    
    const floorY = 330;
    let keys = {};
    let isGameOver = false;

    document.addEventListener('keydown', (e) => keys[e.key] = true);
    document.addEventListener('keyup', (e) => keys[e.key] = false);

    function update() {
        if (isGameOver) return;

        // Player Move
        if (keys['a']) { p1.x -= 5; p1.facingRight = false; }
        if (keys['d']) { p1.x += 5; p1.facingRight = true; }
        
        // Attack
        if (keys[' '] && !p1.isAttacking) {
            p1.isAttacking = true;
            setTimeout(() => p1.isAttacking = false, 200);
            
            // Hitbox
            let hitX = p1.facingRight ? p1.x + p1.w : p1.x - 60;
            if (hitX < ai.x + ai.w && hitX + 60 > ai.x && p1.y < ai.y + ai.h && p1.y + p1.h > ai.y) {
                ai.hp -= 10;
            }
        }

        // Constraints
        p1.x = Math.max(0, Math.min(canvas.width - p1.w, p1.x));

        // AI Logic
        let dist = p1.x - ai.x;
        if (Math.abs(dist) > 50) {
            ai.x += (dist > 0 ? 2 : -2);
            ai.facingRight = dist > 0;
        } else {
            // In range, attack
            ai.attackTimer++;
            if (ai.attackTimer > 60 && !ai.isAttacking) {
                ai.isAttacking = true;
                setTimeout(() => ai.isAttacking = false, 200);
                ai.attackTimer = 0;
                
                let hitX = ai.facingRight ? ai.x + ai.w : ai.x - 60;
                if (hitX < p1.x + p1.w && hitX + 60 > p1.x) {
                    p1.hp -= 15;
                }
            }
        }

        // Win Loss
        if (p1.hp <= 0 || ai.hp <= 0) {
            isGameOver = true;
        }
    }

    function draw() {
        // bg
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Floor
        ctx.fillStyle = '#333';
        ctx.fillRect(0, floorY, canvas.width, canvas.height - floorY);

        // Health Bars UI
        ctx.fillStyle = 'red';
        ctx.fillRect(20, 20, 300, 20);
        ctx.fillRect(480, 20, 300, 20);

        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(20, 20, 3 * Math.max(0, p1.hp), 20);
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(480 + 300 - (3 * Math.max(0, ai.hp)), 20, 3 * Math.max(0, ai.hp), 20);

        // P1
        ctx.fillStyle = p1.color;
        ctx.fillRect(p1.x, p1.y, p1.w, p1.h);
        if (p1.isAttacking) {
            ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
            if (p1.facingRight) ctx.fillRect(p1.x + p1.w, p1.y + 20, 60, 20);
            else ctx.fillRect(p1.x - 60, p1.y + 20, 60, 20);
        }

        // AI
        ctx.fillStyle = ai.color;
        ctx.fillRect(ai.x, ai.y, ai.w, ai.h);
        if (ai.isAttacking) {
            ctx.fillStyle = 'rgba(255, 0, 85, 0.5)';
            if (ai.facingRight) ctx.fillRect(ai.x + ai.w, ai.y + 20, 60, 20);
            else ctx.fillRect(ai.x - 60, ai.y + 20, 60, 20);
        }

        if (isGameOver) {
            ctx.fillStyle = 'white';
            ctx.font = '40px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.fillText(p1.hp <= 0 ? "YOU LOSE" : "YOU WIN!", canvas.width/2, canvas.height/2);
            ctx.textAlign = 'left';
        }
    }

    function loop() {
        update();
        draw();
        if (!isGameOver) {
            window.currentGameLoop = requestAnimationFrame(loop);
        }
    }
    loop();
};
