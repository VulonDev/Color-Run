class Obstacle extends Phaser.GameBojects.Sprite {
    constructor(scene, x, y, texture, frame, color) {
        super (scene, x, y, texture, frame);
        this.color = color;
        this.moveSpeed = game.settings.obstacleSpeed;
    }

    update() {
        //slide obstacles across the screen right -> left
        //if an obstacle exits the left side of the screen, destroy it
        this.x -= obstacleSpeed;
        if(this.x <= 0 - this.width) {
            this.destroy();
        } 
    }
}