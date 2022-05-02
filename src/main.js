//main for infinite runner

/*
so far ive just written a bunch of code and exactly 0 assets.
because literally nothing has even the most basic colors i havent tested it yet.
probably like,,,, some of it works? but definitely at least one thing will break.
i suspect the way im using delayedCall in Player.js might be a problem, but I can't check
the Phaser docs to figure it out until i have internet again.

(specifically, i suspect the problem with delayedCall will be to do with the 'this' statement at the end of
the delayedcall. 'this' in the context i was copying it over from meant 'the play scene' since
the models for delayedcall that i had were in the play scene. it might be possible to use
this.scene in player.js to reference the scene the player sprite is in.)
*/

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

//reserve keyboard
let keyW, keyA, keyS, keyD, keySPACE, keyLEFT, keyRIGHT, keyUP;

//adjustable game settings. 
//these are used in a bunch of different classes, and basically they're all her to be changed in one spot
game.settings = {
    obstacleSpeed: 1.55, //the speed of nonplayer objects scrolling across the screen
    playerSpeed: -280, //THIS IS THE JUMP/FALL speed. the player does not move left and right.
    pickupDuration: 1500, //how long the all-colors powerup item lasts (milliseconds)
    pickupPoints: 50, //how much the bonus points pickup item is worth
    pointSpawnChance: 2, //the probablity that a points item will spawn, where spawn chance is 1/pointSpawnChance
    colorSpawnChance: 20, //see above but for allcolors item
    spawnSpeed: 1250, //how quickly new obstacles/items generate (milliseconds)
    difficultySpeed: 1000 //game speed increases every [this var] (milliseconds)
}