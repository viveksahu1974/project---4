class ZombieGame {
  constructor() {
    this.score = 0;
    this.gameOver = false;
    this.zombies = new Set();
    this.gameContainer = document.getElementById('game-container');
    this.scoreElement = document.getElementById('score-value');
    this.crosshair = document.getElementById('crosshair');
    this.gameOverScreen = document.getElementById('game-over');
    this.finalScoreElement = document.getElementById('final-score');
    this.restartButton = document.getElementById('restart-button');
    
    this.setupEventListeners();
    this.gameLoop();
  }

  setupEventListeners() {
    document.addEventListener('mousemove', (e) => {
      this.crosshair.style.left = e.clientX + 'px';
      this.crosshair.style.top = e.clientY + 'px';
    });

    document.addEventListener('click', (e) => {
      if (this.gameOver) return;
      
      const clickX = e.clientX;
      const clickY = e.clientY;
      
      this.zombies.forEach(zombie => {
        const rect = zombie.element.getBoundingClientRect();
        const zombieX = rect.left + rect.width / 2;
        const zombieY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(clickX - zombieX, 2) + 
          Math.pow(clickY - zombieY, 2)
        );
        
        if (distance < rect.width / 2) {
          this.hitZombie(zombie);
        }
      });
    });

    this.restartButton.addEventListener('click', () => this.restartGame());
  }

  createZombie() {
    const zombie = {
      element: document.createElement('div'),
      speed: Math.random() * 2 + 1
    };
    
    zombie.element.className = 'zombie';
    
    // Random position on the edges of the screen
    const side = Math.floor(Math.random() * 4);
    const { innerWidth: width, innerHeight: height } = window;
    
    switch(side) {
      case 0: // Top
        zombie.x = Math.random() * width;
        zombie.y = -60;
        break;
      case 1: // Right
        zombie.x = width + 60;
        zombie.y = Math.random() * height;
        break;
      case 2: // Bottom
        zombie.x = Math.random() * width;
        zombie.y = height + 60;
        break;
      case 3: // Left
        zombie.x = -60;
        zombie.y = Math.random() * height;
        break;
    }
    
    zombie.element.style.left = zombie.x + 'px';
    zombie.element.style.top = zombie.y + 'px';
    
    this.gameContainer.appendChild(zombie.element);
    this.zombies.add(zombie);
  }

  moveZombies() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    this.zombies.forEach(zombie => {
      const dx = centerX - zombie.x;
      const dy = centerY - zombie.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      zombie.x += (dx / distance) * zombie.speed;
      zombie.y += (dy / distance) * zombie.speed;
      
      zombie.element.style.left = zombie.x + 'px';
      zombie.element.style.top = zombie.y + 'px';
      
      // Check if zombie reached the center
      if (distance < 50) {
        this.endGame();
      }
    });
  }

  hitZombie(zombie) {
    zombie.element.classList.add('hit');
    this.score += 10;
    this.scoreElement.textContent = this.score;
    
    setTimeout(() => {
      zombie.element.remove();
      this.zombies.delete(zombie);
    }, 200);
  }

  endGame() {
    this.gameOver = true;
    this.finalScoreElement.textContent = this.score;
    this.gameOverScreen.classList.remove('hidden');
    
    this.zombies.forEach(zombie => {
      zombie.element.remove();
    });
    this.zombies.clear();
  }

  restartGame() {
    this.score = 0;
    this.gameOver = false;
    this.scoreElement.textContent = '0';
    this.gameOverScreen.classList.add('hidden');
    this.gameLoop();
  }

  gameLoop() {
    if (this.gameOver) return;
    
    if (Math.random() < 0.03) {
      this.createZombie();
    }
    
    this.moveZombies();
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Start the game
new ZombieGame();