class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, color) {
        super (scene, x, y, texture, frame);  
        this.color = color;
        this.moveSpeed = game.settings.obstacleSpeed;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        //slide obstacles across the screen right -> left
    }

    update() {
        this.body.setAllowGravity(false);
        this.setPushable(false);
        this.setMaxVelocity(0,0);
        //this.setVelocityX(-50);   turned off moving for testing
        this.x -= this.moveSpeed; /*previously someone had set this to "this.movespeed * 1.25". 
        note movespeed = game.settings.obstacleSpeed, and all obstacles/items move at this speed.
        game.settings is in main.js. all these kind of speed variables can be changed in one place over there. 
        therefore, I altered main.js obstacle speed instead. that one line will also alter the speed of pickup items, so we can affect
        multiple classes at once if we want. Basically, all the settings are in one place.
        I think its neater this way, dont you? -Elizabeth*/
        //if an obstacle exits the left side of the screen, destroy it
        if(this.x <= 0 - this.width) {
            this.destroy();      
        } 
    }
}