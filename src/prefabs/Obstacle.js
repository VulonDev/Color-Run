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
        //this.setVelocityX(-50);   turned off moving for testing
        this.x -= this.moveSpeed * 1.25;
        //if an obstacle exits the left side of the screen, destroy it
        if(this.x <= 0 - this.width) {
            this.destroy();      
        } 
    }
}