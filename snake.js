// Remember canvas gives us dimensions in pixels (1-pixel each), to convert it into a square box(to make it visible) we've multiplied it with 25px

const foodSound = new Audio('audio/food.mp3');
const gameOverSound = new Audio('audio/gameover.mp3');
const moveSound = new Audio('audio/move.mp3');
const musicSound = new Audio('audio/music.mp3');

//board
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;
var score = 0;

//snake head : this will initialize snake's head at (x: 5, y: 5) coordinate
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;


var velocityX = 0;
var velocityY = 0;

// similar to head except this time we've multiple coords to store. (2d matrix array)
var snakeBody = []; //to upgrade and join it's body we need an array which can store segments which contains[ (x1, y1), (x2, y2),....] as we move our snake


//food (initialization at (10,10)
var foodX; // = blockSize * 10;
var foodY; // = blockSize * 10;

var gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); // used for drawing/painting on the board

    placeFood();
    document.addEventListener("keyup", changeDirection);
    // update(); //this will execute only once, so...
    setInterval(update, 100);
}

function update(){
    musicSound.play();
    if(gameOver){
        musicSound.pause();
        return;
    }

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height); //from where(x, y) to where(x, y). FillRect() is used to display the box


    //write red first then lime: so that green can paint/overlap red whick looks like snake's eating food
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize); //from food point to boxsize dimension (a red square will get shown)

    if(snakeX == foodX && snakeY == foodY){ // if they're at exact same square
        // snakeBody.push(snakeX, snakeY);
        // instead:
        foodSound.play();
        score += 10;
        document.getElementById("scoreBox").innerText = "Score: " + score;
        snakeBody.push(foodX, foodY); // grow segment where the food was
        placeFood(); //random food generated everytime snake overlaps/eats it
    }


    //solution: we need to start from tail and go towards head. Move each segment forward by one(where the previous segment was).
    for(let i = snakeBody.length-1; i > 0; i--){
        snakeBody[i] = snakeBody[i-1]; 
    }
    if(snakeBody.length){// if there are body parts in array
        snakeBody[0] = [snakeX, snakeY]; //set segment before head to -> head
    }// now our body will move along with head


    context.fillStyle = "lime";
    // after changing directions paint it to the canvas
    snakeX += velocityX * blockSize; // snakeX += velocityX; //was movingg very slow, like 1px in 100 milliseconds
    snakeY += velocityY * blockSize; // snakeY += velocityY; //was movingg very slow, like 1px in 100 milliseconds
    context.fillRect(snakeX, snakeY, blockSize, blockSize); //from snake's head point till it's boxsize (a green square will get shown)

    for(let i = 0; i < snakeBody.length; i++){ // loop because it's an array
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize); //from snake's box point till it's boxsize
        // output: snake just leaves its body chilling where the food was
        // problem: we're not moving the body along with its head (imagine: head is detached with body)
    }


    // Gameover conditions
    // if snake goes out of boundary
    if(snakeX < 0 || snakeX > cols*blockSize - 1 || snakeY < 0 || snakeY > rows*blockSize - 1){
        gameOver = true;
        gameOverSound.play();
        musicSound.pause();
        alert("GameOver");
    }
    // if snake bumps into itself
    for(let i = 0; i < snakeBody.length; i++){
        if(snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
            gameOver = true;
            gameOverSound.play();
            musicSound.pause();
            alert("GameOver");
        }
    }

}

function placeFood(){
    //(0-1) * cols -> (0-19.9999) -> (0-19) * 25
    // foodX = Math.floor(Math.random() * cols) * blockSize;
    // foodY = Math.floor(Math.random() * rows) * blockSize;

    //(0-1) * cols -> (1-18.9999) -> (1-18) * 25
    foodX = (Math.floor(Math.random() * (cols-2)) + 1) * blockSize;
    foodY = (Math.floor(Math.random() * (rows-2)) + 1) * blockSize;
}

function changeDirection(event){
    // add && condition since we don't wanna move our snake both up and down at the same time otherwise it's gonna collide (same for left and right)
    moveSound.play();
    if(event.code == "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    }
    else if(event.code == "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }
    else if(event.code == "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }
    else if(event.code == "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }

}