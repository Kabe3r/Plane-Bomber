const score = document.querySelector(".score");
const gameArea = document.querySelector(".gameArea");
const gameMessage = document.querySelector(".gameMessage");

// Adding event listeners for keys
document.addEventListener("keydown", keyPress);
document.addEventListener("keyup", keyLeave);

// setting the click event
document.addEventListener("click", start);

// creating an keys object with key set to false initally
let keys = {
      space: false
}

// created the player object with player keys & values to initialize game
let player = {
      score: 0,
      speed: 2,
      inPlay: false
};


// Tracking the keys when it is pressed or leave
function keyPress(e) {
      e.preventDefault();
      let tempKey = e.key == " " ? "space": e.key;
      // set the key value to true when pressed 
      keys[tempKey] = true
}

function keyLeave(e) {
      e.preventDefault();
      let tempKey = e.key == " " ? "space": e.key;
      // set the key value back to false when leave 
      keys[tempKey] = false;
}

// starting the game initializing player obj and adding staring values
function start() {
      gameMessage.classList.add("hide");
      if (!player.inPlay) {
            gameArea.innerHTML = "";
            player.level = 20;
            displayTargets();
            player.inPlay = true;
            player.score = 2000;
            player.totalBombs = 2;
            player.activeBomb = 0;
            player.bombScore = 0;
            player.ready = true;
            player.plane = document.createElement("div");
            player.plane.setAttribute("class", "plane");
            gameArea.appendChild(player.plane);
            window.requestAnimationFrame(playGame);
            player.x = player.plane.offsetLeft;
            player.y = player.plane.offsetTop;

      }
}

// Adding targets
// Ending the game
function endGame() {
      player.inPlay = false;
      gameMessage.innerHTML = 'Game Over<br> Press Here to Start '
      gameMessage.classList.remove("hide");
}


// creating targets
function displayTargets() {
      player.level--;
      if (player.level < 0) {
            endGame();
      } else {
            player.target = document.createElement("div");
            player.target.classList.add("target")
            player.target.style.width = Math.floor(Math.random() * 150) + 150 + "px";
            player.target.style.height = Math.floor(Math.random() * 100) + 100 + "px";
            player.target.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 200)) + 50 + "px";
            gameArea.appendChild(player.target);
      }
}


// Initializing bomb
function dropBomb(){
      if (player.ready && (player.activeBomb < player.totalBombs)) {
            player.score -= 300;
            player.bombScore++;
            player.activeBomb++;
            let bomb = document.createElement("div");
            bomb.classList.add("bomb");
            bomb.y = player.y+ 100;
            bomb.x = player.x + 100;
            bomb.style.left = bomb.x + "px";
            bomb.style.top = bomb.y + "px";
            gameArea.appendChild(bomb);
            player.ready = false;
            setTimeout(function() {
                  player.ready = true;
            }, 500);
      }
}

// drop bomb in vertical axis
function moveBomb() {
      let bombs = document.querySelectorAll(".bomb");
      bombs.forEach(function(boom) {
            boom.y += 5;
            boom.style.top = boom.y + "px";
            if (boom.y > 1220) {
                  player.activeBomb--;
                  boom.parentElement.removeChild(boom); 
            } 
            // removing the element on colliding
            if (!isCollide(boom, player.target)) {
                  player.score += 2000;
                  player.activeBomb--;
                  player.target.parentElement.removeChild(player.target);
                  boom.parentElement.removeChild(boom);
                  displayTargets();
              }
      });
}

// Creating the collide functionality b/w bomb and target
function isCollide(a, b) {
      let rectA = a.getBoundingClientRect();
      let rectB = b.getBoundingClientRect();
      // Checking the vertical and horizontal axis of both values if they collide each other;
      return (
            (rectA.bottom < rectB.top) || (rectA.top > rectB.bottom) || (rectA.right < rectB.left) ||(rectA.left > rectB.right)
      )
}

// starting the game and setting the keys for plane so it moves within the screen and animation
function playGame() {
      if (player.inPlay) {
            moveBomb();
            // dropping the bomb
            if (keys.space) {
                  dropBomb();
            }
            if (keys.ArrowUp && player.y > 75) {
                  player.y -= player.speed;
            }
            if (keys.ArrowDown && player.y < 300) {
                  player.y += player.speed;
            }
            if (keys.ArrowLeft && player.x > 0) {
                  player.x -= player.speed;
            }
            if (keys.ArrowRight && player. x < (gameArea.offsetWidth - 50)) {
                  player.x += player.speed;
            }

            // moving the plane forward always
            player.x += (player.speed * 2)
            if (player.x > gameArea.offsetWidth) {
                  player.x = 0;
                  player.score -= 100;
            }
            player.score--;
            if (player.score < 1) {
                  player.score = 0;
                  endGame();
            } 
            player.plane.style.left = player.x + 'px';
            player.plane.style.top = player.y + 'px';
            window.requestAnimationFrame(playGame);
            score.innerHTML = "Score: " + player.score;
      }
}
