// Game Constants & Variables
let inputDir = {x: 0, y: 0}; 
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/snakemusic.mp3');
let speed = parseInt(localStorage.getItem("snakeSpeed"));
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    {x: 13, y: 15}
];

food = {x: 6, y: 7};



// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    // console.log(ctime)
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // If you bump into the wall
    if(snake[0].x >= 30 || snake[0].x <=0 || snake[0].y >= 30 || snake[0].y <=0){
        return true;
    }
        
    return false;
}

function gameEngine(){
    // Part 1: Updating the snake array & Food
    if(isCollide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();
        inputDir =  {x: 0, y: 0}; 
        alert("Game Over. Press any key to play again!");
        snakeArr = [{x: 13, y: 15}];
        musicSound.play();
        score = 0; 
    }

    // If you have eaten the food, increment the score and regenerate the food
    if(snakeArr[0].y === food.y && snakeArr[0].x ===food.x){
        foodSound.play();
        score += 1;
        if(score>hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        let a = 2;
        let b = 16;
        food = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())}
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i>=0; i--) { 
        snakeArr[i+1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index)=>{
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if(index === 0){
            snakeElement.classList.add('head');
        }
        else{
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement);


}
// music feature
document.addEventListener("DOMContentLoaded", function () {
    const musicButton = document.getElementById("musicToggle");

    // Check if music was playing before and resume it
    if (localStorage.getItem("musicPlaying") === "true") {
        musicSound.play();
    }

    musicButton.addEventListener("click", () => {
        if (musicSound.paused) {
            musicSound.play();
            musicButton.textContent = "Pause Music";
            localStorage.setItem("musicPlaying", "true");
        } else {
            musicSound.pause();
            musicButton.textContent = "Play Music";
            localStorage.setItem("musicPlaying", "false");
        }
    });
});



// Ensure the button text updates correctly when the game starts
document.addEventListener("DOMContentLoaded", () => {
    if (!musicSound.paused) {
        musicButton.textContent = "Stop Music";
    }
});

// Main logic starts here
// musicSound.play();
let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e =>{
    inputDir = {x: 0, y: 1} // Start the game
    moveSound.play();

    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }

});

// Touchscreen controls
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes("gamepage.html")) {  
        
        let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;

        window.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        window.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;
            
            let diffX = touchEndX - touchStartX;
            let diffY = touchEndY - touchStartY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                // Horizontal swipe
                if (diffX > 0) {
                    console.log("Swipe Right");
                    inputDir.x = 1;
                    inputDir.y = 0;
                } else {
                    console.log("Swipe Left");
                    inputDir.x = -1;
                    inputDir.y = 0;
                }
            } else {
                // Vertical swipe
                if (diffY > 0) {
                    console.log("Swipe Down");
                    inputDir.x = 0;
                    inputDir.y = 1;
                } else {
                    console.log("Swipe Up");
                    inputDir.x = 0;
                    inputDir.y = -1;
                }
            }

            moveSound.play();
            
        });
    }
});

let isPaused = false; // Track game pause state

// Function to toggle pause
function togglePause() {
    isPaused = !isPaused;

    if (isPaused) {
        musicSound.pause(); // Pause music
    } else {
        if (localStorage.getItem("musicPlaying") === "true") {
            musicSound.play(); // Resume music if it was enabled
        }
        window.requestAnimationFrame(main); // Resume the game loop
    }
}

// Modify the main function to respect pause state
function main(ctime) {
    if (isPaused) return; // Stop updating when paused

    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

// Ensure pause button works
document.addEventListener("DOMContentLoaded", function () {
    let pauseButton = document.getElementById("pauseButton");
    if (pauseButton) {
        pauseButton.addEventListener("click", togglePause);
    }

    // Ensure music starts if it was on
    if (localStorage.getItem("musicPlaying") === "true") {
        musicSound.play();
    }
});

