class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {

    }

    create() {
        //game over flag
        this.gameOver = false;

        //define keys
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //init score
        this.score = 0;
    }

    update() {

        //update currently living sprites while game isn't over
        if(!this.gameOver) {

        }
        //if the game isnt over, sprite update stops
        //now display game over screen and listen for restart
        else {

            //SPACE to restart, W for menu
            if(Phaser.Input.Keyboard.JustDown(keySPACE)){
                this.scene.restart();
            }
            if(Phaser.Input.Keyboard.JustDown(keyW)) {
                this.scene.start("menuScene");
            }
        }

    }

    //AABB collision checking 
    checkCollison(objA, objB) {
        if(objA.x < objB.x + objB.width &&
            objA.x + objA.width > objB.x &&
            objA.y < objB.y + objB.height &&
            objA.height + objA.y > objB.y) {
            return true;
        }
        else {
            return false;
        }
    }

    //comparing object colors, to see if a collision is fatal
    //returns true if the objects have the same color
    //returns true if at least one object is white, since white is ok with all colors
    //returns false otherwise
    //EVERY SINGLE COLLIDABLE OBJECT SHOULD HAVE THE COLOR PROPERTY
    checkColors(objA, objB) {
        if(objA.color == white || objB.color == white ) {
            return true;
        }
        else if (objA.color == objB.color) {
            return true;
        }
        else {
            return false;
        }
    }
}