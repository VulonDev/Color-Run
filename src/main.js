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
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

//define colors as vars so you can just do 'xxxxx = blue' later
let black = 0;
let white = 1;
let blue = 2;
let red = 3;
let green = 4;

//reserve keyboard
let keyW, keyA, keyS, keyD, keySPACE;

//adjustable game settings. 
//these are used in a bunch of different classes, and basically they're all her to be changed in one spot
game.settings = {
    obstacleSpeed: 3, //the speed of nonplayer objects scrolling across the screen
    playerSpeed: 3, //THIS IS THE JUMP/FALL speed. the player does not move left and right.
    jumpTime: 1000, //how long the vertical portion of a players jump will last (milliseconds)
    pickupDuration: 1500, //how long the all-colors powerup item lasts (milliseconds)
    pickupPoints: 100, //how much the bonus points pickup item is worth
}