// Collaborators: Elizabeth Arnold, Ryan Hueckel, Ziyang Li, and Autumn Plaxco
// Game Title: Color Run
// Date Completed: May 1, 2022
// Creative Tilt Justification:
//  - In terms of technical creativity, we were proud of the way we implemented randomness in our game's design.
//    Not only were the obstacles themselves, both their layout and their color, randomly generated, so were the
//    locations and colors or the collectibles themselves. Such degrees of randomness to ours game's design
//    assists in generating new challenges each time the player plays the game. In particular we were proud of
//    how we went about randomly generating obstacles. First, we had a function which created a single obstacle 
//    of a random color (red, green, or blue) at a specified x, y coordinate, and then implemented several different
//    functions which used this to create different layouts of these obstacles with random colors. Lastly, we had a 
//    function which randomly called one of these obstacle layout functions, adding furtheer depth to our game's
//    degree of randomness.
//  - In terms of visual/artistic creativity, we are proud of how we were able to create very simple pixel art in such
//    a way that supported our game's mechanics and themes. Because the game revolves around changing colors to avoid
//    obstacles (which in itself we thought was pretty unique concept to introduce into the Infinite Runner format, as 
//    it involves chaning the playable character's state to avoid obstacles, rather than only relying upon movement 
//    capabilities), we opted to choose a very simple visual style with a grayscale background to make the interactive 
//    elements of the game better pop out, as the colors of these elements are essential to ours game's mechanics. Each
//    of us do not have very much experience which art/sound within games, so we are generally just proud of how well
//    the visuals and sound turned out in the end despite our limited experience. In particular, the way that the player
//    sprite switches colors within the game while maintining the same animations, added some pretty good visual style.



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