// Global varibals
const livesCount = document.getElementById("lives");
const scoreCount = document.getElementById("score");
const modal = document.querySelector('.modal');
const playAgain = document.querySelector('.play-again');
const finalScore = document.querySelector('.final-score');
const instructions = document.querySelector('.instructions');
const start = document.querySelector('.OK');
var score = 0;
var lives = 3;

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x >= 500) {
        this.x = 0;
    }
    this.enemyCollision();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// If the player collided with the player then decrease lives and 
// set the player to the starting position
Enemy.prototype.enemyCollision = function() {
    if (player.y + 131 >= this.y + 90 &&
        player.y + 73 <= this.y + 135 &&
        player.x + 25 <= this.x + 88 &&
        player.x + 76 >= this.x + 11) {
        lives--;
        livesCount.innerHTML = ` ${lives} `;
        if (lives==0){
            gameOver();
        }
        restartGame();
    }
};

// Hearts to be collected from the player to gain lives
var Heart = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/Heart.png';
};

Heart.prototype.update = function() {
    this.heartCollision();
};

Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// If player collects a heart, then move it out of the screen and
// increase lives
Heart.prototype.heartCollision = function() {
    if (player.y + 131 >= this.y + 90 &&
        player.y + 73 <= this.y + 135 &&
        player.x + 25 <= this.x + 88 &&
        player.x + 76 >= this.x + 11) {
        lives++;
        livesCount.innerHTML = ` ${lives} `;
        this.x = 900;
        this.y = 900;
        // display a new heart after a while
        var waitTime = setTimeout( function() {
        heart.heartReset();
    }, 8000);
    }
};

// Reset the heart to a new location
Heart.prototype.heartReset = function() {
    this.x = (101 * Math.floor(Math.random() * 4) + 0);
    this.y = (70 + (85 * Math.floor(Math.random() * 3) + 0));
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/char-boy.png';
    this.characters = [ 
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
    ];
};

Player.prototype.update = function() {};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.reset = function() {
    this.x = 200;
    this.y = 400;
    this.speed = 90;
};

// Handles the arrows clicks to move the player
Player.prototype.handleInput = function(key) {
    switch(key) {
        // check for wall, otherwise move left
        case 'left':
        this.x -= this.speed;
        if (this.x < 2) {
            this.x = 2;
        }
        break;
        // check for wall, otherwise move right
        case 'right':
        this.x += this.speed;
        if (this.x > 400) {
            this.x = 400;
        }
        break;
        // check for water, if yes then game won
        // otherwise move up
        case 'up':
        this.y -= this.speed;
        if (this.y < 0) { 
            gameWon();
            return;
        }
        break;
        // check for bottom wall, otherwise move down
        case 'down':
        this.y += this.speed;
        if (this.y > 410) { 
            this.y = 410;
        }
        break;
        // if user hits space, then change character
        case 'space':
        changeCharacter();
        break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player(200, 400, 0);
var heart = new Heart (Math.random() * 160 + 50, 70 +
    (85 * Math.floor(Math.random() * 3) + 0));

// Picks a new character from the character array
var n = 0;
var changeCharacter = function() {
    n = (n + 1) % player.characters.length;
    player.sprite = player.characters[n];
};

// If the player reaches the water, it will reset its position and 
// adds 5 points to the score, then increase the enemy
function gameWon() {
    player.reset();
    score += 5;
    scoreCount.innerHTML = ` ${score} `;
    if (score % 2 == 0 && allEnemies.length < 4) {
        allEnemies.push(new Enemy(0, Math.random() * 160 + 50, Math.random() * 90 + 70));
    }
}

// Once the lives are all gone, a modal with the score will be displayed
function gameOver() {
    player.reset();
    modal.style.display = 'block';
    finalScore.innerHTML = ` ${score} `;
    playAgain.addEventListener('click', function(s){
        score = 0;
        lives = 3;
        livesCount.innerHTML = ` ${lives} `;
        scoreCount.innerHTML = ` ${score} `;
        restartGame();
        modal.style.display = 'none';
        });
}

// Restart the game from the beggining and push enemies
function restartGame() {
    player.reset();
    heart.heartReset();
    allEnemies = [];
    allEnemies.push(
        new Enemy(0,40 + Math.random()*100,40 + Math.random()*100),
        new Enemy(0,60 + Math.random()*100,60 + Math.random()*100),
        new Enemy(5,50 + Math.random()*130,70 + Math.random()*100)
        );
}

// Initiates the game by showing the instructions
function gameInit() {
    instructions.style.display = 'block';
    start.addEventListener('click', function(s){
        restartGame();
        instructions.style.display = 'none';
        });
}

gameInit();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space',
    };

    player.handleInput(allowedKeys[e.keyCode]);
});