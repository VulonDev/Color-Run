//main for infinite runner

let config = {
    type: Phaser.AUTO,
    width: 640,
    backgroundColor: '#000000',
    height: 480,
    scene: [Menu, Play],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
}

let game = new Phaser.Game(config);

//define colors as vars so you can just do 'xxxxx = blue' later
let black = 0;
let white = 1;
let blue = 2;
let red = 3;
let green = 4;

// global variables
let gameOver = false;
let collectPoint = false;
let obstaclesOnScreen = false;
let itemcollectSFX;
let gameoverSFX;

// reserve keyboard
let keyW, keyA, keyS, keyD, keySPACE, keyLEFT, keyRIGHT, keyUP;

//adjustable game settings. 
game.settings = {
    obstacleSpeed: 1.55, //the speed of nonplayer objects scrolling across the screen
    playerSpeed: -280, //THIS IS THE JUMP/FALL speed (the player does not move left and right)
    pickupDuration: 1500, //how long the all-colors powerup item lasts (milliseconds)
    pickupPoints: 50, //how much the bonus points pickup item is worth
    pointSpawnChance: 2, //the probablity that a points item will spawn, where spawn chance is 1/pointSpawnChance
    colorSpawnChance: 20, //see above but for allcolors item
    spawnSpeed: 1250, //how quickly new obstacles/items generate (milliseconds)
    difficultySpeed: 1000 //game speed increases every [this var] (milliseconds)
}