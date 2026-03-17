document.addEventListener('DOMContentLoaded', () => {

    // Smooth scrolling for navigation links
    document.querySelectorAll('.main-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);
            if(targetEl) {
                targetEl.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Detailed Data for Non-Playable Games
    const detailedGames = {
        'rpg': {
            title: 'Cybernetic Soul',
            category: 'Action RPG / Cyberpunk',
            desc: 'In the year 2142, humanity is merging with machines. You play as a rogue agent navigating the treacherous neon-lit streets of Neo-Veridia. Engage in deep dialogue choices, robust skill-tree progressions, and high-octane cybernetic combat. Will you save what remains of humanity or embrace the singularity?',
            heroImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
            color: '#10b981',
            features: [
                { title: 'Rich Storyline', desc: 'Over 50 hours of branching narratives and multiple endings.' },
                { title: 'Cyber-Implants', desc: 'Customize your body with over 100 unique augmentations.' }
            ]
        },
        'strategy': {
            title: 'Stellar Command',
            category: 'Grand Strategy / Sci-Fi',
            desc: 'Take control of a fledgling space-faring civilization. Explore uncharted star systems, research groundbreaking technologies, and engage in diplomacy or ruthless warfare with alien factions. Every decision shapes the destiny of your empire in this procedurally generated galaxy.',
            heroImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200&auto=format&fit=crop',
            color: '#14b8a6',
            features: [
                { title: 'Massive Scale', desc: 'Command hundreds of ships in real-time tactical battles.' },
                { title: 'Deep Diplomacy', desc: 'Form federations, break treaties, and manipulate galactic markets.' }
            ]
        },
        'puzzle': {
            title: 'Quantum Enigma',
            category: 'First-Person Puzzle',
            desc: 'Step into a world where the laws of physics are mere suggestions. Quantum Enigma challenges you to think in four dimensions. Manipulate gravity, create paradoxes, and warp time to navigate beautifully crafted, mind-bending architecture. It is a true test of intellect and perception.',
            heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
            color: '#8b5cf6',
            features: [
                { title: 'Mind-Bending Mechanics', desc: 'Walk on walls, reverse time, and clone objects to solve puzzles.' },
                { title: 'Stunning Visuals', desc: 'Breathtaking surreal landscapes powered by Unreal Engine 5.' }
            ]
        }
    };

    // App controller for launching games inline
    window.app = {
        currentGameId: null,

        launchGame(gameId) {
            // Stop any currently running game loop to save performance
            if (window.currentGameLoop) {
                cancelAnimationFrame(window.currentGameLoop);
                window.currentGameLoop = null;
            }

            // Restore all thumbnails and remove old canvases
            const allVisuals = document.querySelectorAll('.game-visual');
            allVisuals.forEach(visual => {
                const img = visual.querySelector('.game-thumbnail');
                if (img) img.classList.remove('hidden');
                
                const oldCanvas = visual.querySelector('canvas');
                if (oldCanvas) oldCanvas.remove();
                
                // Reset instructions/buttons if we added them
                const oldExit = visual.querySelector('.exit-inline-btn');
                if (oldExit) oldExit.remove();
            });

            this.currentGameId = gameId;

            const visualContainer = document.getElementById(`visual-${gameId}`);
            if (!visualContainer) return;

            // Hide the thumbnail
            const thumb = visualContainer.querySelector('.game-thumbnail');
            if (thumb) thumb.classList.add('hidden');

            // Inject the canvas based on game ID
            let canvasHtml = '';
            if(gameId === 'sports') canvasHtml = '<canvas id="sportsCanvas" width="800" height="400" style="width:100%; height:auto;"></canvas>';
            if(gameId === 'adventure') canvasHtml = '<canvas id="adventureCanvas" width="800" height="500" style="width:100%; height:auto;"></canvas>';
            if(gameId === 'racing') canvasHtml = '<canvas id="racingCanvas" width="400" height="600" style="max-height: 600px; width:auto;"></canvas>';
            if(gameId === 'fighting') canvasHtml = '<canvas id="fightingCanvas" width="800" height="400" style="width:100%; height:auto;"></canvas>';
            
            // Add a small exit button below the canvas to restore thumbnail
            const exitBtn = document.createElement('button');
            exitBtn.className = 'exit-inline-btn';
            exitBtn.innerText = 'Stop Game';
            exitBtn.style.cssText = 'margin-top: 15px; padding: 8px 16px; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 8px; cursor: pointer;';
            exitBtn.onclick = () => this.stopCurrentGame(gameId);

            visualContainer.insertAdjacentHTML('beforeend', canvasHtml);
            visualContainer.appendChild(exitBtn);

            // Execute the specific game initialization
            if(gameId === 'sports' && window.initSportsGame) window.initSportsGame();
            if(gameId === 'adventure' && window.initAdventureGame) window.initAdventureGame();
            if(gameId === 'racing' && window.initRacingGame) window.initRacingGame();
            if(gameId === 'fighting' && window.initFightingGame) window.initFightingGame();
        },

        stopCurrentGame(gameId) {
            if (window.currentGameLoop) {
                cancelAnimationFrame(window.currentGameLoop);
                window.currentGameLoop = null;
            }
            
            const visualContainer = document.getElementById(`visual-${gameId}`);
            if (!visualContainer) return;

            // Show thumbnail
            const thumb = visualContainer.querySelector('.game-thumbnail');
            if (thumb) thumb.classList.remove('hidden');
            
            // Remove canvas and exit button
            const oldCanvas = visualContainer.querySelector('canvas');
            if (oldCanvas) oldCanvas.remove();
            
            const oldExit = visualContainer.querySelector('.exit-inline-btn');
            if (oldExit) oldExit.remove();
            
            this.currentGameId = null;
        },

        showGameDetails(gameId) {
            const data = detailedGames[gameId];
            if(!data) return;

            document.getElementById('modalHero').style.backgroundImage = `url('${data.heroImage}')`;
            document.getElementById('modalCategory').innerText = data.category;
            document.getElementById('modalCategory').style.color = data.color;
            document.getElementById('modalTitle').innerText = data.title;
            document.getElementById('modalDesc').innerText = data.desc;
            
            const featuresContainer = document.getElementById('modalFeatures');
            featuresContainer.innerHTML = '';
            data.features.forEach(f => {
                featuresContainer.innerHTML += `
                    <div class="feature-item">
                        <h4>${f.title}</h4>
                        <p>${f.desc}</p>
                    </div>
                `;
            });

            document.getElementById('gameModal').classList.add('active');
            document.body.style.overflow = 'hidden'; // prevent scrolling
        },

        closeGameDetails(event) {
            if (event && event.target.id !== 'gameModal' && !event.target.classList.contains('modal-close')) {
                // Return if clicking inside content, except close button
                if (event.target.closest('.modal-content') && !event.target.closest('.modal-close')) {
                    return;
                }
            }
            document.getElementById('gameModal').classList.remove('active');
            document.body.style.overflow = 'auto'; // restore scrolling
        }
    };

});
